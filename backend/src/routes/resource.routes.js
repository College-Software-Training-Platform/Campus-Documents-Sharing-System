// backend/src/routes/resource.routes.js
const express = require('express');
const router = express.Router();

const ResourceController = require('../controllers/resourceController');
const DiscoverController = require('../controllers/discoverController');
const SearchController = require('../controllers/searchController');

console.log('ResourceController =', ResourceController);

// ===== 资源审核 =====
router.get('/pending', async (req, res) => {
  try {
    const resources = await ResourceController.getPendingResources();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== 发现页面 =====
// 获取趋势资源
router.get('/discover/trend', DiscoverController.getDiscoverTrend);

// 获取所有课程及资源数
router.get('/courses', DiscoverController.getCourses);

// 获取热门标签
router.get('/tags/hot', DiscoverController.getHotTags);

// ===== 搜索 =====
// 多条件搜索
router.get('/search', SearchController.searchResources);

module.exports = router;