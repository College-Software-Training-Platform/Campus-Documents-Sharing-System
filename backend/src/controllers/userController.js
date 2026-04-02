/**
 * @file userController.js
 * @description 用户模块业务逻辑控制器
 * @module 控制器层
 * * --- 功能点清单 ---
 * 1. getUserProfile: 获取基础资料
 * 2. updateProfile: 修改基本资料
 * 3. changePassword: 修改密码
 * 4. getUserStats: 获取统计数
 * 5. getMyResources: 获取上传列表
 * 6. getMyDownloads: 获取下载记录 (含关联查询)
 * 7. getMyFavorites: 获取收藏列表 (预留)
 */

const sequelize = require('../config/database'); 
const initModels = require('../models/init-models');

const models = initModels(sequelize);
const { users, resources, download_records } = models;

/**
 * 1. 获取用户详细资料
 * GET /api/users/profile
 */
exports.getUserProfile = async (req, res) => {
    try {
        const { studentId } = req.query; 
        if (!studentId) return res.status(400).json({ code: 400, message: '缺少参数：studentId' });

        const user = await users.findOne({ where: { account: studentId } });
        if (!user) return res.status(404).json({ code: 404, message: '未找到用户' });

        const { password, ...safeData } = user.toJSON();
        res.status(200).json({ code: 200, data: safeData });
    } catch (error) {
        res.status(500).json({ code: 500, message: "服务器错误", debug: error.message });
    }
};

/**
 * 2. 修改用户基本资料
 * POST /api/users/update
 */
exports.updateProfile = async (req, res) => {
    try {
        const { studentId, nickname, bio, major } = req.body;
        if (!studentId) return res.status(400).json({ code: 400, message: '缺少学号标识' });

        const [affectedRows] = await users.update(
            { name: nickname, bio, major }, 
            { where: { account: studentId } }
        );

        res.status(200).json({ code: 200, message: '资料已更新' });
    } catch (error) {
        res.status(500).json({ code: 500, message: '更新失败' });
    }
};

/**
 * 3. 修改登录密码
 */
exports.changePassword = async (req, res) => {
    try {
        const { studentId, oldPassword, newPassword } = req.body;
        const user = await users.findOne({ where: { account: studentId } });
        
        if (!user || user.password !== oldPassword) {
            return res.status(400).json({ code: 400, message: '原密码错误' });
        }

        await users.update({ password: newPassword }, { where: { account: studentId } });
        res.status(200).json({ code: 200, message: '密码修改成功' });
    } catch (error) {
        res.status(500).json({ code: 500, message: '系统繁忙' });
    }
};

/**
 * 4. 获取用户统计信息
 */
exports.getUserStats = async (req, res) => {
    try {
        const { userId } = req.query; 
        const uploadCount = await resources.count({ where: { uploader_ID: userId } });
        const downloadCount = await download_records.count({ where: { user_ID: userId } });

        res.status(200).json({ code: 200, data: { uploadCount, downloadCount } });
    } catch (error) {
        res.status(500).json({ code: 500, message: '统计获取失败' });
    }
};

/**
 * 5. 获取我的上传列表
 * GET /api/users/resources
 */
exports.getMyResources = async (req, res) => {
    try {
        const { userId } = req.query;
        const list = await resources.findAll({
            where: { uploader_ID: userId },
            order: [['upload_Time', 'DESC']]
        });
        res.status(200).json({ code: 200, data: list });
    } catch (error) {
        res.status(500).json({ code: 500, message: '获取上传列表失败' });
    }
};

/**
 * 6. 获取我的下载记录 (修改版)
 */
exports.getMyDownloads = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ code: 400, message: '缺少用户ID' });

        const records = await download_records.findAll({
            where: { user_ID: userId },
            include: [{
                model: resources,
                as: 'resource', 
                attributes: ['title', 'format'] // 改为 format，对应你 resources 表的字段
            }],
            order: [['download_Time', 'DESC']]
        });

        const data = records.map(r => ({
            record_ID: r.record_ID,
            title: r.resource ? r.resource.title : '资源已失效',
            format: r.resource ? r.resource.format : '-', // 统一为 format
            deducted_Points: r.deducted_Points, // 这里的字段名必须和你数据库 download_records 表一致
            download_Time: r.download_Time
        }));

        res.status(200).json({ code: 200, data });
    } catch (error) {
        console.error("后端错误详情:", error); // 打印到黑窗口，方便你调试 500 错误
        res.status(500).json({ code: 500, message: '获取下载记录失败', debug: error.message });
    }
};

/**
 * 7. 获取我的收藏 (预留)
 */
exports.getMyFavorites = async (req, res) => {
    res.status(200).json({ code: 200, data: [], message: '收藏模块建设中' });
};

/**
 * 8. 获取积分明细
 */
exports.getPointDetails = async (req, res) => {
    try {
        const { userId } = req.query;
        // 积分明细逻辑通常可以复用下载记录，或者从专门的积分流水表读取
        const records = await download_records.findAll({
            where: { user_ID: userId },
            include: [{ model: resources, as: 'resource', attributes: ['title'] }],
            order: [['download_Time', 'DESC']]
        });
        
        const data = records.map(r => ({
            id: r.record_ID,
            type: '下载消耗',
            amount: `-${r.points_Spent}`,
            target: r.resource ? r.resource.title : '未知资源',
            time: r.download_Time
        }));

        res.status(200).json({ code: 200, data });
    } catch (error) {
        res.status(500).json({ code: 500, message: '获取积分明细失败' });
    }
};