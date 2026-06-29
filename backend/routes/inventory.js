const express = require('express');
const db = require('../config/database');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.use(verifyToken, requireAdmin);

function getStockStatus(stock) {
  if (stock > 20) return '充足';
  if (stock > 10) return '紧张';
  return '缺货预警';
}

router.get('/', async (req, res) => {
  try {
    const { search, status, page, pageSize } = req.query;

    // 安全解析分页参数：防止空字符串或非数字导致 parseInt 返回 NaN
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const sizeNum = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 10));
    const offset = (pageNum - 1) * sizeNum;

    let sql = 'SELECT p.id, p.title AS name, p.stock, ps.stock AS summary_stock FROM products p LEFT JOIN product_summary ps ON p.id = ps.id WHERE 1=1';
    let countSql = 'SELECT COUNT(*) AS total FROM products p WHERE 1=1';
    const params = [];
    const countParams = [];

    if (search) {
      sql += ' AND p.title LIKE ?';
      countSql += ' AND p.title LIKE ?';
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    const [countRows] = await db.execute(countSql, countParams);
    const total = countRows[0].total;

    sql += ' ORDER BY p.id ASC LIMIT ? OFFSET ?';
    params.push(sizeNum, offset);

// 使用 query 而非 execute：避免预处理语句对 LIMIT/OFFSET 参数类型校验导致的问题
    const [rows] = await db.query(sql, params);

    let result = rows.map(item => ({
      id: item.id,
      name: item.name,
      stock: item.stock,
      status: getStockStatus(item.stock)
    }));

    if (status) {
      result = result.filter(item => item.status === status);
    }

    res.json({
      total,
      page: pageNum,
      pageSize: sizeNum,
      data: result
    });
  } catch (err) {
    console.error('获取库存列表失败:', err);
    res.status(500).json({ message: '获取库存列表失败' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  if (stock === undefined || stock === null || !Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({ message: '库存数量必须为非负整数' });
  }

  const connection = await db.getConnection();
  try {
    const [product] = await connection.execute('SELECT * FROM products WHERE id = ?', [id]);
    if (product.length === 0) {
      return res.status(404).json({ message: '商品不存在' });
    }

    const oldStock = product[0].stock;

    await connection.beginTransaction();

    await connection.execute('UPDATE products SET stock = ? WHERE id = ?', [stock, id]);
    // 触发器 trg_products_update_summary 会自动同步 product_summary，无需手动更新

    await connection.execute(
      'INSERT INTO inventory_logs (admin_id, product_id, old_stock, new_stock, change_reason) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, id, oldStock, stock, '管理员手动修改库存']
    );

    await connection.commit();

    const [updated] = await connection.execute('SELECT id, title AS name, stock FROM products WHERE id = ?', [id]);
    res.json({
      ...updated[0],
      status: getStockStatus(updated[0].stock)
    });
  } catch (err) {
    await connection.rollback();
    console.error('修改库存失败:', err);
    res.status(500).json({ message: '修改库存失败' });
  } finally {
    connection.release();
  }
});

router.put('/batch', async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: '请提供要批量修改的商品列表' });
  }

  for (const item of items) {
    if (item.stock === undefined || item.stock === null || !Number.isInteger(item.stock) || item.stock < 0) {
      return res.status(400).json({ message: `商品ID ${item.id} 的库存数量必须为非负整数` });
    }
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    for (const item of items) {
      const [product] = await connection.execute('SELECT stock FROM products WHERE id = ?', [item.id]);
      if (product.length === 0) {
        throw { status: 404, message: `商品ID ${item.id} 不存在` };
      }

      const oldStock = product[0].stock;

      await connection.execute('UPDATE products SET stock = ? WHERE id = ?', [item.stock, item.id]);
      // 触发器 trg_products_update_summary 会自动同步 product_summary，无需手动更新

      await connection.execute(
        'INSERT INTO inventory_logs (admin_id, product_id, old_stock, new_stock, change_reason) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, item.id, oldStock, item.stock, '管理员批量修改库存']
      );
    }

    await connection.commit();

    const ids = items.map(i => i.id);
    const placeholders = ids.map(() => '?').join(',');
    const [updated] = await db.execute(`SELECT id, title AS name, stock FROM products WHERE id IN (${placeholders}) ORDER BY id`, ids);

    res.json({
      message: '批量更新成功',
      data: updated.map(item => ({
        ...item,
        status: getStockStatus(item.stock)
      }))
    });
  } catch (err) {
    await connection.rollback();
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    console.error('批量修改库存失败:', err);
    res.status(500).json({ message: '批量修改库存失败' });
  } finally {
    connection.release();
  }
});

module.exports = router;
