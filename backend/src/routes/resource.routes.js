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

// 2.1 静态路径优先匹配 (防止被 :id 拦截)
router.get('/discover/trend', DiscoverController.getDiscoverTrend);
router.get('/tags/hot', DiscoverController.getHotTags);
router.get('/search', SearchController.searchResources);
router.get('/courses', ResourceController.getCourses);
router.get('/pending', authMiddleware, ResourceController.getPendingResources);

// 2.2 资源核心业务 (上传、下载)
router.post('/upload', authMiddleware, upload.single('file'), ResourceController.uploadResource);
router.post('/download', authMiddleware, ResourceController.downloadResource);

// 2.3 ✅ 详情查询路由 (必须放在最后，因为 :id 会屏蔽后续所有 GET 路由)
router.get('/:id', ResourceController.getResourceDetail);

module.exports = router;