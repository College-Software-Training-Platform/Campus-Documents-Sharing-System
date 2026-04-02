import axios from 'axios';
import { ElMessage } from 'element-plus';

// 创建 axios 实例
const service = axios.create({
    baseURL: 'http://localhost:3000/api', // 后端 API 地址
    timeout: 10000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 从 localStorage 获取 token
        const token = localStorage.getItem('token');
        if (token) {
            // 如果 token 存在，则在请求头中携带 token
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('请求错误:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    response => {
        const res = response.data;
        // 如果后端返回的状态码不是 200 或 201，则判定为错误 (根据你的业务逻辑调整)
        if (res.code && res.code !== 200 && res.code !== 201) {
            ElMessage.error(res.message || '输出错误');
            return Promise.reject(new Error(res.message || 'Error'));
        }
        return res;
    },
    error => {
        console.error('响应异常:', error);
        const message = error.response?.data?.message || '服务器连接异常';
        ElMessage.error(message);
        
        // 如果是 401 (未授权)，可能需要清除 token 并跳转到登录页
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default service;
