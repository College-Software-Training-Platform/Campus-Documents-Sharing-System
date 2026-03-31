<template>
  <aside class="sidebar">
    <div class="logo-section">
      <img src="@/assets/icon/auto_stories.svg" alt="Logo" class="logo-icon" width="24" height="24">
      <span class="logo-text">智慧校园资料共享</span>
    </div>

    <nav class="nav-menu">
      <div class="nav-item active">
        <img src="@/assets/icon/dashboard_active.svg" alt="首页" width="18" height="18">
        <span>首页</span>
      </div>
      <div class="nav-item">
        <img src="@/assets/icon/list.svg" alt="资源审核" width="18" height="18">
        <span>资源审核</span>
      </div>
      <div class="nav-item">
        <img src="@/assets/icon/user.svg" alt="用户管理" width="18" height="18">
        <span>用户管理</span>
      </div>
      <div class="nav-item">
        <img src="@/assets/icon/settings.svg" alt="系统设置" width="18" height="18">
        <span>系统设置</span>
      </div>
    </nav>

    <div class="user-profile">
      <img src="@/assets/image/endmin.jpg" alt="Avatar" class="avatar">
      <div class="user-info">
        <div class="user-name">管理员</div>
      </div>
      <img src="@/assets/icon/keyboard_arrow_down.svg" alt="箭头" width="16" height="16">
    </div>
  </aside>
</template>

<script setup>
</script>

<style scoped>
/* 侧边栏样式 */
.sidebar {
  background: #fff;
  border-right: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  padding: 24px 0 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.logo-section {
  padding: 0 24px 32px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  color: #3b82f6;
}

.logo-text {
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.025em;
}

.nav-menu {
  flex: 1;
  padding: 0 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 4px;
}

.nav-item:hover {
  background: #f8fafc;
  color: #1e293b;
}

.nav-item.active {
  background: #eff6ff;
  color: #3b82f6;
  font-weight: 600;
}

.user-profile {
  margin-top: auto;
  border-top: 1px solid #f1f5f9;
  padding: 15px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #64748b;
  cursor: pointer;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e2e8f0;
}

.user-name {
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
}
</style>
