<template>
  <div class="dashboard-container">
    <header class="breadcrumb">
      <img src="@/assets/icon/home.svg" alt="首页" width="14" height="14" style="margin-right: 4px;">
      <span>首页</span>
    </header>

    <!-- 数据卡片 -->
    <section class="stat-cards">
      <div class="card stat-card blue">
        <div class="card-icon-wrapper">
          <img src="@/assets/icon/files.svg" alt="文件" width="24" height="24">
        </div>
        <div class="stat-info">
          <div class="stat-label">平台总资源数</div>
          <div class="stat-value">12,840 <span class="trend up">+12% &uparrow;</span></div>
        </div>
      </div>
      <div class="card stat-card green">
        <div class="card-icon-wrapper">
          <img src="@/assets/icon/add_circle.svg" alt="新增" width="24" height="24">
        </div>
        <div class="stat-info">
          <div class="stat-label">今日新增资源</div>
          <div class="stat-value">96 <span class="trend up">+8% &uparrow;</span></div>
        </div>
      </div>
      <div class="card stat-card orange">
        <div class="card-icon-wrapper">
          <img src="@/assets/icon/pending_actions.svg" alt="待审核" width="24" height="24">
        </div>
        <div class="stat-info">
          <div class="stat-label">待审核资源</div>
          <div class="stat-value">42 <span class="trend up">+7% &uparrow;</span></div>
        </div>
      </div>
      <div class="card stat-card purple">
        <div class="card-icon-wrapper">
          <img src="@/assets/icon/pending_actions_purple.svg" alt="反馈" width="24" height="24">
        </div>
        <div class="stat-info">
          <div class="stat-label">待处理反馈</div>
          <div class="stat-value">1,192 <span class="trend up">+15% &uparrow;</span></div>
        </div>
      </div>
    </section>

    <!-- 图表区域 -->
    <section class="chart-row">
      <div class="card chart-card large">
        <div class="card-header">
          <h3 class="card-title"><span class="blue-dash"></span> 资源上传趋势 (近7日)</h3>
          <div class="select-wrapper">
            <select>
              <option>最近7天</option>
            </select>
          </div>
        </div>
        <div class="chart-container">
          <canvas id="trendChart"></canvas>
        </div>
      </div>
      <div class="card chart-card small">
        <div class="card-header">
          <h3 class="card-title"><span class="blue-dash"></span> 资源领域分类占比</h3>
        </div>
        <div class="chart-container doughnut-wrap">
          <canvas id="categoryChart"></canvas>
          <div class="center-text">
            <div class="center-value">100%</div>
            <div class="center-label">总计占比</div>
          </div>
        </div>
        <div class="chart-legend">
          <div class="legend-item"><span class="dot blue"></span> 计算机科学</div>
          <div class="legend-item"><span class="dot green"></span> 教育学</div>
          <div class="legend-item"><span class="dot orange"></span> 经济学</div>
          <div class="legend-item"><span class="dot gray"></span> 其他</div>
        </div>
      </div>
    </section>

    <!-- 底部区域 -->
    <section class="bottom-row">
      <div class="card table-card">
        <div class="card-header">
          <h3 class="card-title"><span class="blue-dash"></span> 最新待审核资源</h3>
          <a href="#" class="view-all">查看全部</a>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>资源标题</th>
              <th>上传者</th>
              <th>提交时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="file-info">
                  <img src="@/assets/icon/pdf.svg" alt="pdf" width="20" height="20">
                  <span>2023 考研数学模拟题.pdf</span>
                </div>
              </td>
              <td>张三</td>
              <td class="time-cell">2023-11-05<br>14:20</td>
              <td class="actions">
                <button class="btn-text blue">预览</button>
                <button class="btn-text green">通过</button>
                <button class="btn-text red">驳回</button>
              </td>
            </tr>
            <tr>
              <td>
                <div class="file-info">
                  <img src="@/assets/icon/zip.svg" alt="zip" width="20" height="20">
                  <span>算法导论 课程设计代码.zip</span>
                </div>
              </td>
              <td>李四</td>
              <td class="time-cell">2023-11-05<br>13:45</td>
              <td class="actions">
                <button class="btn-text blue">预览</button>
                <button class="btn-text green">通过</button>
                <button class="btn-text red">驳回</button>
              </td>
            </tr>
            <tr>
              <td>
                <div class="file-info">
                  <img src="@/assets/icon/pdf.svg" alt="pdf" width="20" height="20">
                  <span>宏观经济学 考试重点总结.pdf</span>
                </div>
              </td>
              <td>王五</td>
              <td class="time-cell">2023-11-05<br>12:10</td>
              <td class="actions">
                <button class="btn-text blue">预览</button>
                <button class="btn-text green">通过</button>
                <button class="btn-text red">驳回</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card timeline-card">
        <div class="card-header">
          <h3 class="card-title">
            <img src="@/assets/icon/list.svg" alt="动态" width="18" height="18" style="margin-right: 8px;">
            平台动态
          </h3>
        </div>
        <div class="timeline-content">
          <div class="timeline-item">
            <div class="timeline-icon blue"></div>
            <div class="timeline-body">
              <p>管理员审核通过了 5 份新资料</p>
              <span class="time">10 分钟前</span>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-icon gray"></div>
            <div class="timeline-body">
              <p>系统自动清理了 200MB 缓存文件</p>
              <span class="time">45 分钟前</span>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-icon orange"></div>
            <div class="timeline-body">
              <p>更新了 “用户积分获取规则”</p>
              <span class="time">2 小时前</span>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-icon gray"></div>
            <div class="timeline-body">
              <p>新用户 “学术达人” 完成注册</p>
              <span class="time">昨天 18:30</span>
            </div>
          </div>
          <button class="btn-load-more">显示更早的动态</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Chart from 'chart.js/auto'

onMounted(() => {
  // 1. 资源上传趋势图 (折线图)
  const trendCtx = document.getElementById('trendChart').getContext('2d')
  const blueGradient = trendCtx.createLinearGradient(0, 0, 0, 400)
  blueGradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)')
  blueGradient.addColorStop(1, 'rgba(59, 130, 246, 0)')

  new Chart(trendCtx, {
    type: 'line',
    data: {
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      datasets: [{
        label: '上传数量',
        data: [120, 150, 110, 100, 140, 160, 110],
        borderColor: '#3b82f6',
        backgroundColor: blueGradient,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#3b82f6',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: '#9ca3af' }
        },
        y: {
          grid: { color: '#f3f4f6' },
          border: { display: false },
          ticks: { display: false }
        }
      }
    }
  })

  // 2. 资源领域分类占比圈图
  const categoryCtx = document.getElementById('categoryChart').getContext('2d')
  new Chart(categoryCtx, {
    type: 'doughnut',
    data: {
      labels: ['计算机科学', '教育学', '经济学', '其他'],
      datasets: [{
        data: [35, 25, 20, 20],
        backgroundColor: ['#3b82f6', '#22c55e', '#f97316', '#cbd5e1'],
        hoverOffset: 4,
        borderWidth: 0,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%', // 镂空比例
      plugins: {
        legend: { display: false }
      }
    }
  })
})
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  color: #64748b;
  font-size: 14px;
}

.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.05);
  padding: 20px;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  margin: 0;
}

.blue-dash {
  display: inline-block;
  width: 4px;
  height: 16px;
  background: #3b82f6;
  margin-right: 12px;
  border-radius: 2px;
}

/* 数据汇总卡片布局 */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(235px, 2fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blue .card-icon-wrapper {
  background: #eff6ff;
}

.green .card-icon-wrapper {
  background: #f0fdf4;
}

.orange .card-icon-wrapper {
  background: #fff7ed;
}

.purple .card-icon-wrapper {
  background: #faf5ff;
}

.stat-label {
  color: #64748b;
  font-size: 13px;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.trend {
  font-size: 12px;
  font-weight: 600;
}

.trend.up {
  color: #10b981;
}

/* 图表 row 布局 */
.chart-row {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 20px;
}

.chart-card {
  display: flex;
  flex-direction: column;
}

.chart-container {
  flex: 1;
  min-height: 260px;
  position: relative;
}

.doughnut-wrap {
  padding: 0;
}

.center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.center-value {
  font-size: 24px;
  font-weight: 700;
}

.center-label {
  font-size: 12px;
  color: #64748b;
}

.chart-legend {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f1f5f9;
}

.legend-item {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot.blue { background: #3b82f6; }
.dot.green { background: #22c55e; }
.dot.orange { background: #f97316; }
.dot.gray { background: #cbd5e1; }

.select-wrapper select {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  color: #64748b;
  outline: none;
  background: #fff;
}

/* 表格和动态 Row */
.bottom-row {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 20px;
}

.table-card {
  padding-bottom: 10px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.data-table th {
  text-align: left;
  padding: 12px 16px;
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
  border-bottom: 1px solid #f1f5f9;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #f8fafc;
  font-size: 14px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
}

.time-cell {
  font-size: 12px;
  color: #64748b;
}

.view-all {
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
}

.btn-text {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  margin-right: 12px;
  font-weight: 500;
}

.btn-text.blue { color: #3b82f6; }
.btn-text.green { color: #10b981; }
.btn-text.red { color: #ef4444; }

/* 动态时间轴 */
.timeline-content {
  padding: 10px 5px;
}

.timeline-item {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  position: relative;
}

.timeline-icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
  outline: 4px solid #fff;
  z-index: 1;
}

.timeline-icon.blue { background: #3b82f6; }
.timeline-icon.gray { background: #cbd5e1; }
.timeline-icon.orange { background: #f97316; }

.timeline-body p {
  font-size: 14px;
  margin-bottom: 4px;
  margin-top: 0;
}

.timeline-body .time {
  font-size: 12px;
  color: #64748b;
}

.btn-load-more {
  width: 100%;
  padding: 12px;
  background: #f8fafc;
  border: none;
  border-radius: 12px;
  color: #64748b;
  font-size: 13px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
