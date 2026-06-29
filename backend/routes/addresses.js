const { verifyToken } = require('../middleware/auth');
const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.use(verifyToken);

// 获取用户所有地址
router.get('/', async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY isDefault DESC, id DESC',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('获取地址失败:', err);
    res.status(500).json({ message: '获取地址失败' });
  }
});

// 添加地址
router.post('/', async (req, res) => {
  const { name, tel, country, province, city, county, addressDetail, address, isDefault } = req.body;
  const user_id = req.user.id;
  if (!name || !tel) {
    return res.status(400).json({ message: 'name 和 tel 为必填' });
  }
  try {
    if (isDefault) {
      await db.execute('UPDATE addresses SET isDefault = 0 WHERE user_id = ?', [user_id]);
    }
    const [result] = await db.execute(
      'INSERT INTO addresses (user_id, name, tel, country, province, city, county, addressDetail, address, isDefault) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, name, tel, country || '', province || '', city || '', county || '', addressDetail || '', address || '', isDefault ? 1 : 0]
    );
    res.status(201).json({ id: result.insertId, user_id, name, tel, country, province, city, county, addressDetail, address, isDefault: !!isDefault });
  } catch (err) {
    console.error('添加地址失败:', err);
    res.status(500).json({ message: '添加地址失败' });
  }
});

// 更新地址
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, tel, country, province, city, county, addressDetail, address, isDefault } = req.body;
  const user_id = req.user.id;
  try {
    if (isDefault) {
      await db.execute('UPDATE addresses SET isDefault = 0 WHERE user_id = ?', [user_id]);
    }
    const [result] = await db.execute(
      'UPDATE addresses SET name=?, tel=?, country=?, province=?, city=?, county=?, addressDetail=?, address=?, isDefault=? WHERE id=? AND user_id=?',
      [name, tel, country, province, city, county, addressDetail, address, isDefault ? 1 : 0, id, user_id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: '未找到地址或无权限' });
    res.json({ message: '更新成功' });
  } catch (err) {
    console.error('更新地址失败:', err);
    res.status(500).json({ message: '更新地址失败' });
  }
});

// 删除地址
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    const [result] = await db.execute('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, user_id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: '未找到地址或无权限' });
    res.json({ message: '删除成功' });
  } catch (err) {
    console.error('删除地址失败:', err);
    res.status(500).json({ message: '删除地址失败' });
  }
});

module.exports = router;
