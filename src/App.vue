<!-- src/App.vue -->
<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- Aktif rotayı (/) yani HomePage.vue'yi burada render eder -->
  <RouterView />
</template>

<style>
/* İsteğe bağlı: temel sıfırlama */
html,
body,
#app {
  height: 100%;
  margin: 0;
}
</style>
