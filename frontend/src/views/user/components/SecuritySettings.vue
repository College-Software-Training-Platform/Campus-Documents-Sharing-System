<template>
  <div class="security-settings">
    <div class="setting-item">
      <div class="setting-info">
        <h4 class="setting-title">登录密码</h4>
        <p class="setting-desc">建议定期更换密码，以保障账号安全</p>
      </div>
      <el-button type="primary" plain @click="showPasswordDialog = true">修改密码</el-button>
    </div>

    <el-divider />

    <div class="setting-item">
      <div class="setting-info">
        <h4 class="setting-title">学号认证</h4>
        <p class="setting-desc">当前已绑定学号：{{ studentId }}</p>
      </div>
      <el-tag type="success">已认证</el-tag>
    </div>

    <el-dialog v-model="showPasswordDialog" title="修改登录密码" width="420px" append-to-body>
      <el-form :model="pwdForm" label-width="80px" label-position="top">
        <el-form-item label="当前密码">
          <el-input v-model="pwdForm.oldPwd" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="pwdForm.newPwd" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="submitPasswordChange">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 通过 defineProps 接收父组件传来的学号
defineProps({
  studentId: String
})

const showPasswordDialog = ref(false)
const pwdForm = reactive({ oldPwd: '', newPwd: '' })

const submitPasswordChange = () => {
  // 这里写修改密码的逻辑...
  ElMessage.success('密码修改成功')
  showPasswordDialog.value = false
}
</script>

<style scoped>
.setting-item { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; }
.setting-title { margin: 0 0 6px 0; font-size: 16px; font-weight: 600; }
.setting-desc { margin: 0; font-size: 13px; color: #94a3b8; }
</style>