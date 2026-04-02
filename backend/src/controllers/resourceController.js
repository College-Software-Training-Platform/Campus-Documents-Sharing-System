// backend/src/controllers/resourceController.js
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const path = require('path');
const fs = require('fs');

// 初始化所有需要的模型
const initModels = require('../models/init-models');
const models = initModels(sequelize);
const { resources, users, download_records } = models;

/**
 * ✅ 核心逻辑：资源下载
 */
const downloadResource = async (req, res) => {
    let t;
    try {
        const { userId, resourceId } = req.body;
        const resource = await resources.findByPk(resourceId);
        if (!resource) return res.status(404).json({ code: 404, message: '资源不存在' });

        const buyer = await users.findByPk(userId);
        if (!buyer) return res.status(404).json({ code: 404, message: '用户不存在' });

        const COST = 5; 
        if (buyer.points_Balance < COST) return res.status(400).json({ code: 400, message: '积分不足' });

        const absolutePath = path.resolve(process.cwd(), resource.file_Path);
        if (!fs.existsSync(absolutePath)) return res.status(404).json({ code: 404, message: '文件丢失' });

        t = await sequelize.transaction();
        await users.decrement('points_Balance', { by: COST, where: { user_ID: userId }, transaction: t });
        await users.increment('points_Balance', { by: 2, where: { user_ID: resource.uploader_ID }, transaction: t });
        await resources.increment('download_Count', { by: 1, where: { resource_ID: resourceId }, transaction: t });
        await download_records.create({ user_ID: userId, resource_ID: resourceId, deducted_Points: COST, download_Time: new Date() }, { transaction: t });

        await t.commit();
        return res.download(absolutePath, `${resource.title}.${resource.format}`);
    } catch (err) {
        if (t) await t.rollback();
        console.error(err);
        return res.status(500).json({ code: 500, message: '下载失败' });
    }
};

/**
 * ✅ 核心逻辑：上传资源（带课程与标签自动关联）
 */
const uploadResource = async (req, res) => {
    let t;
    try {
        const { title, courseName, tags, points, description } = req.body;
        const uploader_ID = req.user.userId;

        if (!req.file) return res.status(400).json({ code: 400, message: '请选择文件' });

        t = await sequelize.transaction();

        const [course] = await models.courses.findOrCreate({ 
            where: { course_Name: courseName },
            defaults: { college: '通用学院' }, // 补全必填字段
            transaction: t 
        });

        const newResource = await resources.create({
            title, uploader_ID, course_ID: course.course_ID,
            file_Path: 'uploads/' + path.basename(req.file.path), // 存入相对路径，防止超出长度并增加迁移性
            format: path.extname(req.file.originalname).substring(1).toLowerCase(),
            file_Size: req.file.size,
            required_Points: points || 0,
            description, audit_Status: 'pending', upload_Time: new Date(), download_Count: 0
        }, { transaction: t });

        if (tags) {
            const tagList = Array.isArray(tags) ? tags : JSON.parse(tags);
            for (const tagName of tagList) {
                const [tagRecord] = await models.tags.findOrCreate({ where: { tag_Name: tagName }, transaction: t });
                await models.resource_tag_map.create({ resource_ID: newResource.resource_ID, tag_ID: tagRecord.tag_ID }, { transaction: t });
            }
        }

        await t.commit();
        res.status(201).json({ code: 201, message: '发布成功', data: { resourceId: newResource.resource_ID } });
    } catch (err) {
        if (t) await t.rollback();
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        console.error('上传失败:', err);
        res.status(500).json({ code: 500, message: '上传失败' });
    }
};

/**
 * ✅ 发现趋势列表
 */
const getDiscoverTrend = async (req, res) => {
    try {
        const { format, page = 1, limit = 10 } = req.query;
        const where = { audit_Status: 'approved' };
        if (format && format !== 'all') where.format = format;

        const { count, rows } = await resources.findAndCountAll({
            where,
            include: [{ model: users, as: 'uploader', attributes: ['name'] }],
            order: [['download_Count', 'DESC']],
            offset: (page - 1) * limit,
            limit: parseInt(limit)
        });

        res.json({ code: 200, data: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit) } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: '获取数据失败' });
    }
};

/**
 * ✅ 审核逻辑
 */
const getPendingResources = async () => {
    const list = await resources.findAll({ where: { audit_Status: 'pending' } });
    return list.map(r => r.toJSON());
};

const approveResource = async (resourceId) => {
    await resources.update({ audit_Status: 'approved' }, { where: { resource_ID: resourceId } });
};

const rejectResource = async (resourceId) => {
    await resources.update({ audit_Status: 'rejected' }, { where: { resource_ID: resourceId } });
};

/**
 * ✅ 核心逻辑：获取资源详情
 */
const getResourceDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await resources.findByPk(id, {
            include: [
                { model: models.users, as: 'uploader', attributes: ['name'] },
                { model: models.courses, as: 'course', attributes: ['course_Name'] },
                { 
                    model: models.tags, 
                    as: 'tags', 
                    through: { attributes: [] },
                    attributes: ['tag_Name'] 
                }
            ]
        });

        if (!resource) {
            return res.status(404).json({ code: 404, message: '资源不存在' });
        }

        res.json({ code: 200, data: resource });
    } catch (err) {
        console.error('获取资源详情失败:', err);
        res.status(500).json({ code: 500, message: '获取资源详情失败' });
    }
};

const getCourses = async (req, res) => {
    try {
        const list = await models.courses.findAll();
        res.json({ code: 200, data: list });
    } catch (err) {
        res.status(500).json({ code: 500, message: '获取课程失败' });
    }
};

module.exports = {
    downloadResource,
    uploadResource,
    getDiscoverTrend,
    getResourceDetail, // 新增详情接口
    getPendingResources,
    approveResource,
    rejectResource,
    getCourses
};