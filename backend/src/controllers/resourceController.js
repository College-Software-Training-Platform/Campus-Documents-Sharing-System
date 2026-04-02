// backend/src/controllers/resourceController.js
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const path = require('path');
const fs = require('fs');

// 初始化所有需要的模型
const initModels = require('../models/init-models');
const models = initModels(sequelize);
const { resources, users, download_records, points_logs } = models;

/**
 * ✅ 核心逻辑：下载资源并处理积分事务
 */
const downloadResource = async (req, res) => {
    let t;
    try {
        const { userId, resourceId } = req.body;

        // 1. 查找资源及相关信息
        const resource = await resources.findByPk(resourceId);
        if (!resource) {
            return res.status(404).json({ code: 404, message: '资源不存在' });
        }

        // 2. 查找下载者（买家）信息
        const buyer = await users.findByPk(userId);
        if (!buyer) {
            return res.status(404).json({ code: 404, message: '用户不存在' });
        }

        const COST = 5;       // 固定下载消耗
        const REWARD = 2;     // 固定作者收益

        // 3. 检查积分是否足够
        if (buyer.points_Balance < COST) {
            return res.status(400).json({ code: 400, message: '积分不足，无法下载' });
        }

        // --- 📂 物理路径处理 (关键修改点) ---
        // 使用 process.cwd() 锁定项目根目录，避免层级跳错
        const absolutePath = path.resolve(process.cwd(), resource.file_Path);
        
        console.log('--- 🚀 正在尝试定位文件 ---');
        console.log('项目根目录:', process.cwd());
        console.log('数据库存入路径:', resource.file_Path);
        console.log('解析后绝对路径:', absolutePath);

        // 检查物理文件是否存在
        if (!fs.existsSync(absolutePath)) {
            console.error('❌ 错误：在上述路径未找到文件！');
            return res.status(404).json({ code: 404, message: '服务器物理文件丢失，积分未扣除' });
        }

        // 4. 开启数据库事务
        t = await sequelize.transaction();

        // A. 扣除下载者积分
        await users.decrement('points_Balance', { by: COST, where: { user_ID: userId }, transaction: t });

        // B. 增加上传者积分
        await users.increment('points_Balance', { by: REWARD, where: { user_ID: resource.uploader_ID }, transaction: t });

        // C. 增加资源下载计数
        await resources.increment('download_Count', { by: 1, where: { resource_ID: resourceId }, transaction: t });

        // D. 写入下载记录表
        await download_records.create({
            user_ID: userId,
            resource_ID: resourceId,
            deducted_Points: COST,
            download_Time: new Date()
        }, { transaction: t });

        // E. 写入积分明细表（如果你数据库有这条表，请取消注释）
        /*
        await points_logs.create({
            user_ID: userId,
            change_Amount: -COST,
            change_Type: '下载支出',
            description: `下载资源: ${resource.title}`,
            create_Time: new Date()
        }, { transaction: t });
        */

        // 5. 提交事务
        await t.commit();
        console.log('✅ 积分处理成功，开始传输文件流...');

        // 6. 执行下载
        return res.download(absolutePath, `${resource.title}.${resource.format || 'jpg'}`);

    } catch (err) {
        if (t) await t.rollback();
        console.error('❌ 下载业务执行失败:', err.message);
        return res.status(500).json({ code: 500, message: '服务器内部错误，下载失败' });
    }
};

/**
 * ✅ 现有审核逻辑
 */
const getPendingResources = async () => {
    try {
        const pendingList = await resources.findAll({
            where: { audit_Status: 'pending' }
        });
        return pendingList.map(r => r.toJSON());
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const approveResource = async (resourceId) => {
    try {
        await resources.update(
            { audit_Status: 'approved' },
            { where: { resource_ID: resourceId } }
        );
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const rejectResource = async (resourceId) => {
    try {
        await resources.update(
            { audit_Status: 'rejected' },
            { where: { resource_ID: resourceId } }
        );
    } catch (err) {
        console.error(err);
        throw err;
    }
};

<<<<<<< Updated upstream

// 审核资源（统一处理通过 / 驳回）
const auditResource = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body   // approved / rejected

        // 校验状态
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: '非法状态' })
        }

        const result = await resources.update(
            { audit_Status: status },
            { where: { resource_ID: id } }
        )

        if (result[0] === 0) {
            return res.status(404).json({ message: '资源不存在' })
        }

        res.json({ message: '审核成功' })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '审核失败' })
    }
}



//导出
module.exports = {
    downloadResource,
    getPendingResources,
    auditResource   
=======
/**
 * ✅ 核心逻辑：上传资源并处理课程、标签关联
 */
const uploadResource = async (req, res) => {
    let t;
    try {
        const { title, courseName, tags, points, description } = req.body;
        const uploader_ID = req.user.userId; // 从 JWT 中间件获取

        if (!req.file) {
            return res.status(400).json({ code: 400, message: '未检测到上传文件' });
        }

        // 开启事务
        t = await sequelize.transaction();

        // 1. 处理课程 (Find or Create)
        const [course] = await models.courses.findOrCreate({
            where: { course_Name: courseName },
            transaction: t
        });

        // 2. 创建资源记录
        const newResource = await resources.create({
            title: title,
            uploader_ID: uploader_ID,
            course_ID: course.course_ID,
            file_Path: req.file.path.replace(/\\/g, '/'), // 统一路径分隔符
            format: path.extname(req.file.originalname).substring(1).toLowerCase(),
            file_Size: req.file.size,
            required_Points: points || 0,
            description: description,
            audit_Status: 'pending', // 默认待审核
            upload_Time: new Date(),
            download_Count: 0
        }, { transaction: t });

        // 3. 处理标签
        if (tags) {
            // 支持前端传数组或逗号分隔字符串
            const tagList = Array.isArray(tags) ? tags : tags.split(',').map(s => s.trim()).filter(Boolean);
            
            for (const tagName of tagList) {
                const [tagRecord] = await models.tags.findOrCreate({
                    where: { tag_Name: tagName },
                    transaction: t
                });
                
                await models.resource_tag_map.create({
                    resource_ID: newResource.resource_ID,
                    tag_ID: tagRecord.tag_ID
                }, { transaction: t });
            }
        }

        await t.commit();
        res.status(201).json({ 
            code: 201, 
            message: '资源发布成功，请等待审核', 
            data: { resourceId: newResource.resource_ID } 
        });

    } catch (err) {
        if (t) await t.rollback();
        // 如果失败，尝试删除已上传的物理文件
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error('❌ 上传失败:', err);
        res.status(500).json({ code: 500, message: '服务器内部错误，上传失败' });
    }
};

module.exports = {
    downloadResource,
    getPendingResources,
    approveResource,
    rejectResource,
    uploadResource
>>>>>>> Stashed changes
};