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
│   │   ├── middlewares/  # 中间件接口拦截器 (Auth, Upload 等)
│   │   ├── models/       # 数据库模型 (Sequelize Models)
│   │   ├── routes/       # API 路由划分
│   │   ├── utils/        # 工具函数
│   │   └── app.js        # 后端入口文件
│   ├── .env              # 本地环境变量配置
│   └── package.json      # 后端依赖配置
│
├── database.sql          # MySQL 初始建表与基础数据脚本
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

前端采用 **Vite** 作为构建工具，构建了一个响应式、高性能的单页面应用 (SPA)。
主要选型与核心功能：

- **UI 组件库**: **Element Plus**，提供一致的视觉风格与丰富的交互组件。
- **状态管理**: **Pinia**，负责全局用户状态、积分信息及配置缓存。
- **路由控制**: **Vue Router 4**，实现基于角色的动态导航方案。
- **数据交互**: **Axios**，封装统一的请求拦截器处理 JWT 鉴权与报错提示。
- **数据可视化**: **Chart.js**，用于展示个人/系统资源趋势。
- **核心功能**:
  - **发现频道**: 支持标签墙搜索、热门资料排行榜、全站模糊检索。
  - **资料详情**: AI 辅助摘要显示（模拟）、评论互动、资源预览。
  - **上传系统**: 支持拖拽上传，自定义学科标签与积分售价设置。

### 2. 后端架构 (Node.js & RESTful API)

后端基于 **Express** 框架，遵循 MVC 设计模式提供健壮的接口支持。
主要技术细节：

- **ORM 映射**: **Sequelize**，优雅地管理 MySQL 查询、事务处理与表关联。
- **安全认证**: **JWT (JSON Web Token)** 用于无状态认证，**bcrypt** 处理密码哈希加密。
- **文件存储**: **Multer** 负责处理多媒体/文档流上传，并持久化到服务器本地存储。
- **中间件**: 包含权限验证鉴权、日志记录、错误统一处理。

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
ZHIPU_API_KEY=你的智谱API密钥
```

启动后端服务器：

```bash
node src/app.js
```

如果成功，终端会看到提示 `Server is running on port 3000.`

### 3. 启动前端应用 (Frontend)

请再新开一个独立的终端窗口：

```bash
cd frontend

# 安装前端依赖
npm install

# 启动 Vite 开发服务器
npm run dev
```

启动后，终端会显示本地访问地址（例如 `http://localhost:5173/`）。直接 `Ctrl + 单击` 或在浏览器粘贴打开即可！
