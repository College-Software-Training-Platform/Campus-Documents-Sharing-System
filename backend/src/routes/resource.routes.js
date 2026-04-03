// backend/src/routes/resource.routes.js
const express = require('express');
const router = express.Router();

// --- 1. 控制器引入 (Controllers) ---
const ResourceController = require('../controllers/resourceController');
const DiscoverController = require('../controllers/discoverController');
const SearchController = require('../controllers/searchController'); // ✅ 补全：修复 SearchController 未定义错误

// 打印调试信息（可选，上线前可删除）
console.log('ResourceController 状态:', !!ResourceController);
console.log('DiscoverController 状态:', !!DiscoverController);
console.log('SearchController 状态:', !!SearchController);

// --- 2. 资源搜索与发现 (Discover & Search) ---

// 发现页趋势资源
router.get('/discover/trend', DiscoverController.getDiscoverTrend);

// 课程列表及资源统计
router.get('/courses', DiscoverController.getCourses);

// 热门标签
router.get('/tags/hot', DiscoverController.getHotTags);

// 多条件搜索
router.get('/search', SearchController.searchResources);

// --- 3. 资源管理与审核 (Admin & Manage) ---

// 获取待审核列表
router.get('/pending', async (req, res) => {
  try {
    const resources = await ResourceController.getPendingResources();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 审核资源 (通过/驳回)
router.put('/:id/audit', ResourceController.auditResource);

// --- 4. 资源下载 (Download) ---

// 积分下载逻辑
router.post('/download', ResourceController.downloadResource);

module.exports = router;