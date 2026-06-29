const express = require('express');
const db = require('../config/database');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.use(verifyToken, requireAdmin);
// 管理员获取所有订单
router.get('/orders', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT o.*, u.username, u.email FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('获取管理员订单失败:', err);
    res.status(500).json({ message: '获取管理员订单失败' });
  }
});

// 管理员获取所有用户
router.get('/users', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, username, email, role, created_at FROM users ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('获取用户列表失败:', err);
    res.status(500).json({ message: '获取用户列表失败' });
  }
});

module.exports = router;
