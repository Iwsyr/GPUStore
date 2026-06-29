const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { generateToken, verifyToken } = require('../middleware/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, confirmPassword, email, phone } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ message: '用户名、密码和确认密码为必填项' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: '两次输入的密码不一致' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: '密码长度不能少于6位' });
  }

  if (phone && !/^1\d{10}$/.test(phone)) {
    return res.status(400).json({ message: '手机号格式不正确，请输入11位手机号' });
  }

  // 用户名特殊字符校验
  if (/[^a-zA-Z0-9\u4e00-\u9fa5]/.test(username)) {
    return res.status(400).json({ message: '用户名不能包含特殊字符' });
  }

  if (username === 'admin') {
    return res.status(400).json({ message: '不允许注册该用户名' });
  }

  try {
    const queryParams = [username];
    let querySql = 'SELECT id FROM users WHERE username = ?';
    if (email) {
      querySql += ' OR email = ?';
      queryParams.push(email);
    }
    const [existing] = await db.execute(querySql, queryParams);
    if (existing.length > 0) {
      return res.status(400).json({ message: '用户名或邮箱已被注册' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await db.execute(
      'INSERT INTO users (username, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [username, email || null, phone || null, password_hash, 'user']
    );

    const user = { id: result.insertId, username, role: 'user' };
    const token = generateToken(user);

    res.status(201).json({
      message: '注册成功',
      token,
      user: { id: result.insertId, username, email: email || '', phone: phone || '', role: 'user' }
    });
    } catch (err) {
    console.error('注册失败:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: '用户名或邮箱已被注册' });
    }
    res.status(500).json({ message: '注册失败，请稍后重试' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码为必填项' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const token = generateToken(user);
    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email || '',
        phone: user.phone || '',
        role: user.role
      }
    });
  } catch (err) {
    console.error('登录失败:', err);
    res.status(500).json({ message: '登录失败，请稍后重试' });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, username, email, phone, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('获取用户信息失败:', err);
    res.status(500).json({ message: '获取用户信息失败' });
  }
});

module.exports = router;