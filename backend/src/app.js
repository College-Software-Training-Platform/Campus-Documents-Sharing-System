const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

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
// 注册路由模块
const aiRoute = require('./routes/aiRoute');
app.use('/api/ai', aiRoute);

// 其他路由注册 (待实现)
 app.use('/api/users', require('./routes/users.routes'));
// app.use('/api/resources', require('./routes/resource.routes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
