//资源审核

// backend/src/routes/resource.routes.js
const express = require('express');
const router = express.Router();

const ResourceController = require('../controllers/resourceController');

console.log('ResourceController =', ResourceController);

router.get('/pending', async (req, res) => {
  try {
    const resources = await ResourceController.getPendingResources();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;