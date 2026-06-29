const { verifyToken } = require('../middleware/auth');
const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.use(verifyToken);

// 获取购物车 — 从 token 取 userId
router.get('/', async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.execute(
      'SELECT c.id, c.product_id, c.quantity, p.title, p.price, p.image_url, p.stock FROM carts c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('获取购物车失败:', err);
    res.status(500).json({ message: '获取购物车失败' });
  }
});

// 添加或更新购物车项
router.post('/', async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.id; 
  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ message: 'user_id、product_id 和 quantity 为必填' });
  }
  try {
    const [product] = await db.execute('SELECT stock FROM products WHERE id = ?', [product_id]);
    if (product.length === 0) {
      return res.status(404).json({ message: '商品不存在' });
    }
    if (product[0].stock <= 0) {
      return res.status(409).json({ message: '商品库存不足，暂时无法加入购物车', code: 'OUT_OF_STOCK' });
    }
    const [existing] = await db.execute(
      'SELECT id, quantity FROM carts WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );
    if (existing.length > 0) {
      const newQuantity = existing[0].quantity + quantity;
      if (newQuantity > product[0].stock) {
        return res.status(409).json({ message: `商品库存不足，当前库存 ${product[0].stock} 件`, code: 'STOCK_INSUFFICIENT' });
      }
      await db.execute('UPDATE carts SET quantity = ? WHERE id = ?', [newQuantity, existing[0].id]);
      return res.json({ id: existing[0].id, user_id, product_id, quantity: newQuantity });
    }
    if (quantity > product[0].stock) {
      return res.status(409).json({ message: `商品库存不足，当前库存 ${product[0].stock} 件`, code: 'STOCK_INSUFFICIENT' });
    }
    const [result] = await db.execute(
      'INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [user_id, product_id, quantity]
    );
    res.status(201).json({ id: result.insertId, user_id, product_id, quantity });
  } catch (err) {
    console.error('添加购物车失败:', err);
    res.status(500).json({ message: '添加购物车失败' });
  }
});

// 删除购物车项
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const [result] = await db.execute('DELETE FROM carts WHERE id = ? AND user_id = ?', [id, userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '未找到购物车项或无权限' });
    }
    res.json({ message: '购物车项删除成功' });
  } catch (err) {
    console.error('删除购物车失败:', err);
    res.status(500).json({ message: '删除购物车失败' });
  }
});

// 更新购物车项数量
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const userId = req.user.id;
  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: '数量必须大于0' });
  }
  try {
    const [result] = await db.execute(
      'UPDATE carts SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, id, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '未找到购物车项或无权限' });
    }
    res.json({ message: '更新成功', quantity });
  } catch (err) {
    console.error('更新购物车失败:', err);
    res.status(500).json({ message: '更新购物车失败' });
  }
});
module.exports = router;
