/**
 * @file searchController.js
 * @description 多条件组合搜索业务逻辑
 */

const sequelize = require('../config/database');
const initModels = require('../models/init-models');
const { Op } = require('sequelize');

const models = initModels(sequelize);
const { resources, courses, users, tags } = models;

/**
 * 多条件搜索资源
 * GET /api/resources/search
 * @query q: 搜索关键词
 * @query category: 资源分类 (all|course|exam|notes)
 * @query sort: 排序方式 (default|newest|hottest|cheapest)
 * @query page: 页码
 * @query limit: 每页数量
 */
exports.searchResources = async (req, res) => {
  try {
    const keyword = String(req.query.q || '').trim();
    const category = String(req.query.category || 'all').toLowerCase();
    const sort = String(req.query.sort || 'default').toLowerCase();
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const offset = (page - 1) * limit;

    const andConditions = [{ audit_Status: 'approved' }];

    if (keyword) {
      andConditions.push({
        [Op.or]: [
          { title: { [Op.like]: `%${keyword}%` } },
          { extracted_Text: { [Op.like]: `%${keyword}%` } },
          sequelize.where(sequelize.col('course.course_Name'), { [Op.like]: `%${keyword}%` }),
          sequelize.where(sequelize.col('uploader.name'), { [Op.like]: `%${keyword}%` }),
          sequelize.where(sequelize.col('tags.tag_Name'), { [Op.like]: `%${keyword}%` })
        ]
      });
    }

    if (category === 'course') {
      andConditions.push({
        course_ID: { [Op.ne]: null }
      });
    } else if (category === 'exam') {
      andConditions.push({
        [Op.or]: [
          { title: { [Op.like]: '%真题%' } },
          { title: { [Op.like]: '%试卷%' } },
          { title: { [Op.like]: '%考试%' } }
        ]
      });
    } else if (category === 'notes') {
      andConditions.push({
        [Op.or]: [
          { title: { [Op.like]: '%笔记%' } },
          { title: { [Op.like]: '%总结%' } }
        ]
      });
    }

    let order = [['upload_Time', 'DESC']];
    if (sort === 'hottest') {
      order = [['download_Count', 'DESC'], ['upload_Time', 'DESC']];
    } else if (sort === 'cheapest') {
      order = [['required_Points', 'ASC'], ['upload_Time', 'DESC']];
    } else if (sort === 'newest') {
      order = [['upload_Time', 'DESC']];
    }

    const { count, rows } = await resources.findAndCountAll({
      where: { [Op.and]: andConditions },
      order,
      offset,
      limit,
      distinct: true,
      include: [
        {
          model: courses,
          as: 'course',
          attributes: ['course_ID', 'course_Name', 'college'],
          required: false
        },
        {
          model: users,
          as: 'uploader',
          attributes: ['user_ID', 'name'],
          required: false
        },
        {
          model: tags,
          as: 'tags',
          attributes: ['tag_ID', 'tag_Name'],
          through: { attributes: [] },
          required: false
        }
      ]
    });

    res.status(200).json({
      code: 200,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    console.error('搜索资源失败:', err);
    res.status(500).json({ code: 500, message: '搜索资源失败' });
  }
};
