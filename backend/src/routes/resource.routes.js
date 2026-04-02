// backend/src/routes/resource.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ResourceController = require('../controllers/resourceController');
const DiscoverController = require('../controllers/discoverController');
const SearchController = require('../controllers/searchController');
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

// 2.1 资源核心业务 (本地增强逻辑)
router.post('/upload', authMiddleware, upload.single('file'), ResourceController.uploadResource);
router.post('/download', authMiddleware, ResourceController.downloadResource);
router.get('/pending', authMiddleware, ResourceController.getPendingResources);

// 2.2 基础查询 (团队统一接口)
router.get('/courses', ResourceController.getCourses);
router.get('/:id', ResourceController.getResourceDetail);

// 2.3 发现与趋势 (由专属控制器处理)
router.get('/discover/trend', DiscoverController.getTrend);
router.get('/tags/hot', DiscoverController.getHotTags);

// 2.4 搜索业务
router.get('/search', SearchController.searchResources);

module.exports = router;