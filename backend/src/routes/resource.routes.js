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

// 2.1 统计与趋势查询 (静态路径优先，防止被 :id 拦截)
router.get('/discover/trend', DiscoverController.getDiscoverTrend);
router.get('/tags/hot', DiscoverController.getHotTags);
router.get('/courses', DiscoverController.getCourses); // 统一由 DiscoverController 管理课程列表
router.get('/search', SearchController.searchResources);

// 2.2 核心业务 (鉴权)
router.post('/upload', authMiddleware, upload.single('file'), ResourceController.uploadResource);
router.post('/download', authMiddleware, ResourceController.downloadResource);
router.get('/pending', authMiddleware, ResourceController.getPendingResources);

// 2.3 详情查询 (必须放在最后，防止屏蔽上述所有 GET 路由)
router.get('/:id', ResourceController.getResourceDetail);

module.exports = router;