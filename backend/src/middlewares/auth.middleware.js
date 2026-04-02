const jwt = require('jsonwebtoken');

/**
 * JWT 鉴权中间件
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ code: 401, message: '未授权：缺少访问令牌' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'AAAcampusSharingSystem');
        req.user = decoded; // 将用户信息存入请求对象，方便后续使用
        next();
    } catch (error) {
        return res.status(401).json({ code: 401, message: '身份验证失败：令牌无效或已过期' });
    }
};

module.exports = authMiddleware;
