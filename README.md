# GPUStore 显卡商城

一个基于 Vue 3 + Express + MySQL 的全栈电商项目，专注于显卡产品的在线展示、购买和订单管理。

## 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Vue 3 | ^3.2.13 |
| UI 组件库 | Vant 4 | ^4.9.19 |
| 状态管理 | Pinia | ^3.0.3 |
| 路由 | Vue Router 4 | ^4.5.1 |
| HTTP 请求 | Axios | ^1.15.2 |
| 后端框架 | Express | ^5.2.1 |
| 数据库 | MySQL 8 | - |
| 数据库驱动 | mysql2 | ^3.22.2 |
| 认证 | JWT + bcryptjs | - |
| 构建工具 | Vue CLI 5 | ~5.0.0 |

## 项目结构

```
GPUStore/
├── backend/                     # 后端服务
│   ├── config/
│   │   └── database.js          # 数据库连接池配置
│   ├── middleware/
│   │   └── auth.js              # JWT 认证中间件
│   ├── routes/
│   │   ├── auth.js              # 用户注册/登录
│   │   ├── products.js          # 商品 CRUD
│   │   ├── carts.js             # 购物车管理
│   │   ├── orders.js            # 订单管理
│   │   ├── reviews.js           # 商品评价
│   │   ├── addresses.js         # 收货地址
│   │   ├── favorites.js         # 商品收藏
│   │   ├── categories.js        # 商品分类
│   │   ├── news.js              # 新闻资讯
│   │   ├── admin.js             # 管理员接口
│   │   └── inventory.js         # 库存管理
│   ├── server.js                # 后端入口
│   ├── init.sql                 # 数据库初始化脚本
│   └── .env                     # 环境变量配置
├── src/                         # 前端源码
│   ├── components/
│   │   ├── Home/                # 首页（轮播、分类导航、商品展示）
│   │   ├── Shop/                # 商品列表/分类筛选
│   │   ├── Cart/                # 购物车
│   │   ├── productinfo/         # 商品详情
│   │   ├── pay/                 # 结算/支付
│   │   ├── my/                  # 个人中心（订单、地址、收藏）
│   │   ├── review/              # 商品评价
│   │   ├── News/                # 新闻资讯
│   │   └── Bottom/              # 底部 TabBar
│   ├── views/
│   │   ├── Login.vue            # 登录页
│   │   ├── Register.vue         # 注册页
│   │   └── Admin.vue            # 管理后台
│   ├── store/
│   │   ├── shopStore.js         # 购物车/订单状态
│   │   └── authStore.js         # 认证状态
│   ├── services/
│   │   └── api.js               # 封装所有 API 请求
│   ├── router.js                # 前端路由配置
│   └── main.js                  # 前端入口
├── vue.config.js                # Vue CLI 配置（含代理）
└── package.json
```

## 快速开始

### 环境要求

- Node.js >= 16
- MySQL >= 8.0
- npm >= 7

### 1. 克隆项目

```bash
git clone <项目地址>
cd GPUStore
```

### 2. 配置数据库

在 MySQL 中创建数据库并导入表结构：

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE gpustore CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

# 导入表结构与初始数据
USE gpustore;
SOURCE backend/init.sql;

# 退出
exit
```

### 3. 配置后端环境变量

编辑 `backend/.env` 文件，修改为你的数据库连接信息：

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=你的数据库密码
DB_NAME=gpustore
PORT=3000
JWT_SECRET=自定义密钥字符串
```

### 4. 安装依赖并启动

**后端：**

```bash
cd backend
npm install
npm start        # 启动在 http://localhost:3000
```

**前端（新开一个终端）：**

```bash
# 在项目根目录
npm install
npm run serve    # 启动在 http://localhost:8080
```

### 5. 访问项目

打开浏览器访问 `http://localhost:8080`

默认管理员账号：`admin`，密码需通过注册功能设置。

## 功能模块

### 用户端

| 模块 | 功能 |
|------|------|
| 首页 | 轮播图、分类导航、商品推荐、搜索 |
| 商品列表 | 按分类筛选、商品搜索 |
| 商品详情 | 商品信息、图片轮播、规格选择 |
| 购物车 | 添加/删除商品、数量调整、商品选中结算 |
| 订单管理 | 创建订单、取消订单、支付模拟、确认收货、评价商品、删除订单 |
| 收货地址 | 新增/编辑/删除地址、设置默认地址 |
| 商品收藏 | 收藏/取消收藏商品 |
| 个人中心 | 用户信息、订单入口、地址管理、收藏管理 |

### 管理后台

| 功能 | 说明 |
|------|------|
| 用户管理 | 查看所有用户信息 |
| 订单管理 | 查看所有用户订单 |
| 库存管理 | 商品库存查询、单个/批量修改库存 |

### 订单状态流转

```
pending（待付款）
  ├── cancelled（已取消）
  └── shipped（待收货）
       └── delivered（待评价）
            └── completed（已完成）
```

## API 接口概览

| 前缀 | 路由 | 说明 |
|------|------|------|
| `/api/auth` | POST `/login`、`/register`、GET `/me` | 用户认证 |
| `/api/products` | GET `/`、GET `/:id`、POST `/`、PUT `/:id`、DELETE `/:id` | 商品管理 |
| `/api/carts` | GET `/`、POST `/`、PUT `/:id`、DELETE `/:id` | 购物车 |
| `/api/orders` | GET `/`、GET `/:id`、POST `/`、PUT `/:id/status`、PUT `/:id/cancel`、DELETE `/:id` | 订单管理 |
| `/api/reviews` | POST `/`（提交评价）、GET `/?product_id=`（获取评价） | 商品评价 |
| `/api/addresses` | GET `/`、POST `/`、PUT `/:id`、DELETE `/:id` | 收货地址 |
| `/api/favorites` | GET `/`、POST `/`、DELETE `/:id` | 商品收藏 |
| `/api/admin` | GET `/orders`、GET `/users`、GET `/inventory`、PUT `/inventory/:id`、PUT `/inventory/batch` | 管理后台 |

## 开发说明

### 前端代理配置

前端开发服务器通过 `vue.config.js` 配置代理，将 `/api` 请求转发至后端 `http://localhost:3000`：

```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

### 数据库表结构

核心表：`users`、`products`、`carts`、`orders`、`order_items`、`addresses`、`favorites`、`reviews`、`product_summary`、`categories`、`news`

详细建表语句见 `backend/init.sql`。

## License

MIT
