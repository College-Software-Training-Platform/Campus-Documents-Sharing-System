/**
 * @file userController.js
 * @description 用户模块业务逻辑控制器（已修复版）
 */

const sequelize = require('../config/database');
const initModels = require('../models/init-models');

const models = initModels(sequelize);
const { users, resources, download_records } = models;

/**
 * ✅ 管理员：获取所有用户（已修复）
 */
exports.getUsers = async (req, res) => {
    try {
        const list = await users.findAll({
            attributes: ['user_ID', 'account', 'contact', 'role']
        });

        const data = list.map(u => ({
            user_ID: u.user_ID,
            account: u.account,
            contact: u.contact,
            role: u.role
        }));

        // ⚠️ 必须直接返回数组（适配前端）
        res.status(200).json(data);

    } catch (err) {
        console.error('获取用户失败:', err);
        res.status(500).json({ message: '获取用户失败' });
    }
};

/**
 * 1. 获取用户详细资料
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
 */
exports.updateProfile = async (req, res) => {
    try {
        const { studentId, nickname } = req.body;

        await users.update(
            { name: nickname },
            { where: { account: studentId } }
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
 * 5. 我的上传
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
 * 6. 我的下载
 */
exports.getMyDownloads = async (req, res) => {
    try {
        const { userId } = req.query;

        const records = await download_records.findAll({
            where: { user_ID: userId },
            include: [{
                model: resources,
                as: 'resource',
                attributes: ['title', 'format']
            }],
            order: [['download_Time', 'DESC']]
        });

        const data = records.map(r => ({
            record_ID: r.record_ID,
            title: r.resource ? r.resource.title : '资源已失效',
            format: r.resource ? r.resource.format : '-',
            download_Time: r.download_Time
        }));

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: '获取下载记录失败' });
    }
};

/**
 * 7. 收藏（占位）
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

        const records = await download_records.findAll({
            where: { user_ID: userId },
            order: [['download_Time', 'DESC']]
        });

        res.status(200).json(records);

    } catch (error) {
        res.status(500).json({ message: '获取积分失败' });
    }
};