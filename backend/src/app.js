// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // 中间件
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // 基础路由测试
// app.get('/', (req, res) => {
//   res.json({ message: 'Welcome to Campus Documents Sharing System API' });
// });

// // 注册路由模块 (待实现)
// // app.use('/api/users', require('./routes/user.routes'));
// // app.use('/api/resources', require('./routes/resource.routes'));

//   //源代码
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });


const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

console.log(require('./routes/user.routes'));
// 挂载接口
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/resources', require('./routes/resource.routes'));
app.use('/api/feedbacks', require('./routes/feedback.routes'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));