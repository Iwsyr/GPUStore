const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, name FROM categories ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('获取分类失败:', err);
    res.status(500).json({ message: '获取分类失败' });
  }
});

module.exports = router;