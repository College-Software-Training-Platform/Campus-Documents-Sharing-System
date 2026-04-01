<template>
    <!-- 管理端-系统设置 -->
  <div class="system-settings">
    <h2>系统设置</h2>

    <!-- 表单 -->
    <el-form :model="form" label-width="120px" class="form">
      
      <!-- 系统名称 -->
      <el-form-item label="系统名称">
        <el-input v-model="form.systemName" />
      </el-form-item>

      <!-- 默认积分 -->
      <el-form-item label="新用户积分">
        <el-input-number v-model="form.defaultPoints" :min="0" />
      </el-form-item>

      <!-- 上传限制 -->
      <el-form-item label="最大上传大小(MB)">
        <el-input-number v-model="form.maxUploadSize" :min="1" />
      </el-form-item>

      <!-- 是否开启注册 -->
      <el-form-item label="允许注册">
        <el-switch v-model="form.allowRegister" />
      </el-form-item>

      <!-- 保存按钮 -->
      <el-form-item>
        <el-button type="primary" @click="handleSave">
          保存设置
        </el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 表单数据
const form = ref({
  systemName: '',
  defaultPoints: 10,
  maxUploadSize: 50,
  allowRegister: true
})

// 模拟获取系统配置（后面换接口）
const fetchSettings = () => {
  form.value = {
    systemName: '校园资料共享系统',
    defaultPoints: 10,
    maxUploadSize: 50,
    allowRegister: true
  }
}

// 保存设置
const handleSave = () => {
  console.log('保存配置:', form.value)

  // 这里后面换成 axios 请求
  ElMessage.success('保存成功！')
}

// 页面加载
onMounted(() => {
  fetchSettings()
})
</script>

<style scoped>
.system-settings {
  padding: 20px;
}

.form {
  max-width: 500px;
}
</style>