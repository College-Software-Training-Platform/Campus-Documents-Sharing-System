const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- 1. 控制器与中间件引入 ---
const ResourceController = require('../controllers/resourceController');
const DiscoverController = require('../controllers/discoverController');
const SearchController = require('../controllers/searchController'); 
const authMiddleware = require('../middlewares/auth.middleware');

// --- 2. 存储配置 (Multer) ---
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

// --- 3. 路由定义 ---

// 3.1 公开查询路由 (不需要登录即可访问)
router.get('/discover/trend', DiscoverController.getDiscoverTrend);
router.get('/tags/hot', DiscoverController.getHotTags);
router.get('/courses', DiscoverController.getCourses); 
router.get('/search', SearchController.searchResources);

// 3.2 核心业务路由 (需要 authMiddleware 鉴权)
// 上传资源
router.post('/upload', authMiddleware, upload.single('file'), ResourceController.uploadResource);
// 下载资源
router.post('/download', authMiddleware, ResourceController.downloadResource);
// 获取待审核列表
//router.get('/pending', authMiddleware, ResourceController.getPendingResources);
router.get('/pending', ResourceController.getPendingResources);
// 审核资源 (通过/驳回)
router.put('/:id/audit', authMiddleware, ResourceController.auditResource);
// 资料删除
router.delete('/:id', authMiddleware, ResourceController.deleteResource);
// 资料更新
router.put('/:id', authMiddleware, ResourceController.updateResource);

// 3.3 详情查询 (必须放在最后，防止 :id 拦截其他静态路径)
router.get('/:id', ResourceController.getResourceDetail);

module.exports = router;