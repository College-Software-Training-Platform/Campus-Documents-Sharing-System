<template>
  <el-config-provider>
    <router-view></router-view>
    <!-- 临时切换按钮 -->
    <TempModeSwitch />
  </el-config-provider>
</template>

<script setup>
import TempModeSwitch from '@/components/common/TempModeSwitch.vue'
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>
