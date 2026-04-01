const axios = require('axios');

const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

/**
 * 根据标题生成 AI 摘要
 * @param {string} title 
 * @returns {Promise<Object>}
 */
const generateSummary = async (title) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'glm-4-flash',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的校园资源分享助手。请根据用户提供的“资源标题”，生成一段大约 100 字左右的“资源描述”。\n要求：\n1. 语言专业、客观、吸引人。\n2. 能够清晰概括该资料可能包含的内容及对同学们的帮助。\n3. 直接输出摘要内容，不要包含“好的”、“这是为你生成的”等修饰词。'
          },
          {
            role: 'user',
            content: `资源标题为：${title}`
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      },
      {
        headers: {
          'Authorization': `Bearer ${ZHIPU_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Zhipu AI Service Error:', error.response ? error.response.data : error.message);
    throw new Error('AI 服务连接失败，请稍后重试');
  }
};

module.exports = {
  generateSummary
};
