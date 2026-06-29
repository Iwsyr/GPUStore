const { verifyToken } = require('../middleware/auth');
const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.use(verifyToken);

// 获取用户所有收藏
router.get('/', async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('获取收藏失败:', err);
    res.status(500).json({ message: '获取收藏失败' });
  }
});

// 添加收藏
router.post('/', async (req, res) => {
  const { product_id, type, target_type, title, desc_text } = req.body;
  const user_id = req.user.id;
  if (!type) return res.status(400).json({ message: 'type 为必填' });

  // 收藏商品时必须验证商品是否存在，防止产生孤儿数据
  const effectiveTarget = target_type || 'product';
  if (effectiveTarget === 'product') {
    if (!product_id) {
      return res.status(400).json({ message: '收藏商品时 product_id 不能为空' });
    }
    try {
      const [prod] = await db.execute('SELECT id FROM products WHERE id = ?', [product_id]);
      if (prod.length === 0) {
        return res.status(404).json({ message: '商品不存在' });
      }
    } catch (err) {
      console.error('验证商品失败:', err);
      return res.status(500).json({ message: '验证商品失败' });
    }
  }

  try {
    const [existing] = await db.execute(
      'SELECT id FROM favorites WHERE user_id=? AND product_id=? AND type=?',
      [user_id, product_id || null, type]
    );
    if (existing.length > 0) return res.status(200).json({ message: '已存在' });
    const [result] = await db.execute(
      'INSERT INTO favorites (user_id, product_id, type, target_type, title, desc_text) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, product_id || null, type, effectiveTarget, title || '', desc_text || '']
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('添加收藏失败:', err);
    res.status(500).json({ message: '添加收藏失败' });
  }
});

// 删除收藏
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    const [result] = await db.execute('DELETE FROM favorites WHERE id = ? AND user_id = ?', [id, user_id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: '未找到收藏或无权限' });
    res.json({ message: '删除成功' });
  } catch (err) {
    console.error('删除收藏失败:', err);
    res.status(500).json({ message: '删除收藏失败' });
  }
});

module.exports = router;
