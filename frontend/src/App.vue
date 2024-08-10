<template>
  <div class="content-wrapper">
    <div class="content">
      <router-view v-slot="{ Component }">
        <transition>
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
    <Footer class="footer" />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Footer from './components/FooterComponent.vue'
</script>

<style scoped>
.content-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding-bottom: 50px;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  height: 50px;
}
</style>
