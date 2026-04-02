<template>
  <div>
    <!-- 标签与标题 -->
    <div class="header-section">
      <div class="tags">
        <el-tag type="primary" effect="light" class="custom-tag">计算机科学</el-tag>
        <el-tag type="danger" effect="light" class="custom-tag">热门资源</el-tag>
      </div>
      <h1 class="doc-title">2024年机器学习期末复习全攻略</h1>
      <div class="meta-info">
        <span class="meta-item"><el-icon><Calendar /></el-icon> 发布于 2023-12-01</span>
        <span class="meta-item"><el-icon><View /></el-icon> 1,240 次浏览</span>
        <span class="meta-item rating"><el-icon color="#f59e0b"><StarFilled /></el-icon> 4.8 <span class="rating-count">(128个评分)</span></span>
      </div>
    </div>

    <!-- 封面图预览 -->
    <div class="cover-preview">
      <div class="cover-placeholder">
        <h2>Machine Learning</h2>
        <h2>Study Guide</h2>
        <el-button round class="preview-btn"><el-icon><FullScreen /></el-icon> 预览全部页面 (45页)</el-button>
      </div>
    </div>

    <!-- AI 摘要 -->
    <div class="ai-summary">
      <div class="ai-title">
        <el-icon><MagicStick /></el-icon> AI 摘要
      </div>
      <p class="ai-text">
        本文档深度覆盖了机器学习核心概念，包括监督学习（回归、分类）、无监督学习（聚类、降维），以及深度学习基础。特别收录了期末考试中常考的算法推导公式与历年名校考题解析，适合在期末前两周进行系统性冲刺备考，帮助你快速掌握考试重难点。
      </p>
    </div>

    <!-- 资源详情描述 -->
    <div class="detail-description">
      <h3 class="section-title"><span class="title-indicator"></span> 资源详情描述</h3>
      <div class="desc-content">
        <p>本资源由某985高校计科专业学霸整理，整理时间为2023年秋季学期。主要包含以下版块：</p>
        <ul>
          <li>重点公式推导： 支持向量机(SVM)、反向传播(BP)、逻辑回归梯度下降。</li>
          <li>算法对比分析： KNN vs K-means, 随机森林 vs GBDT 的核心差异。</li>
          <li>核心代码实现： 使用 Python/NumPy 实现基础神经网络的代码片段。</li>
          <li>模拟卷： 附赠三套模拟试题及详细答案参考。</li>
        </ul>
      </div>
      <div class="hash-tags">
        <el-tag size="small" type="info" class="hash-tag">#机器学习</el-tag>
        <el-tag size="small" type="info" class="hash-tag">#期末复习</el-tag>
        <el-tag size="small" type="info" class="hash-tag">#CS</el-tag>
        <el-tag size="small" type="info" class="hash-tag">#算法</el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  Calendar, View, StarFilled, FullScreen, MagicStick
} from '@element-plus/icons-vue'
</script>

<style scoped>
/* Header */
.header-section {
  margin-bottom: 24px;
}

.tags {
  margin-bottom: 12px;
}

.custom-tag {
  border-radius: 4px;
  margin-right: 8px;
  font-weight: 500;
}

.doc-title {
  font-size: 28px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 16px 0;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 20px;
  color: #64748b;
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rating {
  color: #0f172a;
  font-weight: 600;
}

.rating-count {
  font-weight: normal;
  color: #94a3b8;
}

/* Cover Preview */
.cover-preview {
  background-color: #f1f5f9;
  border-radius: 8px;
  padding: 40px;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.cover-placeholder {
  width: 100%;
  max-width: 500px;
  background: linear-gradient(135deg, #7dd3fc, #38bdf8);
  aspect-ratio: 3/4;
  border-radius: 4px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  color: white;
  border: 10px solid white;
}

.cover-placeholder h2 {
  margin: 5px 0;
  font-size: 24px;
}

.preview-btn {
  position: absolute;
  bottom: 30px;
  background: rgba(255, 255, 255, 0.9);
  color: #334155;
  border: none;
}

/* AI Summary */
.ai-summary {
  background: linear-gradient(to right, #f0f9ff, #e0f2fe);
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.ai-title {
  color: #0ea5e9;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.ai-text {
  color: #334155;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

/* Description */
.section-title {
  font-size: 18px;
  color: #0f172a;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.title-indicator {
  width: 4px;
  height: 18px;
  background-color: #3b82f6;
  border-radius: 2px;
  margin-right: 8px;
}

.desc-content {
  color: #475569;
  font-size: 15px;
  line-height: 1.8;
}

.desc-content ul {
  padding-left: 20px;
  margin-top: 10px;
}

.desc-content li {
  margin-bottom: 8px;
}

.hash-tags {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.hash-tag {
  background-color: #f1f5f9;
  border-color: #e2e8f0;
  color: #64748b;
  border-radius: 4px;
}
</style>
