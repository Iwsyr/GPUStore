const { verifyToken } = require('../middleware/auth');
const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.use(verifyToken);

// 提交评价（支持订单内多个商品分别评价）
router.post('/', async (req, res) => {
  const { order_id, reviews } = req.body;
  const userId = req.user.id;

  if (!order_id || !Array.isArray(reviews) || reviews.length === 0) {
    return res.status(400).json({ message: '参数错误' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 校验订单归属和状态
    const [orders] = await connection.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [order_id, userId]
    );
    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: '订单不存在' });
    }
    if (orders[0].status !== 'delivered') {
      await connection.rollback();
      return res.status(400).json({ message: '只能评价待评价订单' });
    }

    // 插入评价记录
    for (const review of reviews) {
      const { product_id, rating, content, images } = review;
      await connection.execute(
        'INSERT INTO reviews (order_id, product_id, user_id, rating, content, images) VALUES (?, ?, ?, ?, ?, ?)',
        [order_id, product_id, rating || 5, content || '', JSON.stringify(images || [])]
      );
    }

    // 更新订单状态为已完成
    await connection.execute(
      "UPDATE orders SET status = 'completed' WHERE id = ?",
      [order_id]
    );

    await connection.commit();
    res.json({ message: '评价提交成功' });
  } catch (err) {
    await connection.rollback();
    console.error('提交评价失败:', err);
    res.status(500).json({ message: '提交评价失败' });
  } finally {
    connection.release();
  }
});

// 获取商品评价列表
router.get('/', async (req, res) => {
  const { product_id } = req.query;
  if (!product_id) {
    return res.status(400).json({ message: '缺少商品ID' });
  }

  try {
    const [reviews] = await db.execute(
      `SELECT r.*, u.username as user_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.product_id = ? 
       ORDER BY r.created_at DESC`,
      [product_id]
    );
    res.json(reviews);
  } catch (err) {
    console.error('获取评价失败:', err);
    res.status(500).json({ message: '获取评价失败' });
  }
});

module.exports = router;
