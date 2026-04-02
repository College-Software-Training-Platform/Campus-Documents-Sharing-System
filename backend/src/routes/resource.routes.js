// backend/src/routes/resource.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ResourceController = require('../controllers/resourceController');
const authMiddleware = require('../middlewares/auth.middleware');

// 1. 配置 Multer 存储
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } 
});

// 2. 注册路由

// 审核相关
router.get('/pending', async (req, res) => {
  try {
    const resources = await ResourceController.getPendingResources();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 核心业务：资源上传 (需登录)
router.post('/upload', authMiddleware, upload.single('file'), ResourceController.uploadResource);

// 趋势发现 (公开展示)
router.get('/trend', ResourceController.getDiscoverTrend);

// 获取课程列表
router.get('/courses', ResourceController.getCourses);

// 下载资源
router.post('/download', authMiddleware, ResourceController.downloadResource);

module.exports = router;