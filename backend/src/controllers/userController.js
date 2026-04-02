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

const users = require('../models/users.js'); 
const resources = require('../models/resources.js');
const download_records = require('../models/download_records.js');
// 注意：确保你的 models 路径正确，且 users 模型已包含 bio, major, avatar_url 字段

/**
 * 1. 获取用户详细资料
 * 对应路由：GET /api/user/profile
 */
exports.getUserProfile = async (req, res) => {
    try {
        // 实际开发中，userId 应该从 JWT Token 中解析出来，这里先演示从 query 获取
        const { studentId } = req.query; 

        if (!studentId) {
            return res.status(400).json({ code: 400, message: '缺少学生标识' });
        }

        const user = await users.findOne({ where: { student_id: studentId } });

        if (!user) {
            return res.status(404).json({ code: 404, message: '用户不存在' });
        }

        // 过滤敏感信息（如密码）后再返回
        const { password, ...safeData } = user.toJSON();
        res.status(200).json({ code: 200, data: safeData });
    } catch (error) {
        console.error('获取资料失败:', error);
        res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
};

/**
 * 2. 修改用户基本资料
 * 对应路由：POST /api/user/update
 */
exports.updateProfile = async (req, res) => {
    try {
        const { studentId, nickname, bio, major } = req.body;

        // 数据合法性简单校验
        if (!nickname || nickname.length > 20) {
            return res.status(400).json({ code: 400, message: '昵称不能为空且长度需小于20' });
        }

        const [affectedRows] = await users.update(
            { nickname, bio, major },
            { where: { student_id: studentId } }
        );

        if (affectedRows > 0) {
            res.status(200).json({ code: 200, message: '个人资料已更新' });
        } else {
            res.status(404).json({ code: 404, message: '更新失败，未找到对应记录' });
        }
    } catch (error) {
        console.error('更新资料失败:', error);
        res.status(500).json({ code: 500, message: '更新失败，请稍后再试' });
    }
};

/**
 * 3. 修改登录密码
 * 对应路由：POST /api/user/password
 */
exports.changePassword = async (req, res) => {
    try {
        const { studentId, oldPassword, newPassword } = req.body;

        // 1. 查找用户
        const user = await users.findOne({ where: { student_id: studentId } });
        
        // 2. 校验旧密码 (此处为演示，实际建议使用 bcrypt.compare 进行哈希比对)
        if (user.password !== oldPassword) {
            return res.status(400).json({ code: 400, message: '原密码输入错误' });
        }

        // 3. 更新新密码
        await users.update(
            { password: newPassword },
            { where: { student_id: studentId } }
        );

        res.status(200).json({ code: 200, message: '密码修改成功，请妥善保管' });
    } catch (error) {
        console.error('修改密码失败:', error);
        res.status(500).json({ code: 500, message: '系统繁忙，请稍后再试' });
    }
};

/**
 * 4. 获取用户统计信息 (配合前端 Profile 页面的 Badge/统计项)
 * 对应路由：GET /api/user/stats
 */
exports.getUserStats = async (req, res) => {
    try {
        const { userId } = req.query;

        // 演示：同时查询用户上传的资源数和下载记录数
        const uploadCount = await resources.count({ where: { uploader_id: userId } });
        const downloadCount = await download_records.count({ where: { user_id: userId } });

        res.status(200).json({ 
            code: 200, 
            data: { uploadCount, downloadCount } 
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: '统计数据获取失败' });
    }
};