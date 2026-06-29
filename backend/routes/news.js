const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, title, description AS `desc`, image_url, publish_date AS `date` FROM news ORDER BY publish_date DESC');
    res.json(rows);
  } catch (err) {
    console.error('获取新闻失败:', err);
    res.status(500).json({ message: '获取新闻失败' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, title, description AS `desc`, image_url, publish_date AS `date`, detail_html AS detail FROM news WHERE id = ?', [parseInt(req.params.id)]);
    if (rows.length === 0) return res.status(404).json({ message: '未找到新闻' });
    res.json(rows[0]);
  } catch (err) {
    console.error('获取新闻失败:', err);
    res.status(500).json({ message: '获取新闻失败' });
  }
});

module.exports = router;