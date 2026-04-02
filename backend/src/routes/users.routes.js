const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth.middleware');
// 1. 引入你刚刚修改好的资源控制器
const resourceController = require('../controllers/resourceController');

// --- 公放路由 (无需令牌) ---
router.post('/login', userController.login);
router.post('/register', userController.register);

// ✅ 【新增】获取所有用户（管理端）
router.get('/', userController.getUsers);

// --- 基础资料模块 (部分需要令牌) ---
router.get('/profile', userController.getUserProfile);
router.post('/update', userController.updateProfile);
router.post('/password', userController.changePassword);
router.get('/stats', userController.getUserStats);

// --- 资源管理模块 ---
// 获取“我的上传”列表
router.get('/resources', userController.getMyResources);
// 获取“我的下载”记录
router.get('/downloads', userController.getMyDownloads);
// 获取“我的收藏”列表
router.get('/favorites', userController.getMyFavorites);
// 获取积分变动明细
router.get('/points', userController.getPointDetails);

// 2. 新增：处理下载行为的路由 (积分扣除 + 文件传输)
// 路径建议定为 /download-action，避免和获取下载列表的 /downloads 冲突
router.post('/download-action', resourceController.downloadResource);

module.exports = router;