<template>
  <div class="comments-section">
    <div class="comments-header">
      <h3>用户评论 (42)</h3>
      <el-button type="primary" link>发表评论</el-button>
    </div>
    
    <div class="comment-item">
      <el-avatar :size="40" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
      <div class="comment-content">
        <div class="comment-user">
          <span class="name">李华</span>
          <span class="grade">大三 · 软件工程</span>
          <div class="stars"><el-icon v-for="i in 5" :key="i" color="#f59e0b"><StarFilled /></el-icon></div>
        </div>
        <p class="comment-text">公式推导部分非常详细，简直是考前救星！谢谢分享！</p>
        <div class="comment-actions">
          <span class="time">2023-12-15</span>
          <span class="action"><el-icon><CaretTop /></el-icon> 12</span>
          <span class="action">回复</span>
        </div>
      </div>
    </div>

    <div class="comment-item">
      <el-avatar :size="40" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
      <div class="comment-content">
        <div class="comment-user">
          <span class="name">王小明</span>
          <span class="grade">大二 · 人工智能</span>
          <div class="stars"><el-icon v-for="i in 5" :key="i" color="#f59e0b"><StarFilled /></el-icon></div>
        </div>
        <p class="comment-text">挺全的，就是积分略贵，但确实值得这个价稍。</p>
        <div class="comment-actions">
          <span class="time">2023-12-10</span>
          <span class="action"><el-icon><CaretTop /></el-icon> 5</span>
          <span class="action">回复</span>
        </div>
      </div>
    </div>

    <div class="view-all-comments">
      <el-button text>查看全部评论</el-button>
    </div>
  </div>
</template>

<script setup>
import { StarFilled, CaretTop } from '@element-plus/icons-vue'
</script>

<style scoped>
/* Comments */
.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.comments-header h3 {
  font-size: 18px;
  margin: 0;
}

.comment-item {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.comment-content {
  flex: 1;
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.comment-user .name {
  font-weight: 600;
  color: #0f172a;
}

.comment-user .grade {
  font-size: 12px;
  color: #94a3b8;
}

.comment-user .stars {
  margin-left: auto;
  font-size: 12px;
}

.comment-text {
  color: #334155;
  font-size: 14px;
  margin: 0 0 10px 0;
  line-height: 1.5;
}

.comment-actions {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #94a3b8;
}

.comment-actions .action {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.view-all-comments {
  text-align: center;
  margin-top: 20px;
}
</style>
