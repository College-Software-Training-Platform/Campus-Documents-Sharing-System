<template>
  <div class="points-history" v-loading="loading">
    <el-alert 
      title="小提示：上传优质资源被下载可获得更多积分哦！" 
      type="info" 
      show-icon 
      :closable="false" 
      style="margin-bottom: 20px;"
    />
    
    <el-empty v-if="!loading && pointLogs.length === 0" description="暂无积分明细记录" />

    <el-timeline v-else style="padding-left: 10px">
      <el-timeline-item
        v-for="(log, index) in pointLogs"
        :key="index"
        :type="log.type === 'positive' ? 'success' : 'danger'"
        :timestamp="formatTime(log.time)"
        placement="top"
      >
        <el-card shadow="hover">
          <h4 style="margin: 0 0 10px 0;">{{ log.reason }}</h4>
          <p :style="{ 
            color: log.type === 'positive' ? '#67C23A' : '#F56C6C', 
            fontWeight: 'bold',
            fontSize: '16px',
            margin: 0 
          }">
            {{ log.amount > 0 ? '+' : '' }}{{ log.amount }} 积分
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// 💡 使用你项目自带的 request 工具，确保拦截器和 BaseURL 一致
import request from '@/utils/request'

const pointLogs = ref([])
const loading = ref(false)

// 🔍 适配 Login.vue 的存储逻辑
const getStudentId = () => {
  const userStr = localStorage.getItem('user'); 
  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      // 优先取 account (学号)，没有则取 user_ID
      return userData.account || userData.studentId || userData.user_ID;
    } catch (e) { 
      console.error("解析用户信息失败", e);
      return null; 
    }
  }
  return null;
}

const fetchPointDetails = async () => {
  const sId = getStudentId();
  console.log('当前尝试获取明细的学号:', sId);

  if (!sId) {
    ElMessage.warning('身份识别失败，请尝试重新登录');
    return;
  }
  
  loading.value = true
  try {
    // 💡 这里的路径去掉 /api，因为 request.js 通常会自动加上前缀
    const res = await request.get('/users/points/details', {
      params: { studentId: sId }
    })
    
    // 如果你的 request.js 已经做了拦截器处理 res.data，这里直接用 res
    // 如果没做，则用 res.data
    const resData = res.code ? res : res.data;
    
    if (resData && resData.code === 200) {
      pointLogs.value = resData.data || []
      console.log('获取数据成功:', pointLogs.value);
    } else {
      ElMessage.error(resData?.message || '获取明细失败');
    }
  } catch (error) {
    console.error('请求错误详情:', error);
    ElMessage.error('无法连接服务器，请检查后端状态');
  } finally {
    loading.value = false
  }
}

const formatTime = (timeStr) => {
  if (!timeStr) return '未知时间'
  const date = new Date(timeStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

onMounted(() => {
  fetchPointDetails()
})
</script>

<style scoped>
.points-history {
  padding: 10px;
  min-height: 200px;
}
:deep(.el-card__body) {
  padding: 15px 20px;
}
:deep(.el-timeline-item__timestamp) {
  font-size: 14px;
  color: #909399;
}
</style>