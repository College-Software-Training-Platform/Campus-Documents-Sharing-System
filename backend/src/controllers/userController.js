/**
 * @file userController.js
 * @description 用户模块业务逻辑控制器 - 生产级统一版本
 * @module 控制器层
 */

const sequelize = require('../config/database');
const initModels = require('../models/init-models');

const models = initModels(sequelize);
const { users, resources, download_records } = models;

// 内部辅助工具：根据学号获取数据库自增 ID
const getInternalUid = async (studentId) => {
    if (!studentId) return null;
    const user = await users.findOne({ where: { account: studentId } });
    return user ? user.user_ID : null;
};

/**
 * ✅ 管理员：获取所有用户
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
 * ✅ 1. 获取用户详细资料
 * 匹配前端：profileRes.data.code === 200
 */
exports.getUserProfile = async (req, res) => {
    try {
        const { studentId } = req.query;
        if (!studentId) return res.status(400).json({ code: 400, message: '缺少参数：studentId' });

        const user = await users.findOne({ where: { account: studentId } });
        if (!user) {
            console.log(`[Warn] 找不到学号为 ${studentId} 的用户`);
            return res.status(404).json({ code: 404, message: '未找到用户' });
        }

        const { password, ...safeData } = user.toJSON();
        
        console.log(`[OK] 资料查询成功: 学号=${studentId}, 积分=${safeData.points_Balance}`);
        res.status(200).json({ code: 200, data: safeData });

    } catch (error) {
        console.error("获取资料失败:", error);
        res.status(500).json({ code: 500, message: "服务器错误", error: error.message });
    }
};

/**
 * ✅ 2. 修改用户基本资料
 */
exports.updateProfile = async (req, res) => {
    try {
        const { studentId, nickname, bio, major } = req.body;

        await users.update(
            { name: nickname, bio: bio, major: major },
            { where: { account: studentId } }
        );

        res.status(200).json({ code: 200, message: '资料已更新' });
    } catch (error) {
        console.error("更新资料失败:", error);
        res.status(500).json({ code: 500, message: '更新失败' });
    }
};

/**
 * ✅ 3. 修改密码
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
        console.error("修改密码失败:", error);
        res.status(500).json({ code: 500, message: '系统繁忙' });
    }
};

/**
 * ✅ 4. 获取用户统计 (已修复：自动转换 ID)
 * 匹配前端：statsRes.data.code === 200
 */
exports.getUserStats = async (req, res) => {
    try {
        const { userId, studentId } = req.query;
        // 优先使用传来的 userId，如果没有则通过 studentId 查
        let targetUid = userId || await getInternalUid(studentId);

        if (!targetUid) return res.status(404).json({ code: 404, message: '用户 ID 不存在' });

        const uploadCount = await resources.count({ where: { uploader_ID: targetUid } });
        const downloadCount = await download_records.count({ where: { user_ID: targetUid } });

        res.status(200).json({
            code: 200,
            data: { uploadCount, downloadCount }
        });
    } catch (error) {
        console.error("统计失败:", error);
        res.status(500).json({ code: 500, message: '统计获取失败' });
    }
};

/**
 * ✅ 5. 获取我的上传列表
 */
exports.getMyResources = async (req, res) => {
    try {
        const { userId, studentId } = req.query;
        let targetUid = userId || await getInternalUid(studentId);

        const list = await resources.findAll({
            where: { uploader_ID: targetUid },
            order: [['upload_Time', 'DESC']]
        });

        res.status(200).json({ code: 200, data: list });
    } catch (error) {
        console.error("获取上传失败:", error);
        res.status(500).json({ code: 500, message: '获取上传列表失败' });
    }
};

/**
 * ✅ 6. 获取我的下载记录
 */
exports.getMyDownloads = async (req, res) => {
    try {
        const { userId, studentId } = req.query;
        let targetUid = userId || await getInternalUid(studentId);

        const records = await download_records.findAll({
            where: { user_ID: targetUid },
            include: [{
                model: resources,
                as: 'resource', 
                attributes: ['title', 'format'] 
            }],
            order: [['download_Time', 'DESC']]
        });

        const data = records.map(r => ({
            record_ID: r.download_ID || r.record_ID, 
            title: r.resource ? r.resource.title : '资源已失效',
            format: r.resource ? r.resource.format : '-',
            deducted_Points: r.deducted_Points,
            download_Time: r.download_Time
        }));

        res.status(200).json({ code: 200, data: data });
    } catch (error) {
        console.error("获取下载记录失败:", error);
        res.status(500).json({ code: 500, message: '获取下载记录失败' });
    }
};

/**
 * ✅ 7. 获取收藏（预留）
 */
exports.getMyFavorites = async (req, res) => {
    res.status(200).json({ code: 200, data: [] });
};

/**
 * ✅ 8. 积分明细
 */
exports.getPointDetails = async (req, res) => {
    try {
        const { userId, studentId } = req.query;
        let targetUid = userId || await getInternalUid(studentId);

        const records = await download_records.findAll({
            where: { user_ID: targetUid },
            include: [{
                model: resources,
                as: 'resource',
                attributes: ['title']
            }],
            order: [['download_Time', 'DESC']]
        });

        const data = records.map(r => ({
            amount: -r.deducted_Points,
            reason: r.resource ? `下载资源：${r.resource.title}` : '下载资源',
            time: r.download_Time
        }));

        res.status(200).json({ code: 200, data: data });
    } catch (error) {
        console.error("获取积分失败:", error);
        res.status(500).json({ code: 500, message: '获取积分失败' });
    }
};