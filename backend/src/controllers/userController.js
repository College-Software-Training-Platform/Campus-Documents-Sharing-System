/**
 * @file userController.js
 * @description 用户模块控制器
 * @module 控制器层
 * * 主要职责：
 * 1. 处理个人资料的查询与修改 (Nickname, Bio, Major)
 * 2. 处理用户头像的上传与更新 (Avatar URL)
 * 3. 账号安全相关操作 (修改密码、身份验证状态)
 * 4. 用户登录、注册及 Token 校验逻辑
 */

// backend/src/controllers/userController.js
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const UserModel = require('../models/users')(sequelize, Sequelize.DataTypes);

// 获取所有用户
const getUsers = async () => {
  try {
    const users = await UserModel.findAll();
    console.log('用户列表:', users.map(u => u.toJSON()));
  } catch (err) {
    console.error('获取用户失败:', err);
  }
};

// 封禁用户
const banUser = async (userId) => {
  try {
    await UserModel.update(
      { account_Status: 'banned' },
      { where: { user_ID: userId } }
    );
    console.log(`用户 ${userId} 已封禁`);
  } catch (err) {
    console.error(err);
  }
};

// 删除用户
const deleteUser = async (userId) => {
  try {
    await UserModel.destroy({ where: { user_ID: userId } });
    console.log(`用户 ${userId} 已删除`);
  } catch (err) {
    console.error(err);
  }
};

// 测试
(async () => {
  await getUsers();
  // await banUser(2);
  // await deleteUser(3);
})();