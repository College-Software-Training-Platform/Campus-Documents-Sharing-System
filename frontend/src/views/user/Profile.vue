<template>
  <div class="profile-container">
    <el-card class="user-card" shadow="hover">
      <div class="user-info-wrapper">
        <el-avatar :size="100" :src="userInfo.avatarUrl || defaultAvatar" class="user-avatar" />
        
        <div class="user-detail">
          <div class="detail-header">
            <h2 class="nickname">{{ userInfo.nickname }}</h2>
            <div class="stats-badge">
              <el-tag size="small" effect="plain">学号: {{ userInfo.studentId }}</el-tag>
              <el-tag type="warning" size="small" effect="light">积分: {{ userInfo.points }}</el-tag>
            </div>
          </div>
          
          <p class="user-bio">{{ userInfo.bio }}</p>

          <div class="data-stats">
            <div class="stat-item">
              <span class="stat-label">已上传</span>
              <span class="stat-value">{{ userInfo.uploadCount }}</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-label">已下载</span>
              <span class="stat-value">{{ userInfo.downloadCount }}</span>
            </div>
          </div>
        </div>

        <div class="user-actions">
          <el-button type="primary" plain @click="$router.push('/user/UserEdit')">修改资料</el-button>
        </div>
      </div>
    </el-card>

    <el-tabs v-model="activeTab" class="profile-tabs" type="border-card">
      <el-tab-pane label="我的上传" name="uploads">
        <MyUploads v-if="userInfo.userId" :userId="userInfo.userId" />
      </el-tab-pane>
      
      <el-tab-pane label="我的下载" name="downloads">
        <MyDownloads v-if="userInfo.userId" :userId="userInfo.userId" />
      </el-tab-pane>

      <el-tab-pane label="我的收藏" name="favorites">
        <MyFavorites v-if="userInfo.userId" :userId="userInfo.userId" />
      </el-tab-pane>

      <el-tab-pane label="积分明细" name="points">
        <PointDetails v-if="userInfo.userId" :userId="userInfo.userId" />
      </el-tab-pane>

      <el-tab-pane label="安全设置" name="security">
        <SecuritySettings :studentId="userInfo.studentId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

// 组件引入
import MyUploads from './components/MyUploads.vue' 
import MyDownloads from './components/MyDownloads.vue' 
import MyFavorites from './components/MyFavorites.vue' 
import PointDetails from './components/PointDetails.vue' 
import SecuritySettings from './components/SecuritySettings.vue'

const activeTab = ref('uploads')
const defaultAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

const userInfo = ref({
  nickname: '加载中...',
  bio: '',
  studentId: '',
  points: 0,
  uploadCount: 0,
  downloadCount: 0,
  avatarUrl: '',
  userId: null
})

/**
 * 动态获取当前登录用户数据
 */
const fetchUserData = async () => {
  try {
    // 1. 从 localStorage 获取登录时保存的用户信息
    // 注意：这里的 key 'user' 必须和你登录页面存入的 key 一致
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
      ElMessage.error('未检测到登录信息，请重新登录');
      userInfo.value.nickname = '未登录';
      return;
    }

    const currentUser = JSON.parse(storedUser);
    // 优先使用缓存中的 account，如果没有则使用你之前的测试账号作为兜底
    const targetStudentId = currentUser.account || '2024214283'; 
    
    // 2. 获取基础资料
    const profileRes = await request.get(`/users/profile`, {
      params: { studentId: targetStudentId }
    })

    if (profileRes.code === 200) {
      const data = profileRes.data
      
      userInfo.value.nickname = data.name || '未设置昵称'
      userInfo.value.bio = data.bio || '这位同学很懒，什么都没写'
      userInfo.value.studentId = data.account
      userInfo.value.points = data.points_Balance
      userInfo.value.avatarUrl = data.avatar_Url
      userInfo.value.userId = data.user_ID 

      // 3. 获取统计数据
      const statsRes = await request.get(`/users/stats`, {
        params: { userId: data.user_ID }
      })
      if (statsRes.code === 200) {
        userInfo.value.uploadCount = statsRes.data.uploadCount
        userInfo.value.downloadCount = statsRes.data.downloadCount
      }
    } else {
      userInfo.value.nickname = '查无此人';
      ElMessage.warning('数据库中未找到该用户信息');
    }
  } catch (error) {
    console.error('Profile 数据加载失败:', error);
    userInfo.value.nickname = '加载失败';
    ElMessage.error('网络请求失败，请确保后端服务已启动');
  }
}

onMounted(() => {
  fetchUserData()
})
</script>

<style scoped>
/* 样式部分保持不变 */
.profile-container { 
  max-width: 1100px; 
  margin: 30px auto; 
  padding: 0 20px; 
}

.user-card { 
  margin-bottom: 24px; 
  border-radius: 16px; 
  border: none;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
}

.user-info-wrapper { 
  display: flex; 
  align-items: center; 
  padding: 20px; 
}

.user-avatar {
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.user-detail { 
  flex: 1; 
  margin-left: 35px; 
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.nickname { 
  margin: 0; 
  font-size: 28px; 
  color: #303133;
}

.user-bio { 
  font-size: 14px;
  color: #909399;
  margin: 10px 0 20px 0;
}

.data-stats {
  display: flex;
  align-items: center;
  gap: 30px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 22px;
  font-weight: 600;
  color: #409EFF;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background-color: #ebeef5;
}

.user-actions {
  align-self: flex-start;
}

.profile-tabs { 
  border-radius: 16px; 
  min-height: 550px; 
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

:deep(.el-tabs--border-card) {
  border: none;
}

:deep(.el-tabs__item) {
  padding: 0 25px !important;
  font-weight: 500;
}
</style>