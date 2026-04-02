<template>
  <div class="publish-sidebar">
    <!-- 上传获积分 -->
    <el-card class="sidebar-card points-card" shadow="never">
      <div class="card-header">
        <el-icon class="mr-2"><Coin /></el-icon> <span>上传获积分</span>
      </div>
      <ul class="points-list">
        <li><el-icon><Select /></el-icon> 成功发布一个资源 +10 积分</li>
        <li><el-icon><Select /></el-icon> 资源被评为优秀 +20 积分</li>
        <li><el-icon><Select /></el-icon> 他人下载你可获得设定的积分</li>
      </ul>
    </el-card>

    <!-- 上传小贴士 -->
    <el-card class="sidebar-card tip-card" shadow="never">
      <div class="card-header">
        <el-icon class="mr-2 text-yellow-500"><WarningFilled /></el-icon> <span class="text-gray-800">上传小贴士</span>
      </div>
      <div class="tip-content">
        <div class="tip-item">
          <span class="tip-number">1</span>
          <p>使用清晰、包含关键词的标题，能让更多人搜索到你的资源。</p>
        </div>
        <div class="tip-item">
          <span class="tip-number">2</span>
          <p>资源描述越详细，审核速度越快，下载量通常也更高。</p>
        </div>
        <div class="tip-item">
          <span class="tip-number">3</span>
          <p>如果您的资料包含手写笔记，请确保图片清晰易读。</p>
        </div>
      </div>
    </el-card>

    <!-- 内容规范 -->
    <el-card class="sidebar-card rules-card" shadow="never">
      <div class="card-header text-red-500">
        <el-icon class="mr-2"><WarnTriangleFilled /></el-icon> <span>内容规范</span>
      </div>
      <ul class="rules-list">
        <li>严禁上传包含个人隐私信息的资料</li>
        <li>严禁上传政治敏感、暴力或违规内容</li>
        <li>请勿重复上传平台上已有的相同资料</li>
        <li>违规上传将导致积分扣除或账号禁言</li>
      </ul>
      <div class="rules-link">
        <el-link type="primary" :underline="false">查看完整上传指南</el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Coin, Select, WarningFilled, WarnTriangleFilled } from '@element-plus/icons-vue'
</script>

<style scoped>
.sidebar-card {
  border-radius: 12px;
  border: none;
  margin-bottom: 20px;
}

.mr-2 {
  margin-right: 8px;
}

/* 积分卡片 */
.points-card {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: #ffffff;
}
.points-card .card-header {
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.points-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.points-list li {
  font-size: 13px;
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  line-height: 1.5;
  color: #eff6ff;
}
.points-list li .el-icon {
  margin-top: 2px;
  margin-right: 6px;
  font-size: 14px;
}
.points-list li:last-child {
  margin-bottom: 0;
}

/* 小贴士卡片 */
.tip-card .card-header {
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.text-yellow-500 {
  color: #fbbf24;
}
.text-gray-800 {
  color: #1e293b;
}

.tip-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.tip-item {
  display: flex;
  align-items: flex-start;
}
.tip-number {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  margin-right: 12px;
  margin-top: 2px;
}
.tip-item p {
  margin: 0;
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
}

/* 规则卡片 */
.rules-card .card-header {
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.text-red-500 {
  color: #ef4444;
}
.rules-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.rules-list li {
  position: relative;
  padding-left: 12px;
  font-size: 13px;
  color: #475569;
  margin-bottom: 10px;
  line-height: 1.5;
}
.rules-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #94a3b8;
}
.rules-link {
  margin-top: 16px;
  text-align: center;
}
.rules-link .el-link {
  font-size: 13px;
}
</style>
