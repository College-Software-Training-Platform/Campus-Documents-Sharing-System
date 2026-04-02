//资源审核

// backend/src/routes/resource.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ResourceController = require('../controllers/resourceController');
const authMiddleware = require('../middlewares/auth.middleware');

// 1. 配置 Multer 存储
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // 确保根目录下有 uploads 文件夹
    },
    filename: (req, file, cb) => {
        // 生成文件名：时间戳 + 原始扩展名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 限制 50MB
});

// 2. 注册路由
// 审核相关 (保留现有)
router.get('/pending', async (req, res) => {
  try {
    const resources = await ResourceController.getPendingResources();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

<<<<<<< Updated upstream
router.put('/:id/audit', ResourceController.auditResource)
router.get('/discover/trend', DiscoverController.getDiscoverTrend);
router.get('/courses', DiscoverController.getCourses);
router.get('/tags/hot', DiscoverController.getHotTags);
router.get('/search', SearchController.searchResources);
=======
// 核心业务：资源上传 (需登录)
router.post('/upload', authMiddleware, upload.single('file'), ResourceController.uploadResource);

// 下载资源
router.post('/download', authMiddleware, ResourceController.downloadResource);
>>>>>>> Stashed changes

module.exports = router;