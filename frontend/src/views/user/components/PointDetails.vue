<template>
  <div class="points-history">
    <el-alert title="小提示：上传优质资源被下载可获得更多积分哦！" type="info" show-icon :closable="false" />
    
    <el-timeline style="margin-top: 30px; padding-left: 10px">
      <el-timeline-item
        v-for="(log, index) in pointLogs"
        :key="index"
        :type="log.amount > 0 ? 'success' : 'danger'"
        :timestamp="log.time"
        placement="top"
      >
        <el-card>
          <h4>{{ log.reason }}</h4>
          <p :style="{ color: log.amount > 0 ? '#67C23A' : '#F56C6C', fontWeight: 'bold' }">
            {{ log.amount > 0 ? '+' : '' }}{{ log.amount }} 积分
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const pointLogs = ref([
  { time: '2026-03-28 14:20', reason: '下载《数据库系统概念》', amount: -5 },
  { time: '2026-03-27 09:00', reason: '每日签到奖励', amount: 2 },
  { time: '2026-03-26 18:30', reason: '上传的《算法导论笔记》被下载', amount: 10 }
])
</script>