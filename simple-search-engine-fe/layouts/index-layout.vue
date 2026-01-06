<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

onMounted(() => {
  // Cek dark mode dari localStorage
  isDark.value = localStorage.getItem('darkMode') === 'true'
  
  // Watch for storage changes (jika user toggle di halaman lain)
  window.addEventListener('storage', (e) => {
    if (e.key === 'darkMode') {
      isDark.value = e.newValue === 'true'
    }
  })
  
  // Custom event untuk update dark mode dalam halaman yang sama
  window.addEventListener('darkModeChanged', () => {
    isDark.value = localStorage.getItem('darkMode') === 'true'
  })
})
</script>

<template>
  <div :class="isDark ? 'dark' : ''" class="min-h-screen h-full">
    <navbar />
    <div class="min-h-screen h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

</style>
