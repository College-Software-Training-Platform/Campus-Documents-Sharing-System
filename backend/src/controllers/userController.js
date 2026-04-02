/**
 * @file userController.js
 * @description 用户模块业务逻辑控制器
 * @module 控制器层
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');
const initModels = require('../models/init-models');

const models = initModels(sequelize);
const { users, resources, download_records } = models;

/**
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

        // 4. 创建新用户
        const newUser = await users.create({
            account,
            password: hashedPassword,
            name,
            contact,
            major,
            points_Balance: 100, // 初始积分
            role: 'user',
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