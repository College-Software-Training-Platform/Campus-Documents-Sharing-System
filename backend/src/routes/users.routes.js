const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 定义：当收到 PUT 请求访问 /update 时，去找 controller 里的更新函数
router.put('/update', userController.updateProfile);

module.exports = router;