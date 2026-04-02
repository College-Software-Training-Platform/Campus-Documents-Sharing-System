<template>
  <div class="login-container">
    <div class="login-card">
      <div class="header-section">
        <div class="header-icon">
          <img src="@/assets/icon/auto_stories.svg" alt="logo" style="width: 36px; height: 36px; vertical-align: middle;" />
        </div>
        <div class="art-title">智慧校园资料共享</div>
        <div class="subtitle">欢迎登录您的智能学术社区</div>
      </div>

      <div class="form-wrapper">
        <div class="input-group">
          <label>用户名 / 邮箱</label>
          <el-input
            v-model="username"
            placeholder="请输入您的用户名或邮箱"
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
            v-model="password"
            type="password"
            placeholder="请输入密码"
            show-password
            class="custom-input custom-pwd"
          >
            <template #prefix>
              <img src="@/assets/icon/lock.svg" class="prefix-icon" alt="lock" />
            </template>
          </el-input>
        </div>

        <div class="action-row">
          <el-checkbox v-model="rememberMe" class="remember-wrap">记住我</el-checkbox>
          <a href="#" class="forgot-link">忘记密码？</a>
        </div>

        <el-button type="primary" class="login-btn" @click="handleLogin">
          立即登录 <img src="@/assets/icon/login.svg" alt="login" style="width: 18px; margin-left: 5px;" />
        </el-button>
      </div>

      <div class="divider">或者</div>

      <div class="footer-reg">
        还没有账号？ <router-link to="/auth/register">立即注册</router-link>
      </div>
    </div>

    <div class="copyright">
      &copy; 2026 智慧校园资料共享平台. 保留所有权利。<br />
      致力于构建更高效、更开放、更智能的校园学术资源流通体系。
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const router = useRouter()
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  loading.value = true
  try {
    const res = await request.post('/users/login', {
      account: username.value,
      password: password.value
    })

    if (res.code === 200) {
      ElMessage.success('登录成功')
      
      // 存储 Token 和用户信息
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      
      // 如果勾选了“记住我”，可以做一些长效处理 (目前暂时只存 localStorage)
      
      // 跳转到首页
      router.push('/')
    }
  } catch (error) {
    console.error('登录失败:', error)
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
}

.login-card {
  background: rgba(255, 255, 255, 1);
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 400px;
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
  margin-bottom: 20px;
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
  padding: 15px;
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
.custom-input :deep(.el-input__inner::placeholder) {
  color: #94A3B8;
}

/* 密码框特别处理以匹配原来的间距 */
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

.action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0 24px 0;
  font-size: 14px;
}
.remember-wrap {
  color: #333;
  font-weight: normal;
}
.forgot-link {
  color: #42A1FF;
  text-decoration: none;
  transition: 0.3s;
}
.forgot-link:hover {
  color: #66b1ff;
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
}
.login-btn:hover {
  background-color: #4E99F0;
  border-color: #4E99F0;
}

.divider {
  margin: 12px 0;
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
