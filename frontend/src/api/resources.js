import request from '@/api/index'; // 使用已封装的 axios

/**
 * 获取 AI 摘要
 */
export const getAISummary = (resourceId) => {
  return request({
    url: `/resources/${resourceId}/summary`,
    method: 'post'
  });
};

/**
 * 获取发现趋势资源
 * @param {Object} params - { format, sort, page, limit }
 */
export const getDiscoverTrend = (params) => {
  return request({
    url: '/resources/discover/trend',
    method: 'get',
    params
  });
};

/**
 * 获取所有课程及资源数
 */
export const getCourses = () => {
  return request({
    url: '/resources/courses',
    method: 'get'
  });
};

/**
 * 获取热门标签
 * @param {number} limit - 返回数量
 */
export const getHotTags = (limit = 6) => {
  return request({
    url: '/resources/tags/hot',
    method: 'get',
    params: { limit }
  });
};

export const searchResources = (params) => {
  return request({
    url: '/resources/search',
    method: 'get',
    params
  });
};

/**
 * 获取资源详细信息
 * @param {number|string} resourceId 
 */
export const getResourceDetail = (resourceId) => {
  return request({
    url: `/resources/${resourceId}`,
    method: 'get'
  });
};

/**
 * 下载资源 (获取文件流)
 * @param {number|string} resourceId 
 */
export const downloadResource = (resourceId) => {
  return request({
    url: '/resources/download',
    method: 'post',
    data: { resourceId },
    responseType: 'blob' // 必须设置为 blob 才能处理二进制流
  });
};