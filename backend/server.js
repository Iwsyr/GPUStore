const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const db = require('./config/database');
const { initAdminUser } = require('./middleware/auth');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const ordersRouter = require('./routes/orders');
const adminRouter = require('./routes/admin');
const inventoryRouter = require('./routes/inventory');
const authRouter = require('./routes/auth');
const newsRouter = require('./routes/news');
const categoriesRouter = require('./routes/categories');
const addressesRouter = require('./routes/addresses');
const favoritesRouter = require('./routes/favorites');
const reviewsRouter = require('./routes/reviews');
const app = express();
const PORT = process.env.PORT || 3000;

db.execute('SELECT 1')
  .then(() => {
    console.log('数据库连接成功');
    initAdminUser();
  })
  .catch(err => {
    console.error('数据库连接失败:', err);
    process.exit(1);
  });

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/admin/inventory', inventoryRouter);
app.use('/api/news', newsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/addresses', addressesRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/reviews', reviewsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'GPU商城后端API运行中' });
});

// 全局错误处理：捕获同步异常，防止进程崩溃
app.use((err, req, res, next) => {
  console.error('全局错误:', err);
  res.status(500).json({ message: '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
