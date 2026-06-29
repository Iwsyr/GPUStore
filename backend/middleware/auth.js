const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('环境变量 JWT_SECRET 未设置，服务器无法启动');
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未登录，请先登录' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: '登录已过期，请重新登录' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: '权限不足，需要管理员权限' });
  }
}

async function initAdminUser() {
  try {
    const bcrypt = require('bcryptjs');
    const [rows] = await db.execute('SELECT id FROM users WHERE username = ?', ['admin']);
    if (rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('123456', salt);
      await db.execute(
        'INSERT INTO users (username, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        ['admin', 'admin@gpustore.com', '13800000000', hash, 'admin']
      );
      console.log('管理员账号初始化成功 (admin / 123456)');
    } else {
      console.log('管理员账号已存在，跳过初始化');
    }
  } catch (err) {
    console.error('初始化管理员账号失败:', err);
  }
}

module.exports = { generateToken, verifyToken, requireAdmin, initAdminUser };