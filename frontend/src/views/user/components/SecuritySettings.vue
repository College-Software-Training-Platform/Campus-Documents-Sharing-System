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
import axios from 'axios'

// 接收父组件 Profile.vue 传来的 studentId
const props = defineProps({
  studentId: String
})

const showPasswordDialog = ref(false)
const submitting = ref(false)

const pwdForm = reactive({ 
  oldPwd: '', 
  newPwd: '',
  confirmPwd: '' // 建议增加一个确认密码，防止用户填错
})

const submitPasswordChange = async () => {
  // 1. 基本校验
  if (!pwdForm.oldPwd || !pwdForm.newPwd) {
    return ElMessage.warning('请填写完整信息')
  }
  if (pwdForm.newPwd.length < 6) {
    return ElMessage.warning('新密码长度不能少于 6 位')
  }

  submitting.value = true
  try {
    // 2. 调用后端接口
    // 注意：字段名要和 userController.js 里的解构一致
    const res = await axios.post('http://localhost:3000/api/users/password', {
      studentId: props.studentId,
      oldPassword: pwdForm.oldPwd,
      newPassword: pwdForm.newPwd
    })

    if (res.data.code === 200) {
      ElMessage.success('密码修改成功，请牢记新密码')
      showPasswordDialog.value = false
      // 3. 重置表单
      pwdForm.oldPwd = ''
      pwdForm.newPwd = ''
    } else {
      ElMessage.error(res.data.message || '修改失败')
    }
  } catch (error) {
    // 处理后端返回的 400 错误（比如原密码错误）
    if (error.response && error.response.data) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('网络错误，修改失败')
    }
  } finally {
    submitting.value = false
  }
}
</script>