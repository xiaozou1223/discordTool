<template>
    <div class="d-flex flex-column min-vh-100">
      <RouterView class="flex-fill" />
      <Footer />
    </div>
  </template>
  
  <script setup lang="ts">
  import { RouterView } from 'vue-router';
  import Footer from './components/FooterComponent.vue';
  </script>
  
  <style scoped>
    .d-flex {
      display: flex;
    }
  
    .flex-column {
      flex-direction: column;
    }
  
    .min-vh-100 {
      min-height: 100vh;
    }
  
    .flex-fill {
      flex: 1 0 auto;
    }
  
    .mt-auto {
      margin-top: auto;
    }
  </style>
  