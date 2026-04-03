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
 * ✅ 核心逻辑：资源下载（已修正字段名以适配数据库）
 */
const downloadResource = async (req, res) => {
    let t;
    try {
        const { resourceId } = req.body;
        const userId = req.user.userId;

        // 1. 获取资源与用户信息
        const resource = await models.resources.findByPk(resourceId);
        if (!resource) return res.status(404).json({ code: 404, message: '资源不存在' });

        const buyer = await models.users.findByPk(userId);
        if (!buyer) return res.status(404).json({ code: 404, message: '用户不存在' });

        const COST = resource.required_Points || 0; 
        if (buyer.points_Balance < COST) return res.status(400).json({ code: 400, message: '积分不足' });

        // 2. 物理文件校验
        const absolutePath = path.resolve(__dirname, '../../', resource.file_Path);
        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({ code: 404, message: '物理文件丢失，请联系管理员' });
        }

        // 3. 开启原子事务
        t = await sequelize.transaction();
        
        if (COST > 0) {
            // A. 下载者：扣除积分
            await models.users.decrement('points_Balance', { by: COST, where: { user_ID: userId }, transaction: t });

            // B. 下载者：写入支出明细 (注意字段名 amount, create_Time)
            await models.points_logs.create({
                user_ID: userId,
                amount: -COST,
                reason: `下载资源支出：${resource.title}`,
                create_Time: new Date() 
            }, { transaction: t });

            // C. 上传者：获得收益 (40%)
            const income = Math.floor(COST * 0.4);
            if (income > 0) {
                await models.users.increment('points_Balance', { by: income, where: { user_ID: resource.uploader_ID }, transaction: t });

                // D. 上传者：写入收益明细
                await models.points_logs.create({
                    user_ID: resource.uploader_ID,
                    amount: income,
                    reason: `资源被下载获益：${resource.title}`,
                    create_Time: new Date()
                }, { transaction: t });
            }
        }

        // E. 记录下载历史 (对应你的 download_records 表)
        await models.download_records.create({ 
            user_ID: userId, 
            resource_ID: resourceId, 
            deducted_Points: COST, 
            download_Time: new Date() 
        }, { transaction: t });

        // F. 增加资源的累计下载次数
        await models.resources.increment('download_Count', { by: 1, where: { resource_ID: resourceId }, transaction: t });

        // 4. 提交所有变更
        await t.commit();
        
        // 5. 执行文件传输
        return res.download(absolutePath, `${resource.title}.${resource.format}`, (err) => {
            if (err) console.error('传输中断:', err);
        });

    } catch (err) {
        if (t) await t.rollback();
        console.error('下载处理崩溃:', err);
        return res.status(500).json({ code: 500, message: '系统下载处理失败' });
    }
};

/**
 * ✅ 核心逻辑：上传资源（包含：资源保存、课程/标签关联、奖励积分、写明细）
 */
const uploadResource = async (req, res) => {
    let t;
    try {
        const { title, courseName, tags, points, ai_Summary } = req.body;
        const uploader_ID = req.user.userId;

        if (!req.file) return res.status(400).json({ code: 400, message: '请选择文件' });

        t = await sequelize.transaction();

        // 1. 处理课程 (findOrCreate)
        const [course] = await models.courses.findOrCreate({ 
            where: { course_Name: courseName },
            defaults: { college: '通用学院' }, 
            transaction: t 
        });

        // 2. 创建资源记录
        const newResource = await models.resources.create({
            title, uploader_ID, course_ID: course.course_ID,
            file_Path: 'uploads/' + path.basename(req.file.path), 
            format: path.extname(req.file.originalname).substring(1).toLowerCase(),
            file_Size: req.file.size,
            required_Points: points || 0,
            ai_Summary, audit_Status: 'pending', upload_Time: new Date(), download_Count: 0
        }, { transaction: t });

        // 🌟 3. 补全：上传奖励 10 积分
        await models.users.increment('points_Balance', { by: 10, where: { user_ID: uploader_ID }, transaction: t });

        // 🌟 4. 补全：记录上传奖励明细 (amount, create_Time)
        await models.points_logs.create({
            user_ID: uploader_ID,
            amount: 10,
            reason: `发布资源奖励：${title}`,
            create_Time: new Date()
        }, { transaction: t });

        // 5. 处理标签映射
        if (tags) {
            const tagList = Array.isArray(tags) ? tags : JSON.parse(tags);
            for (const tagName of tagList) {
                const [tagRecord] = await models.tags.findOrCreate({ where: { tag_Name: tagName }, transaction: t });
                await models.resource_tag_map.create({ 
                    resource_ID: newResource.resource_ID, 
                    tag_ID: tagRecord.tag_ID 
                }, { transaction: t });
            }
        }

        await t.commit();
        res.status(201).json({ code: 201, message: '发布成功', data: { resourceId: newResource.resource_ID } });
    } catch (err) {
        if (t) await t.rollback();
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        console.error('上传处理失败:', err);
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
 * ✅ 获取待审核列表
 */
const getPendingResources = async (req, res) => {
    try {
        const list = await resources.findAll({
            where: { audit_Status: 'pending' }
        });

        res.json({
            code: 200,
            data: list
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            message: '获取待审核资源失败'
        });
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

/**
 * ✅ 获取所有课程列表
 */
const getCourses = async (req, res) => {
    try {
        const list = await models.courses.findAll();
        res.json({ code: 200, data: list });
    } catch (err) {
        res.status(500).json({ code: 500, message: '获取课程失败' });
    }
};

const auditResource = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // approve / reject

        if (action === 'approve') {
            await approveResource(id);
            return res.json({ code: 200, message: '操作成功' });
        } else if (action === 'reject') {
            await rejectResource(id);
            return res.json({ code: 200, message: '已驳回' });
        } else {
            return res.status(400).json({ code: 400, message: '无效操作' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: '审核失败' });
    }
};


const approveResource = async (resourceId) => {
    await resources.update(
        { audit_Status: 'approved' },
        { where: { resource_ID: resourceId } }
    );
};

const rejectResource = async (resourceId) => {
    await resources.update(
        { audit_Status: 'rejected' },
        { where: { resource_ID: resourceId } }
    );
};


module.exports = {
    downloadResource,
    uploadResource,
    getDiscoverTrend,
    getResourceDetail,
    getPendingResources,
    auditResource,
    getCourses
};