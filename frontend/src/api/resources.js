import request from '@/utils/request'; // 假设你已封装axios

export const getAISummary = (resourceId) => {
  return request({
    url: `/resources/${resourceId}/summary`,
    method: 'post'
  });
};