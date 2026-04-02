/**
 * @file discoverController.js
 * @description 发现页面相关业务逻辑（趋势、课程导航、热门标签）
 */

const sequelize = require('../config/database');
const initModels = require('../models/init-models');
const { Op } = require('sequelize');

const models = initModels(sequelize);
const { resources, courses, tags, users } = models;

/**
 * 获取发现趋势资源
 * GET /api/resources/discover/trend
 * @query format: all|pdf|docx|zip
 * @query sort: hottest|newest|cheapest
 * @query page: 1
 * @query limit: 10
 */
exports.getDiscoverTrend = async (req, res) => {
  try {
    const format = String(req.query.format || 'all').toLowerCase();
    const sort = String(req.query.sort || 'hottest').toLowerCase();
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const offset = (page - 1) * limit;

    const where = { audit_Status: 'approved' };
    if (format !== 'all') {
      where.format = format;
    }

    let order = [['download_Count', 'DESC'], ['upload_Time', 'DESC']];
    if (sort === 'newest') {
      order = [['upload_Time', 'DESC']];
    } else if (sort === 'cheapest') {
      order = [['required_Points', 'ASC'], ['upload_Time', 'DESC']];
    }

    const { count, rows } = await resources.findAndCountAll({
      where,
      order,
      offset,
      limit,
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
    console.error('获取趋势资源失败:', err);
    res.status(500).json({ code: 500, message: '获取趋势资源失败' });
  }
};

/**
 * 获取所有课程及其资源数量
 * GET /api/resources/courses
 */
exports.getCourses = async (req, res) => {
  try {
    const [courseList, counts] = await Promise.all([
      courses.findAll({
        attributes: ['course_ID', 'course_Name', 'college'],
        raw: true
      }),
      resources.findAll({
        attributes: [
          'course_ID',
          [sequelize.fn('COUNT', sequelize.col('resource_ID')), 'resourceCount']
        ],
        where: {
          audit_Status: 'approved',
          course_ID: { [Op.ne]: null }
        },
        group: ['course_ID'],
        raw: true
      })
    ]);

    const countMap = new Map(
      counts.map((item) => [item.course_ID, Number(item.resourceCount) || 0])
    );

    const result = courseList.map((course) => ({
      ...course,
      resourceCount: countMap.get(course.course_ID) || 0
    }));

    res.status(200).json({ code: 200, data: result });
  } catch (err) {
    console.error('获取课程列表失败:', err);
    res.status(500).json({ code: 500, message: '获取课程列表失败' });
  }
};

/**
 * 获取热门标签
 * GET /api/resources/tags/hot
 * @query limit: 6
 */
exports.getHotTags = async (req, res) => {
  try {
    const limit = Math.max(parseInt(req.query.limit, 10) || 6, 1);

    const hotTags = await tags.findAll({
      attributes: [
        'tag_ID',
        'tag_Name',
        [sequelize.fn('COUNT', sequelize.col('resource_ID_resources.resource_ID')), 'count']
      ],
      include: [
        {
          model: resources,
          as: 'resource_ID_resources',
          attributes: [],
          through: { attributes: [] },
          where: { audit_Status: 'approved' },
          required: false
        }
      ],
      group: ['tags.tag_ID'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit,
      subQuery: false
    });

    const result = hotTags.map((item) => ({
      tagId: item.tag_ID,
      tagName: item.tag_Name,
      count: Number(item.get('count')) || 0
    }));

    res.status(200).json({ code: 200, data: result });
  } catch (err) {
    console.error('获取热门标签失败:', err);
    res.status(500).json({ code: 500, message: '获取热门标签失败' });
  }
};
