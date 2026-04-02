<template>
  <div class="card fade">
    <div class="card-img"></div>
    <div class="card-body">
      <h4>{{ item.title }}</h4>
      <div class="price">
        <img src="@/assets/icon/credits.svg" class="icon" alt="credits" />
        {{ item.price }} 
      </div>
      <button class="btn">预览资料</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
/* 卡片的具体效果 */
.card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .05);
  transition: .3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, .1);
}

/* 卡片的图片 */
.card-img {
  height: 120px;
  background: #ddd;
}

/* 卡片的主体 */
.card-body {
  padding: 15px;
}
.card-body h4 {
  margin: 0;
}

/* 积分价格 */
.price {
  color: #409eff;
  margin-top: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon {
  width: 16px;
  height: 16px;
}

/* 预览按键 */
.btn {
  margin-top: 10px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: #409eff;
  color: #fff;
  cursor: pointer;
  transition: 0.3s;
}
.btn:hover {
  background: #66b1ff;
}

/* 应用动画 */
.fade {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
