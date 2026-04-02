<template>
  <div class="resource-tab-content" style="padding: 40px 0; text-align: center;">
    <el-empty 
      image="https://element-plus.org/images/element-plus-logo.svg" 
      description="收藏夹功能正在拼命开发中..."
    >
      <el-button type="primary" plain @click="$router.push('/')">去首页看看资料</el-button>
    </el-empty>
  </div>
</template>

<script setup>
// 预留 props，方便以后对接接口
defineProps({ userId: Number })
</script>