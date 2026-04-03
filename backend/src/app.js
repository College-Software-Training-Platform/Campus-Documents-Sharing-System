const path = require('path');
// 确保环境变量正确加载
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors())

// 中间件配置
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- 路由挂载区 ---
const usersRouter = require('./routes/users.routes'); 
app.use('/api/users', usersRouter);

const resourceRouter = require('./routes/resource.routes');
app.use('/api/resources', resourceRouter);

const feedbackRouter = require('./routes/feedback.routes');
app.use('/api/feedbacks', feedbackRouter);

const aiRoute = require('./routes/aiRoute');
app.use('/api/ai', aiRoute);

// --- 全局错误处理 ---
app.use((err, req, res, next) => {
  console.error('SERVER_ERROR:', err.stack);
  res.status(err.status || 500).json({
    code: err.status || 500,
    message: err.message || '服务器内部错误'
  });
});

// --- 服务器启动 ---
// 只保留一个监听器
app.listen(PORT, () => {
  console.log(`====================================`);
  console.log(`🚀 Campus Sharing System Server `);
  console.log(`   Running on: http://localhost:${PORT}`);
  console.log(`====================================`);
});