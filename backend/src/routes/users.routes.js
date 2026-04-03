const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const resourceController = require('../controllers/resourceController');
const authMiddleware = require('../middlewares/auth.middleware');

// --- 1. 基础认证 (公开) ---
router.post('/login', userController.login);
router.post('/register', userController.register);

// --- 2. 个人资料与设置 (需登录) ---
// 获取/更新个人信息
router.get('/profile',userController.getUserProfile);
router.post('/update', userController.updateProfile);
router.post('/password', userController.changePassword);
// 获取用户统计数据 (上传数、下载数等)
router.get('/stats', userController.getUserStats);

// --- 3. 个人资源与积分 (需登录) ---
// 我的上传、我的下载、我的收藏
router.get('/resources', authMiddleware, userController.getMyResources);
router.get('/downloads', authMiddleware, userController.getMyDownloads);
router.get('/favorites', authMiddleware, userController.getMyFavorites);

// 积分明细 (保留两个路径以防前端其他地方调用了旧路径)
router.get('/points', authMiddleware, userController.getPointDetails);
router.get('/points/details', authMiddleware, userController.getPointDetails);

// --- 4. 资源动作 ---
// 下载动作（涉及扣积分逻辑）
router.post('/download-action', authMiddleware, resourceController.downloadResource);

// --- 5. 管理员模块 (需登录) ---
// 注意：实际项目中这里通常还需要 adminMiddleware，目前先按你的合并逻辑保留
router.get('/', authMiddleware, userController.getUsers); 
router.delete('/:id', authMiddleware, userController.deleteUser);
router.put('/:id/ban', authMiddleware, userController.banUser);

module.exports = router;