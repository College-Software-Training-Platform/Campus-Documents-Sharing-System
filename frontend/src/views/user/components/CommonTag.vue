<template>
  <span class="common-tag" :class="{ 'is-closable': closable }">
    {{ text }}
    <span v-if="closable" class="close-btn" @click.stop="$emit('close')">
      <el-icon><Close /></el-icon>
    </span>
  </span>
</template>

<script setup>
import { Close } from '@element-plus/icons-vue'

defineProps({
  text: {
    type: String,
    required: true
  },
  closable: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])
</script>

<style scoped>
.common-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background-color: #f9f9f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #475569;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.common-tag:hover {
  background-color: #f1f2f2;
  color: #0f172a;
  border-color: #e5e5e6;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  transition: all 0.2s;
  font-size: 10px;
}

.close-btn:hover {
  background-color: #c0c0c0;
  color: #fff;
}
</style>
