<template>
  <div class="user-home">
    <!-- 1、顶部导航 -->
    <UserHeader />

    <!-- 2、Banner 焦点区 -->
    <div class="banner">
      <div class="banner-content fade" :key="currentBannerIndex">
        <h1>{{ banners[currentBannerIndex].title }}</h1>
        <p>{{ banners[currentBannerIndex].desc }}</p>
        <button class="cta">立即探索</button>
      </div>
    </div>

    <!-- 3、资源 -->
    <div class="section">
      <div class="section-header">
        <h2>精选学术资源</h2>
        <a href="#">查看全部</a>
      </div>

      <div class="cards">
        <div class="card fade" v-for="(item, index) in dataList" :key="index">
          <div class="card-img"></div>
          <div class="card-body">
            <h4>{{ item.title }}</h4>
            <div class="price">{{ item.price }} 积分</div>
            <button class="btn">预览资料</button>
          </div>
        </div>
      </div>

      <div style="text-align:center; margin-top:20px">
        <button class="btn" @click="loadMore">加载更多</button>
      </div>
    </div>

    <!-- 4、footer 页脚 -->
    <div class="footer">
      关于我们 | 用户协议 | 联系我们<br />
      © 2026 智慧校园
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import UserHeader from '@/components/layout/UserHeader.vue'

const dataList = ref([
  { title: '数据结构精讲', price: 10 },
  { title: '深度学习综述', price: 25 },
  { title: '高等数学', price: 15 }
])

const banners = [
  { title: 'AI 驱动的学术资源生态', desc: '让知识流动更高效' },
  { title: '探索高质量学习资源', desc: '智能推荐 · 高效学习' },
  { title: '让学习更高效', desc: '智能推荐 · 高效学习' }
]
const currentBannerIndex = ref(0)
let bannerTimer = null

onMounted(() => {
  bannerTimer = setInterval(() => {
    currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.length
  }, 3000)
})

onUnmounted(() => {
  if (bannerTimer) {
    clearInterval(bannerTimer)
  }
})

const loadMore = () => {
  dataList.value.push(
    { title: '操作系统', price: 12 },
    { title: '计算机网络', price: 18 }
  )
}
</script>

<style scoped>
/* 页面主体风格 */
.user-home {
  background: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 20px;
}

/* 交互风格 */
a {
  text-decoration: none;
  color: #409eff;
}

/* Banner焦点区 */
.banner {
  margin: 20px auto;
  width: 90%;
  height: 260px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(120deg, #0f2027, #203a43, #2c5364);
  color: #fff;
}

/* 文案 */
.banner-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
}

.banner h1 {
  margin: 0 0 10px;
}

.cta {
  margin-top: 15px;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background: #409eff;
  color: #fff;
  cursor: pointer;
  transition: 0.3s;
}
.cta:hover {
  background: #66b1ff;
}

/* 资源区 */
.section {
  width: 90%;
  margin: 30px auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

/* 卡片布局 */
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

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

/* footer页脚 */
.footer {
  margin-top: 40px;
  padding: 20px;
  text-align: center;
  color: #888;
  font-size: 14px;
}

/* 应用动画 */
.fade {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
