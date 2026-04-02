const glmService = require('../utils/glmService');

/**
 * 自动生成资源摘要 Controller
 * @param {Object} req 
 * @param {Object} res 
 */
const generateSummary = async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ 
      success: false, 
      message: '请先输入资源标题，AI 将根据标题为您生成相关描述' 
    });
  }

  try {
    const aiResponse = await glmService.generateSummary(title);
    
    if (aiResponse && aiResponse.choices && aiResponse.choices.length > 0) {
      const summary = aiResponse.choices[0].message.content;
      
      return res.status(200).json({
        success: true,
        summary: summary.trim()
      });
    } else {
      throw new Error('AI 响应异常');
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'AI 生成失败，请稍后刷新重试'
    });
  }
};

module.exports = {
  generateSummary
};
