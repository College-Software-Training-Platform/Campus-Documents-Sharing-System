//用户管理

// backend/src/routes/user.routes.js
const express = require('express');
const router = express.Router();

// 引入控制层
const UserController = require('../controllers/userController');

// 测试接口：获取所有用户
router.get('/', async (req, res) => {
  try {
    const users = await UserController.getUsers(); // 确保返回数组
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; //  一定要 exports router