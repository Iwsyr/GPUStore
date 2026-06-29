const express = require('express');
const db = require('../config/database');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// 获取产品列表（公开）
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('获取产品失败:', err);
    res.status(500).json({ message: '获取产品失败' });
  }
});

// 获取单个产品（公开）
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '未找到产品' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('获取产品失败:', err);
    res.status(500).json({ message: '获取产品失败' });
  }
});

// 添加产品（仅管理员）
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  const { name, price, description, category_id, image_url } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO products (name, price, description, category_id, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, price, description, category_id, image_url]
    );
    res.status(201).json({ id: result.insertId, name, price, description, category_id, image_url });
  } catch (err) {
    console.error('添加产品失败:', err);
    res.status(500).json({ message: '添加产品失败' });
  }
});

// 更新产品（仅管理员）
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category_id, image_url } = req.body;
  try {
    const [result] = await db.execute(
      'UPDATE products SET name = ?, price = ?, description = ?, category_id = ?, image_url = ? WHERE id = ?',
      [name, price, description, category_id, image_url, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '未找到产品' });
    }
    res.json({ id, name, price, description, category_id, image_url });
  } catch (err) {
    console.error('更新产品失败:', err);
    res.status(500).json({ message: '更新产品失败' });
  }
});

// 删除产品（仅管理员）
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '未找到产品' });
    }
    res.json({ message: '产品删除成功' });
  } catch (err) {
    console.error('删除产品失败:', err);
    res.status(500).json({ message: '删除产品失败' });
  }
});

// 获取产品列表摘要（公开）
router.get('/summary/list', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, category_id, name, price, image_url, stock FROM product_summary ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('获取产品摘要失败:', err);
    res.status(500).json({ message: '获取产品摘要失败' });
  }
});

// 获取产品图片（公开）
router.get('/:id/images', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT id, type, seq, image_url FROM product_images WHERE product_id = ? ORDER BY seq',
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error('获取产品图片失败:', err);
    res.status(500).json({ message: '获取产品图片失败' });
  }
});

module.exports = router;
