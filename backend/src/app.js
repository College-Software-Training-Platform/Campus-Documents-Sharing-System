const path = require('path');
// 确保环境变量正确加载
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// 中间件配置
app.use(cors());
app.use(express.json());

// --- 路由挂载区 ---

// 注意：请确认你的路由文件名是 user.routes 还是 users.routes
// 建议只保留一个。根据你之前给我的代码，应该是 users.routes.js
const usersRouter = require('./routes/users.routes'); 
app.use('/api/users', usersRouter);

const resourceRouter = require('./routes/resource.routes');
app.use('/api/resources', resourceRouter);

const feedbackRouter = require('./routes/feedback.routes');
app.use('/api/feedbacks', feedbackRouter);

const aiRoute = require('./routes/aiRoute');
app.use('/api/ai', aiRoute);

// --- 服务器启动 ---

// 只保留一个监听器
app.listen(PORT, () => {
  console.log(`====================================`);
  console.log(`🚀 Campus Sharing System Server `);
  console.log(`   Running on: http://localhost:${PORT}`);
  console.log(`====================================`);
});