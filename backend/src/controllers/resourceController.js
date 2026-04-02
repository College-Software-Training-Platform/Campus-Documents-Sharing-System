/**
 * @file resourceController.js
 * @description 资源/文档核心业务控制器
 * @module 控制器层
 * * 主要职责：
 * 1. 校园资料的上传逻辑 (处理 Multer 文件保存)
 * 2. 资源列表的分页查询、分类筛选、搜索功能
 * 3. 资源详情获取及下载次数统计
 * 4. 用户个人资料库 (My Resources) 的数据维护
 */


// backend/src/controllers/resourceController.js
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const ResourceModel = require('../models/resources')(sequelize, Sequelize.DataTypes);

// 获取待审核资源
const getPendingResources = async () => {
  try {
    const resources = await ResourceModel.findAll({ where: { status: 'pending' } });
    console.log('待审核资源:', resources.map(r => r.toJSON()));
  } catch (err) {
    console.error(err);
  }
};

// 审核通过
const approveResource = async (resourceId) => {
  try {
    await ResourceModel.update(
      { status: 'approved' },
      { where: { id: resourceId } }
    );
    console.log(`资源 ${resourceId} 已通过审核`);
  } catch (err) {
    console.error(err);
  }
};

// 审核拒绝
const rejectResource = async (resourceId) => {
  try {
    await ResourceModel.update(
      { status: 'rejected' },
      { where: { id: resourceId } }
    );
    console.log(`资源 ${resourceId} 已拒绝`);
  } catch (err) {
    console.error(err);
  }
};

// 测试
(async () => {
  await getPendingResources();
  // await approveResource(1);
  // await rejectResource(2);
})();