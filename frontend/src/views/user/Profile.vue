<template>
  <div class="profile-container">
    <el-card class="user-card" shadow="hover">
      <div class="user-info-wrapper">
        <el-avatar :size="80" :src="userInfo.avatarUrl || defaultAvatar" />
        <div class="user-detail">
          <h2 class="nickname">{{ userInfo.nickname }}</h2>
          <p class="user-bio">{{ userInfo.bio }}</p>
          <div class="stats-badge">
            <el-tag size="small" effect="dark">学号: {{ userInfo.studentId }}</el-tag>
            <el-tag type="warning" size="small">积分: {{ userInfo.points }}</el-tag>
          </div>
        </div>
        <div class="user-actions">
          <el-button type="primary" @click="$router.push('/user/UserEdit')">修改资料</el-button>
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
        <SecuritySettings :studentId="userInfo.studentId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MyResources from './components/MyResources.vue'
import PointDetails from './components/PointDetails.vue'
import SecuritySettings from './components/SecuritySettings.vue' // 引入新组件

const activeTab = ref('resources')
const defaultAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

const userInfo = ref({
  nickname: '重邮学霸',
  bio: '计算机学院 | 软件工程',
  studentId: '202421XXXX',
  points: 150,
  avatarUrl: ''
})
</script>

<style scoped>
.profile-container { max-width: 1000px; margin: 30px auto; padding: 0 20px; }
.user-card { margin-bottom: 24px; border-radius: 12px; border: none; background: linear-gradient(to right, #ffffff, #f8faff); }
.user-info-wrapper { display: flex; align-items: center; padding: 10px; }
.user-detail { flex: 1; margin-left: 25px; }
.nickname { margin: 0 0 8px 0; font-size: 26px; }
.profile-tabs { border-radius: 12px; min-height: 500px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
</style>