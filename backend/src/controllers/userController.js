/**
 * @file userController.js
 * @description 用户模块业务逻辑控制器
 * @module 控制器层
 */

const sequelize = require('../config/database');
const initModels = require('../models/init-models');

const models = initModels(sequelize);
const { users, resources, download_records } = models;

/**
 * ✅ 管理员：获取所有用户（合并远程功能）
 */
exports.getUsers = async (req, res) => {
    try {
        const list = await users.findAll();
        const data = list.map(u => {
            const obj = u.toJSON();
            delete obj.password;
            return obj;
        });

        res.status(200).json({ code: 200, data });
    } catch (err) {
        console.error('获取用户失败:', err);
        res.status(500).json({ code: 500, message: '获取用户失败' });
    }
};

/**
 * 1. 获取用户详细资料
 * GET /api/users/profile
 */
exports.getUserProfile = async (req, res) => {
    try {
        const { studentId } = req.query;
        if (!studentId) return res.status(400).json({ message: '缺少参数：studentId' });

        const user = await users.findOne({ where: { account: studentId } });
        if (!user) return res.status(404).json({ message: '未找到用户' });

        const { password, ...safeData } = user.toJSON();
        res.status(200).json(safeData);

    } catch (error) {
        res.status(500).json({ message: "服务器错误", error: error.message });
    }
};

/**
 * 2. 修改用户基本资料
 * POST /api/users/update
 */
exports.updateProfile = async (req, res) => {
    try {
        const { studentId, nickname, bio, major } = req.body;

        // 合并后的逻辑：使用你的多字段更新 + 传入的正确 where 条件
        const [affectedRows] = await users.update(
            { 
                name: nickname, 
                bio: bio, 
                major: major 
            },
            { 
                where: { account: studentId } 
            }
        );

        res.status(200).json({ message: '资料已更新' });

    } catch (error) {
        res.status(500).json({ message: '更新失败' });
    }
};

/**
 * 3. 修改密码
 */
exports.changePassword = async (req, res) => {
    try {
        const { studentId, oldPassword, newPassword } = req.body;

        const user = await users.findOne({ where: { account: studentId } });

        if (!user || user.password !== oldPassword) {
            return res.status(400).json({ message: '原密码错误' });
        }

        await users.update(
            { password: newPassword },
            { where: { account: studentId } }
        );

        res.status(200).json({ message: '密码修改成功' });

    } catch (error) {
        res.status(500).json({ message: '系统繁忙' });
    }
};

/**
 * 4. 获取用户统计
 */
exports.getUserStats = async (req, res) => {
    try {
        const { userId } = req.query;

        const uploadCount = await resources.count({ where: { uploader_ID: userId } });
        const downloadCount = await download_records.count({ where: { user_ID: userId } });

        res.status(200).json({
            uploadCount,
            downloadCount
        });

    } catch (error) {
        res.status(500).json({ message: '统计获取失败' });
    }
};

/**
 * 5. 获取我的上传列表
 */
exports.getMyResources = async (req, res) => {
    try {
        const { userId } = req.query;

        const list = await resources.findAll({
            where: { uploader_ID: userId },
            order: [['upload_Time', 'DESC']]
        });

        res.status(200).json(list);

    } catch (error) {
        res.status(500).json({ message: '获取上传列表失败' });
    }
};

/**
 * 6. 获取我的下载记录
 */
exports.getMyDownloads = async (req, res) => {
    try {
        const { userId } = req.query;

        const records = await download_records.findAll({
            where: { user_ID: userId },
            include: [{
                model: resources,
                as: 'resource', 
                attributes: ['title', 'format', 'download_Count'] // 这里也顺便带出总下载数
            }],
            order: [['download_Time', 'DESC']]
        });

        const data = records.map(r => ({
            record_ID: r.record_ID,
            title: r.resource ? r.resource.title : '资源已失效',
            format: r.resource ? r.resource.format : '-',
            deducted_Points: r.deducted_Points,
            download_Time: r.download_Time
        }));

        res.status(200).json(data);

    } catch (error) {
        console.error("后端错误详情:", error);
        res.status(500).json({ code: 500, message: '获取下载记录失败', debug: error.message });
    }
};

/**
 * 7. 获取收藏（预留）
 */
exports.getMyFavorites = async (req, res) => {
    res.status(200).json([]);
};

/**
 * 8. 积分明细
 */
exports.getPointDetails = async (req, res) => {
    try {
        const { userId } = req.query;
        // 积分明细逻辑通常可以复用下载记录，或者从专门的积分流水表读取
        const records = await download_records.findAll({
            where: { user_ID: userId },
            order: [['download_Time', 'DESC']]
        });

        res.status(200).json(records);

    } catch (error) {
        res.status(500).json({ message: '获取积分失败' });
    }
};