<template>
  <div class="profile-container">
    <el-card class="user-card" shadow="hover">
      <div class="user-info-wrapper">
        <el-avatar :size="80" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        <div class="user-detail">
          <h2 class="nickname">{{ userInfo.nickname || '未登录用户' }}</h2>
          <p class="user-bio">{{ userInfo.bio || '探索知识，共享成长' }}</p>
          <div class="stats-badge">
            <el-tag size="small" effect="dark">学号: {{ userInfo.studentId }}</el-tag>
            <el-tag type="warning" size="small" effect="plain">剩余积分: {{ userInfo.points }}</el-tag>
          </div>
        </div>
        <div class="user-actions">
          <el-button type="primary" size="default">修改资料</el-button>
        </div>
      </div>
    </el-card>

    

    <el-tabs v-model="activeTab" class="profile-tabs" type="border-card">
      <el-tab-pane label="我的资料库" name="resources">
        <MyResources />
      </el-tab-pane>
      
      <el-tab-pane label="积分明细" name="points">
        <PointDetails />
      </el-tab-pane>

      <el-tab-pane label="安全设置" name="security">
        <div class="placeholder">密码修改与账号绑定功能开发中...</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MyResources from './components/MyResources.vue'
import PointDetails from './components/PointDetails.vue'

const activeTab = ref('resources')
const userInfo = ref({
  nickname: '重邮学生',
  bio: '计科专业 | 考研党',
  studentId: '202421XXXX',
  points: 150
})

onMounted(() => {
  // 此处后续对接 API：request.get('/user/info')
})
</script>

<style scoped>
.profile-container { max-width: 1000px; margin: 30px auto; }
.user-card { margin-bottom: 20px; border-radius: 12px; border: none; background: linear-gradient(to right, #ffffff, #f0f7ff); }
.user-info-wrapper { display: flex; align-items: center; padding: 10px; }
.user-detail { flex: 1; margin-left: 25px; }
.nickname { margin: 0 0 5px 0; font-size: 24px; color: #303133; }
.user-bio { font-size: 14px; color: #909399; margin-bottom: 12px; }
.stats-badge { display: flex; gap: 10px; }
.profile-tabs { border-radius: 8px; min-height: 500px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
</style>