/**
 * @file userController.js
 * @description 用户模块业务逻辑控制器
 * @module 控制器层
 * * --- 已完成功能点清单 ---
 * 1. [查询] getUserProfile: 获取当前登录用户的详细资料 (用于主页初始化)
 * 2. [更新] updateProfile: 修改用户昵称、个人简介、所属专业 (基本资料修改)
 * 3. [安全] changePassword: 验证旧密码并更新新密码 (安全设置模块)
 * 4. [扩展] getUserStats: 获取用户相关的简单统计数据 (如上传数、下载数)
 */

// 1. 引入数据库实例 (注意：这里直接引入，不加 {}，且路径指向 database.js)
const sequelize = require('../config/database'); 
const initModels = require('../models/init-models');

// 2. 初始化所有模型
const models = initModels(sequelize);
const { users, resources, download_records } = models;

/**
 * 1. 获取用户详细资料
 * 对应路由：GET /api/users/profile
 */
exports.getUserProfile = async (req, res) => {
    try {
        const { studentId } = req.query; 

        if (!studentId) {
            return res.status(400).json({ code: 400, message: '缺少参数：studentId' });
        }

        // --- 核心修改：使用 account 字段匹配你的数据库 ---
        const user = await users.findOne({ 
            where: { account: studentId } 
        });

        if (!user) {
            return res.status(404).json({ 
                code: 404, 
                message: `未找到学号为 ${studentId} 的用户，请检查数据库 account 字段` 
            });
        }

        // 过滤掉密码等敏感信息
        const { password, ...safeData } = user.toJSON();
        res.status(200).json({ code: 200, data: safeData });

    } catch (error) {
        console.error('❌ 获取资料失败:', error);
        res.status(500).json({ 
            code: 500, 
            message: "服务器内部错误", 
            debug: error.message 
        });
    }
};

/**
 * 2. 修改用户基本资料
 * 对应路由：POST /api/users/update
 */
exports.updateProfile = async (req, res) => {
    try {
        const { studentId, nickname, bio, major } = req.body;

        if (!studentId) {
            return res.status(400).json({ code: 400, message: '缺少学号标识' });
        }

        // 注意：根据截图，你的昵称字段可能叫 name
        const [affectedRows] = await users.update(
            { name: nickname, bio, major }, 
            { where: { account: studentId } }
        );

        if (affectedRows > 0) {
            res.status(200).json({ code: 200, message: '个人资料已更新' });
        } else {
            res.status(404).json({ code: 404, message: '更新失败，可能用户不存在或数据无变化' });
        }
    } catch (error) {
        console.error('❌ 更新资料失败:', error);
        res.status(500).json({ code: 500, message: '更新失败', debug: error.message });
    }
};

/**
 * 3. 修改登录密码
 * 对应路由：POST /api/users/password
 */
exports.changePassword = async (req, res) => {
    try {
        const { studentId, oldPassword, newPassword } = req.body;

        const user = await users.findOne({ where: { account: studentId } });
        
        if (!user || user.password !== oldPassword) {
            return res.status(400).json({ code: 400, message: '原密码错误' });
        }

        await users.update(
            { password: newPassword },
            { where: { account: studentId } }
        );

        res.status(200).json({ code: 200, message: '密码修改成功' });
    } catch (error) {
        console.error('❌ 修改密码失败:', error);
        res.status(500).json({ code: 500, message: '系统繁忙' });
    }
};

/**
 * 4. 获取用户统计信息
 * 对应路由：GET /api/users/stats
 */
exports.getUserStats = async (req, res) => {
    try {
        const { userId } = req.query; // 这里的 userId 对应数据库里的 user_ID (数字)

        // 注意：这里的字段名 uploader_ID 和 user_ID 需与 Navicat 表头严格一致
        const uploadCount = await resources.count({ where: { uploader_ID: userId } });
        const downloadCount = await download_records.count({ where: { user_ID: userId } });

        res.status(200).json({ 
            code: 200, 
            data: { uploadCount, downloadCount } 
        });
    } catch (error) {
        console.error('❌ 统计失败:', error);
        res.status(500).json({ code: 500, message: '统计获取失败' });
    }
};