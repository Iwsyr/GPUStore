const { verifyToken } = require('../middleware/auth');
const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.use(verifyToken);

// 获取订单列表
router.get('/', async (req, res) => {
  const userId = req.user.id;
  try {
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    for (const order of orders) {
      const [items] = await db.execute(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error('获取订单失败:', err);
    res.status(500).json({ message: '获取订单失败' });
  }
});

// 获取单个订单详情
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    if (orders.length === 0) {
      return res.status(404).json({ message: '订单不存在' });
    }
    const order = orders[0];
    const [items] = await db.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order.id]
    );
    order.items = items;
    res.json(order);
  } catch (err) {
    console.error('获取订单详情失败:', err);
    res.status(500).json({ message: '获取订单详情失败' });
  }
});

// 创建订单（支持商品明细，事务扣减库存）
router.post('/', async (req, res) => {
  const { items } = req.body;
  const user_id = req.user.id;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: '订单商品列表不能为空' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    let total_price = 0;

    for (const item of items) {
      const [product] = await connection.execute(
        'SELECT id, title AS name, price, stock FROM products WHERE id = ? FOR UPDATE',
        [item.product_id]
      );
      if (product.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: `商品ID ${item.product_id} 不存在` });
      }

      const dbProduct = product[0];
      const quantity = item.quantity || 1;

      if (dbProduct.stock < quantity) {
        await connection.rollback();
        return res.status(409).json({
          message: `商品 "${dbProduct.name}" 库存不足，当前库存 ${dbProduct.stock} 件，需要 ${quantity} 件`,
          code: 'STOCK_INSUFFICIENT',
          product_id: item.product_id
        });
      }

      // 使用数据库真实价格计算总价，防止前端篡改价格
      total_price += dbProduct.price * quantity;
    }

    const [result] = await connection.execute(
      'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
      [user_id, total_price, 'pending']
    );
    const orderId = result.insertId;

    for (const item of items) {
      const quantity = item.quantity || 1;

      const [product] = await connection.execute(
        'SELECT title AS name, price, image_url FROM products WHERE id = ?',
        [item.product_id]
      );

      await connection.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [quantity, item.product_id]
      );

      await connection.execute(
        'UPDATE product_summary SET stock = stock - ? WHERE id = ?',
        [quantity, item.product_id]
      );

      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.product_id, product[0].name, product[0].price, quantity, product[0].image_url || '']
      );
    }

    await connection.commit();
    res.status(201).json({ id: orderId, user_id, total_price, status: 'pending' });
  } catch (err) {
    await connection.rollback();
    console.error('创建订单失败:', err);
    res.status(500).json({ message: '创建订单失败' });
  } finally {
    connection.release();
  }
});

// 取消订单（回滚库存）
router.put('/:id/cancel', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [orders] = await connection.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: '订单不存在' });
    }
    const order = orders[0];
    if (order.status !== 'pending') {
      await connection.rollback();
      return res.status(400).json({ message: '只能取消待付款订单' });
    }

    const [items] = await connection.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );
    for (const item of items) {
      await connection.execute(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
      await connection.execute(
        'UPDATE product_summary SET stock = stock + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    await connection.execute(
      "UPDATE orders SET status = 'cancelled' WHERE id = ?",
      [id]
    );

    await connection.commit();
    res.json({ message: '订单已取消', id: parseInt(id) });
  } catch (err) {
    await connection.rollback();
    console.error('取消订单失败:', err);
    res.status(500).json({ message: '取消订单失败' });
  } finally {
    connection.release();
  }
});

// 修改订单状态
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  const validTransitions = {
    'pending': ['shipped', 'cancelled'],
    'paid': ['shipped'],
    'shipped': ['delivered'],
    'delivered': ['completed']
  };

  // 收集所有合法的目标状态（所有可转到的状态 + cancelled）
  const allValidTargets = [...new Set(Object.values(validTransitions).flat())];
  if (!allValidTargets.includes(status)) {
    return res.status(400).json({ message: '无效的目标状态' });
  }

  try {
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    if (orders.length === 0) {
      return res.status(404).json({ message: '订单不存在' });
    }

    const currentStatus = orders[0].status;
    const allowedNext = validTransitions[currentStatus] || [];
    if (!allowedNext.includes(status)) {
      return res.status(400).json({ message: `订单当前状态为 ${currentStatus}，无法变更为 ${status}` });
    }

    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: '状态更新成功', id: parseInt(id), status });
  } catch (err) {
    console.error('更新订单状态失败:', err);
    res.status(500).json({ message: '更新订单状态失败' });
  }
});

// 删除订单
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [orders] = await connection.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: '订单不存在' });
    }
    if (!['completed', 'cancelled'].includes(orders[0].status)) {
      await connection.rollback();
      return res.status(400).json({ message: '只能删除已完成或已取消的订单' });
    }

    await connection.execute('DELETE FROM order_items WHERE order_id = ?', [id]);
    await connection.execute('DELETE FROM orders WHERE id = ?', [id]);

    await connection.commit();
    res.json({ message: '订单已删除', id: parseInt(id) });
  } catch (err) {
    await connection.rollback();
    console.error('删除订单失败:', err);
    res.status(500).json({ message: '删除订单失败' });
  } finally {
    connection.release();
  }
});

module.exports = router;
