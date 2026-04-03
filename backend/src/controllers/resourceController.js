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
        const { resourceId } = req.body;
        const userId = req.user.userId; // 强制使用鉴权后的用户ID

        const resource = await resources.findByPk(resourceId);
        if (!resource) return res.status(404).json({ code: 404, message: '资源不存在' });

        const buyer = await users.findByPk(userId);
        if (!buyer) return res.status(404).json({ code: 404, message: '用户不存在' });

        const COST = resource.required_Points || 0; // 使用资源定义的积分
        if (buyer.points_Balance < COST) return res.status(400).json({ code: 400, message: '积分不足' });

        // ✅ 修正路径解析：__dirname 在 src/controllers，回溯两层到 backend 根目录获取 uploads
        const absolutePath = path.resolve(__dirname, '../../', resource.file_Path);
        if (!fs.existsSync(absolutePath)) {
            console.error('找不到物理文件:', absolutePath);
            return res.status(404).json({ code: 404, message: '物理文件丢失，请联系管理员' });
        }

        t = await sequelize.transaction();
        
        // 核心事务逻辑
        if (COST > 0) {
            await users.decrement('points_Balance', { by: COST, where: { user_ID: userId }, transaction: t });
            // 上传者获得 40% 的收益 (简单演示)
            const income = Math.floor(COST * 0.4);
            if (income > 0) {
                await users.increment('points_Balance', { by: income, where: { user_ID: resource.uploader_ID }, transaction: t });
            }
        }

        await download_records.create({ 
            user_ID: userId, 
            resource_ID: resourceId, 
            deducted_Points: COST, 
            download_Time: new Date() 
        }, { transaction: t });

        await t.commit();
        
        // 执行下载 (增加回调以捕获发送流时的错误)
        return res.download(absolutePath, `${resource.title}.${resource.format}`, (err) => {
            if (err) {
                console.error('文件传输过程中发生错误:', err);
                // 即使传输失败也无需再次 res.send，因为 res.download 可能已经发送了部分响应
            }
        });
    } catch (err) {
        if (t) await t.rollback();
        console.error('下载预处理失败:', err);
        return res.status(500).json({ code: 500, message: '系统下载处理失败' });
    }
};

/**
 * ✅ 核心逻辑：上传资源（带课程与标签自动关联）
 */
const uploadResource = async (req, res) => {
    let t;
    try {
        const { title, courseName, tags, points, ai_Summary } = req.body;
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
            ai_Summary, audit_Status: 'pending', upload_Time: new Date(), download_Count: 0
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
        const where = { [Sequelize.Op.or]: [{ audit_Status: 'approved' }, { audit_Status: 'pending' }] };
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
 * ✅ 获取待审核列表 (适配路由)
 */
const getPendingResources = async (req, res) => {
    try {
        const list = await resources.findAll({ 
            where: { audit_Status: 'pending' },
            include: [{ model: users, as: 'uploader', attributes: ['name'] }]
        });
        res.json({ code: 200, data: list });
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: '获取审核列表失败' });
    }
};

/**
 * ✅ 统一审核逻辑 (适配 router.put('/:id/audit'))
 */
const auditResource = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 前端传 'approved' 或 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ code: 400, message: '审核状态无效' });
        }

        const [updated] = await resources.update(
            { audit_Status: status },
            { where: { resource_ID: id } }
        );

        if (updated) {
            res.json({ code: 200, message: `操作成功，已将资源设置为: ${status}` });
        } else {
            res.status(404).json({ code: 404, message: '未找到该资源' });
        }
    } catch (err) {
        console.error('审核失败:', err);
        res.status(500).json({ code: 500, message: '审核系统故障' });
    }
};

/**
 * ✅ 核心逻辑：获取资源详情
 */
const getResourceDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await resources.findByPk(id, {
            include: [
                { model: users, as: 'uploader', attributes: ['user_ID', 'name', 'avatar_Url'] },
                { model: models.courses, as: 'course', attributes: ['course_Name', 'college'] },
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
    getResourceDetail,
    getPendingResources,
    // approveResource,
    // rejectResource,
    auditResource,
    getCourses
};