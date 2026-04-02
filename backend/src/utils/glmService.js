const axios = require('axios');
const jwt = require('jsonwebtoken');

const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

/**
 * 智谱 AI 鉴权 Token 生成逻辑
 * 使用 API_KEY 的 id 和 secret 进行 JWT 签名
 * @param {string} apiKey 
 * @returns {string} token
 */
const generateToken = (apiKey) => {
  if (!apiKey || !apiKey.includes('.')) {
    throw new Error('ZHIPU_API_KEY 格式不正确');
  }
  const [id, secret] = apiKey.split('.');
  const timestamp = Date.now();
  const payload = {
    api_key: id,
    exp: timestamp + 3600 * 1000, // Token 有效期 1 小时
    timestamp: timestamp,
  };

  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    header: {
      alg: 'HS256',
      sign_type: 'SIGN',
    },
  });
};

/**
 * 根据标题生成 AI 摘要
 * @param {string} title 
 * @returns {Promise<Object>}
 */
const generateSummary = async (title) => {
  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey) {
    throw new Error('未配置 ZHIPU_API_KEY，请检查 .env 文件');
  }

  try {
    // 动态生成 JWT Token
    const token = generateToken(apiKey);

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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('Zhipu AI Auth Error: 认证失败，请检查 API Key');
    }
    console.error('Zhipu AI Service Error:', error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.error?.message || 'AI 服务连接失败');
  }
};

module.exports = {
  generateSummary
};
