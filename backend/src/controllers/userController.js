/**
 * @file userController.js
 * @description 用户模块业务逻辑控制器 - 生产级统一版本
 * @module 控制器层
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
 * ✅ 用户注册
 * POST /api/users/register
 */
exports.register = async (req, res) => {
    try {
        const { account, password, name, contact, major } = req.body;

        // 1. 基础校验
        if (!account || !password || !name) {
            return res.status(400).json({ code: 400, message: '账号、密码和姓名不能为空' });
        }

        // 2. 检查账号是否已存在
        const existingUser = await users.findOne({ where: { account } });
        if (existingUser) {
            return res.status(400).json({ code: 400, message: '该账号已被注册' });
        }

        // 3. 密码加密 (加盐哈希)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 账号以 't' 开头则设为管理员，否则为普通用户
        const userRole = account.toLowerCase().startsWith('t') ? 'admin' : 'user';

        // 4. 创建新用户
        const newUser = await users.create({
            account,
            password: hashedPassword,
            name,
            contact,
            major,
            points_Balance: 100, // 初始积分
            role: userRole,
            account_Status: 'active'
        });

        res.status(201).json({ code: 201, message: '注册成功' });

    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ code: 500, message: '注册失败，服务器错误' });
    }
};

/**
 * ✅ 用户登录 
 * POST /api/users/login
 */
exports.login = async (req, res) => {
    try {
        const { account, password } = req.body;

        // 1. 查找用户
        const user = await users.findOne({ where: { account } });
        if (!user) {
            return res.status(401).json({ code: 401, message: '账号或密码错误' });
        }

        // 2. 校验密码 (尝试 bcrypt 校验，如果失败则尝试明文校验以支持 init_test_users.sql 中的账号)
        let isMatch = false;
        try {
            isMatch = await bcrypt.compare(password, user.password);
        } catch (e) {
            // 如果 user.password 不是有效的 bcrypt 哈希，bcrypt.compare 可能会抛错
            isMatch = false;
        }

        // 降级处理：为了兼容之前 init_test_users.sql 插入的明文密码
        if (!isMatch && user.password === password) {
            isMatch = true;
        }

        if (!isMatch) {
            return res.status(401).json({ code: 401, message: '账号或密码错误' });
        }

        // 3. 检查账号状态
        if (user.account_Status === 'banned') {
            return res.status(403).json({ code: 403, message: '该账号已被禁用' });
        }

        // 4. 生成 JWT Token
        const token = jwt.sign(
            { 
                userId: user.user_ID, 
                account: user.account, 
                role: user.role 
            },
            process.env.JWT_SECRET || 'AAAcampusSharingSystem',
            { expiresIn: '24h' }
        );

        // 返回结果 (排除敏感信息)
        const { password: _, ...userInfo } = user.toJSON();
        res.status(200).json({
            code: 200,
            message: '登录成功',
            data: {
                token,
                user: userInfo
            }
        });

    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ code: 500, message: '登录失败，服务器错误' });
    }
};

/**
 * ✅ 管理员：获取所有用户（合并远程功能）
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

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await User.destroy({
      where: { id }
    });

    if (result === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({ message: '删除成功' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.banUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await users.findByPk(id);
        if (!user) {
            return res.status(404).json({ code: 404, message: '用户不存在' });
        }

        await users.update(
            { account_Status: 'banned' },
            { where: { user_ID: id } }
        );

        res.status(200).json({ code: 200, message: '已封禁用户' });

    } catch (err) {
        console.error('封禁用户失败:', err);
        res.status(500).json({ code: 500, message: '封禁失败' });
    }
};

