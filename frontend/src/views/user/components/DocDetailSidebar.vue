<template>
  <div class="sidebar-container">
    <el-card class="sidebar-card download-card" shadow="never">
      <div class="doc-file-info">
        <img src="@/assets/icon/pdf.svg" alt="pdf" class="file-icon" />
        <div class="file-details">
          <h4>{{ resource?.title || '资源加载中...' }}</h4>
          <span>
            {{ resource?.file_Size ? (resource.file_Size / 1024 / 1024).toFixed(1) + ' MB' : '--' }} 
            · {{ resource?.format?.toUpperCase() || 'PDF' }}
          </span>
        </div>
      </div>
      
      <div class="points-info">
        <span class="label">下载所需积分</span>
        <span class="value">
          <el-icon><Coin /></el-icon> 
          {{ resource?.required_Points || 0 }}
        </span>
      </div>
      <div class="points-desc">下载后永久免费，支持全平台阅读</div>
      
      <el-button 
        type="primary" 
        size="large" 
        class="download-btn"
        :loading="downloadLoading"
        @click="handleDownload"
      >
        <el-icon><Download /></el-icon> 立即下载
      </el-button>
    </el-card>

    <el-card class="sidebar-card author-card" shadow="never">
      <div class="author-header">
        <el-avatar :size="50" :src="resource?.uploader?.avatar_Url || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" />
        <div class="author-details">
          <h4>{{ resource?.uploader?.name || '未知用户' }}</h4>
          <span>{{ resource?.course?.college || '校友' }}</span>
        </div>
        <el-button class="follow-btn" type="primary" plain size="small">关注</el-button>
      </div>
      <div class="author-stats">
        <div class="stat-item">
          <span class="count">--</span>
          <span class="label">上传资源</span>
        </div>
        <div class="stat-item">
          <span class="count">--</span>
          <span class="label">粉丝</span>
        </div>
        <div class="stat-item">
          <span class="count">--</span>
          <span class="label">获赞</span>
        </div>
      </div>
    </el-card>

    <el-card class="sidebar-card recommend-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>相关资源推荐</span>
        </div>
      </template>
      <div class="recommend-list">
        <div class="recommend-item" v-for="i in 3" :key="i">
          <div class="rect-cover"></div>
          <div class="recommend-info">
            <h5 class="text-ellipsis">推荐资源正在加载...</h5>
            <div class="recommend-meta">
              <span><el-icon><Download /></el-icon> --</span>
              <span class="recommend-points"><el-icon><Coin /></el-icon> --</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Coin, Download } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useResourceStore } from '@/store/resource'
import request from '@/utils/request'
import { ElMessageBox, ElMessage } from 'element-plus'

const props = defineProps({
  resourceId: {
    type: [String, Number],
    required: true
  }
})

const resourceStore = useResourceStore()
const resource = computed(() => resourceStore.currentResource)
const downloadLoading = ref(false)

/**
 * ✅ 核心逻辑：积分下载
 * 100% 对齐 MyUploads.vue 的成功调用链路
 */
const handleDownload = async () => {
  try {
    const points = resource.value?.required_Points || 0
    await ElMessageBox.confirm(
      `下载该资源将扣除 ${points} 积分，是否确认？`,
      '下载确认',
      { confirmButtonText: '确认下载', cancelButtonText: '取消', type: 'warning' }
    )

    downloadLoading.value = true

    // 1. 发起请求
    const res = await request({
      url: '/users/download-action', // 对应 app.js 中的 app.use('/api/users', ...)
      method: 'post',
      data: { resourceId: Number(props.resourceId) },
      responseType: 'blob' 
    })

    // 2. 兼容性处理：获取真正的二进制数据
    // 这里的 res 可能是完整的 response，也可能是拦截器处理后的 data
    const blobData = res.data || res; 

    // 3. 检查是否是报错 JSON (例如积分不足)
    // 如果返回的是文件，type 通常是 application/pdf 或 application/octet-stream
    if (blobData.type === 'application/json') {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const result = JSON.parse(reader.result)
          ElMessage.error(result.message || '积分不足')
        } catch (e) {
          ElMessage.error('下载失败，请检查积分')
        }
      }
      reader.readAsText(blobData)
      return
    }

    // 4. 执行下载
    const blob = new Blob([blobData])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // 设置文件名
    const fileName = `${resource.value?.title || 'resource'}.${resource.value?.format || 'pdf'}`
    link.setAttribute('download', fileName)
    
    document.body.appendChild(link)
    link.click()
    
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success('积分扣除成功，开始下载')

  } catch (err) {
    console.error('下载环节捕获错误:', err)
    // 如果 Network 是 200 但进了这里，说明是上面的 Blob 处理逻辑写错了
    // 如果 Network 是 404/500，则是真正的服务器问题
    ElMessage.error('处理下载文件时出错，请查看控制台')
  } finally {
    downloadLoading.value = false
  }
}
</script>

<style scoped>
/* 样式保持原样，确保 UI 布局完美 */
.sidebar-container { width: 100%; }
.sidebar-card { border-radius: 12px; border: none; margin-bottom: 20px; }
.download-card { background-color: #ffffff; }
.doc-file-info { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.file-icon { width: 48px; height: 48px; }
.file-details h4 { margin: 0 0 4px 0; color: #0f172a; font-size: 15px; }
.file-details span { font-size: 12px; color: #64748b; }
.points-info { background-color: #f8fafc; border-radius: 8px; padding: 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.points-info .label { color: #64748b; font-size: 14px; }
.points-info .value { color: #3b82f6; font-size: 18px; font-weight: bold; display: flex; align-items: center; gap: 4px; }
.points-desc { font-size: 12px; color: #94a3b8; margin-bottom: 20px; }
.download-btn { width: 100%; border-radius: 8px; }
.author-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.author-details { flex: 1; }
.author-details h4 { margin: 0 0 4px 0; color: #0f172a; font-size: 15px; }
.author-details span { font-size: 12px; color: #64748b; }
.follow-btn { border-radius: 16px; }
.author-stats { display: flex; justify-content: space-between; text-align: center; }
.stat-item { display: flex; flex-direction: column; }
.stat-item .count { font-weight: 600; color: #0f172a; font-size: 16px; }
.stat-item .label { font-size: 12px; color: #64748b; margin-top: 4px; }
.card-header span { font-weight: 600; color: #0f172a; }
.recommend-item { display: flex; gap: 12px; margin-bottom: 16px; }
.rect-cover { width: 60px; height: 80px; background-color: #cbd5e1; border-radius: 4px; }
.recommend-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 4px 0; }
.text-ellipsis { margin: 0; font-size: 13px; color: #334155; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.recommend-meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #94a3b8; }
.recommend-points { color: #3b82f6; display: flex; align-items: center; gap: 2px; }
</style>