<template>
  <div class="login-container">
    <div class="login-card">
      <div class="header-section">
        <div class="header-icon">
          <img src="@/assets/icon/auto_stories.svg" alt="logo" style="width: 36px; height: 36px; vertical-align: middle;" />
        </div>
        <div class="art-title">加入智慧校园</div>
        <div class="subtitle">创建您的学术账号，开启共享之旅</div>
      </div>

      <div class="form-wrapper">
        <div class="input-group">
          <label>账号</label>
          <el-input
            v-model="form.account"
            placeholder="请设置您的登录账号 (学号/用户名)"
            class="custom-input"
          >
            <template #prefix>
              <img src="@/assets/icon/person.svg" class="prefix-icon" alt="user" />
            </template>
          </el-input>
        </div>

        <div class="input-group">
          <label>姓名</label>
          <el-input
            v-model="form.name"
            placeholder="请输入您的真实姓名"
            class="custom-input"
          >
            <template #prefix>
              <img src="@/assets/icon/person.svg" class="prefix-icon" alt="user" />
            </template>
          </el-input>
        </div>

        <div class="input-group">
          <label>密码</label>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请设置登录密码"
            show-password
            class="custom-input custom-pwd"
          >
            <template #prefix>
              <img src="@/assets/icon/lock.svg" class="prefix-icon" alt="lock" />
            </template>
          </el-input>
        </div>

        <div class="input-group">
          <label>确认密码</label>
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次确认密码"
            show-password
            class="custom-input custom-pwd"
          >
            <template #prefix>
              <img src="@/assets/icon/lock.svg" class="prefix-icon" alt="lock" />
            </template>
          </el-input>
        </div>

        <el-button type="primary" class="login-btn" @click="handleRegister" :loading="loading">
          立即注册 <img src="@/assets/icon/login.svg" alt="reg" style="width: 18px; margin-left: 5px; transform: rotate(-90deg);" />
        </el-button>
      </div>

      <div class="divider">或者</div>

      <div class="footer-reg">
        已有账号？ <router-link to="/auth/login">返回登录</router-link>
      </div>
    </div>

    <div class="copyright">
      &copy; 2026 智慧校园资料共享平台. 保留所有权利。<br />
      您的学术成长伴侣。
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const router = useRouter()
const loading = ref(false)

const form = reactive({
  account: '',
  name: '',
  password: '',
  confirmPassword: '',
  major: '' // 可选
})

const handleRegister = async () => {
  // 1. 表单校验
  if (!form.account || !form.name || !form.password || !form.confirmPassword) {
    ElMessage.warning('请填写所有必填字段')
    return
  }

  if (form.password !== form.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }

  if (form.password.length < 6) {
    ElMessage.warning('密码长度至少为 6 位')
    return
  }

  loading.value = true
  try {
    const res = await request.post('/users/register', {
      account: form.account,
      password: form.password,
      name: form.name,
      major: form.major
    })

    if (res.code === 201) {
      ElMessage.success('注册成功，正在跳转登录...')
      setTimeout(() => {
        router.push('/auth/login')
      }, 1500)
    }
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  padding: 20px 0;
}

.login-card {
  background: rgba(255, 255, 255, 1);
  padding: 30px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 440px;
  box-sizing: border-box;
}

.header-section {
  margin-bottom: 24px;
  text-align: center;
}
.header-icon {
  margin-bottom: 12px;
}
.art-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}
.subtitle {
  color: #909399;
  font-size: 13px;
  margin: 0;
}

.input-group {
  margin-bottom: 16px;
  text-align: left;
}
.input-group label {
  display: block;
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: bold;
}

.custom-input :deep(.el-input__wrapper) {
  padding: 12px;
  padding-left: 35px;
  border-radius: 8px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  background-color: #F8FAFC;
  transition: all 0.3s;
}
.custom-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #42A1FF inset, 0 0 5px rgba(66, 161, 255, 0.2);
}
.custom-input :deep(.el-input__inner) {
  font-size: 13px;
  height: 16px; 
}

.custom-pwd :deep(.el-input__wrapper) {
  padding-right: 35px;
}

.prefix-icon {
  position: absolute;
  left: -20px;
  width: 18px;
  height: 18px;
  pointer-events: none;
}

.login-btn {
  width: 100%;
  padding: 12px;
  height: 48px;
  background-color: #42A1FF;
  border-color: #42A1FF;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: 0.3s;
  margin-top: 10px;
}
.login-btn:hover {
  background-color: #4E99F0;
  border-color: #4E99F0;
}

.divider {
  margin: 16px 0;
  display: flex;
  align-items: center;
  color: #94A3B8;
  font-size: 11px;
}
.divider::after,
.divider::before {
  content: "";
  flex: 1;
  height: 1px;
  background: #E2E8F0;
  margin: 0 8px;
}

.footer-reg {
  font-size: 12px;
  color: #666;
  text-align: center;
}
.footer-reg a {
  color: #42A1FF;
  text-decoration: none;
  transition: all 0.3s;
}
.footer-reg a:hover {
  color: #66b1ff;
}

.copyright {
  margin-top: 30px;
  text-align: center;
  color: #909399;
  font-size: 12px;
  line-height: 1.8;
}
</style>
