# 校园资料分享系统 (Campus Documents Sharing System)

本项目为小组合作的《软件项目基础实训》全栈单仓库项目。
包含基于 **Vue 3 + Vite** 的前端应用 和 基于 **Node.js + Express** 的后端服务。

## 📁 目录结构

```text
Campus-Documents-Sharing-System/
├── frontend/             # 前端项目 (Vue 3 + Element Plus)
│   ├── src/
│   │   ├── api/          # 后端接口 Axios 封装
│   │   ├── assets/       # 静态图片、样式资源
│   │   ├── components/   # 复用公共组件
│   │   ├── router/       # Vue Router 路由配置
│   │   ├── store/        # Pinia 状态管理
│   │   ├── views/        # 视图页面 (如 Login.vue 等)
│   │   ├── App.vue       # 根组件
│   │   └── main.js       # 前端入口文件
│   └── package.json      # 前端依赖配置
│
├── backend/              # 后端项目 (Node.js + Express + Sequelize)
│   ├── src/
│   │   ├── config/       # 配置相关 (如 database.js 数据库连接)
│   │   ├── controllers/  # 控制层逻辑
│   │   ├── middlewares/  # 中间件接口拦截器
│   │   ├── models/       # 数据库模型 (Sequelize)
│   │   ├── routes/       # API 路由
│   │   ├── utils/        # 工具函数
│   │   └── app.js        # 后端入口文件
│   ├── .env              # (不要提交到 Git) 本地环境变量
│   └── package.json      # 后端依赖配置
│
├── database.sql          # MySQL 初始建表脚本
├── README.md             # 本项目说明文档
└── .gitignore            # Git 忽略配置
```

## 🛠️ 环境依赖配置

为了可以在本地顺利跑通前后端，您需要本地环境与以下配置保持一致或兼容：

1. **Node.js**: `v20.20.0` (推荐使用最新的 LTS 版本)。
2. **MySQL**: `8.0` 版本 (MySQL Community Server)。

---

## 🏗️ 核心系统架构说明

### 1. 前端架构 (Vue 3 单页面应用)

前端采用 **Vite 构建**，以 **Vue 3 (Composition API)** 为核心。
主要选型：

- **UI 组件库**: Element Plus（提供表单、弹窗、布局等后台组件支持）。
- **路由控制**: Vue Router 4（分为用户端、管理端及公共页面）。
- **状态管理**: Pinia（轻量级、直观的全局状态维护）。
- **网络请求**: Axios（具有统一的鉴权 Token 拦截机制）。

**🔗 路由规划概览：**

- 公共路由：`/login`, `/register`
- 用户端：`/home` (首页), `/discover/tags`, `/discover/trending`, `/search`, `/resource/:id`, `/publish`, `/profile/`
- 管理端：`/admin` (首页看板), `/admin/users` (用户管理), `/admin/resources` (资源审核), `/admin/settings` (系统配置)

### 2. 后端架构 (Node.js 服务端)

采用 **Express** 框架提供稳定 RESTful API 服务。
主要机制：

- **ORM 数据操作**: Sequelize (封装所有 MySQL 的查询与关联)。
- **身份认证机制**: JWT + bcrypt (保障接口调用与密码校验安全)。
- **文件上传服务**: Multer (处理用户发布的附件资料并存储在服务器/云端)。

### 3. 数据表核心设计 (MySQL ER 图实现)

根据系统设计的 ER 图，数据库划分了以下核心表结构：

- **users (`用户表`)**：管理普通用户及 admin 账号、处理积分流向。
- **courses (`课程表`)**：存储课程类别及对应的学院归属。
- **resources (`资料表`)**：资源核心表，附带上传者、文件格式、消耗积分及审核状态字段。
- **tags & resource_tag_map (`标签及关联表`)**：实现复合维度的“发现-标签”搜索能力。
- 其余如 **download_records (`下载记录表`)**、**points_logs (`积分日志`)** 保障积分经济体系流转，**feedbacks, system_logs (`日志处理等保障表格`)**。

---

## 🚀 快速启动指南

### 1. 数据库初始化

1. 使用客户端 (Navicat/DataGrip 或命令行) 连接到您的本地 MySQL。
2. 在**项目根目录**所在的终端运行：
   ```bash
   mysql -u root -p
   ```
   然后输入您的数据库密码登录。
3. 成功进入 MySQL 控制台后，运行以下命令导入 SQL 脚本：
   ```sql
   source ./database.sql;
   ```
   _执行完毕后，系统将自动创建 `campus_sharing_system` 数据库以及项目所需的所有表结构。_

### 2. 启动后端服务 (Backend)

请打开一个新的终端窗口，进入后端目录并配置环境：

```bash
cd backend

# 安装后端依赖
npm install
```

**⚠️ 配置数据库密码：**
在 `backend` 目录下，找到 `.env` 文件。您需要将其中的 `DB_PASSWORD` 修改为您自己电脑上真实的 MySQL 密码（此文件已被 `gitignore` 忽略，安全不会上传）：

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=你的真实数据库密码
DB_NAME=campus_sharing_system
JWT_SECRET=随意设置一个秘钥字符串即可
```

启动后端服务器：

```bash
node src/app.js
```

如果成功，终端会看到提示 `Server is running on port 3000.`

### 3. 启动前端应用 (Frontend)

请再新开一个独立的终端窗口。

```bash
cd frontend

# 安装前端依赖
npm install

# 启动 Vite 开发服务器
npm run dev
```

启动后，终端会显示本地访问地址（例如 `http://localhost:5173/`）。您直接 `Ctrl + 单击` 或在浏览器粘贴打开即可！
