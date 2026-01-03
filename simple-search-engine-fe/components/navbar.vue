<script setup lang="ts">
import { ref, onMounted } from 'vue'

const darkMode = ref(false)

onMounted(() => {
  // Cek localStorage untuk dark mode
  if (localStorage.getItem('darkMode') === 'true') {
    darkMode.value = true
    document.documentElement.classList.add('dark')
  }
})

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  localStorage.setItem('darkMode', darkMode.value)

  // Update class di HTML tag
  if (darkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>
<template>
  <nav class="h-20 flex px-10 justify-between items-center bg-white dark:bg-gray-900">
    <!-- Logo -->
    <nuxt-link to="/" class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Messi Browser</nuxt-link>

    <!-- Dark Mode Toggle Button -->
    <div>
      <button
          @click="toggleDarkMode"
          class="flex items-center justify-center w-12 h-12 rounded-full focus:outline-none bg-gray-200 dark:bg-gray-700"
      >
        <span v-if="darkMode">
          <!-- Moon Icon for Dark Mode -->
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="stroke-white" d="M19.0487 11.5346C18.8914 13.2368 18.2526 14.859 17.207 16.2114C16.1614 17.5638 14.7522 18.5904 13.1444 19.1712C11.5366 19.7519 9.79671 19.8628 8.12823 19.4907C6.45975 19.1187 4.93172 18.2792 3.72295 17.0704C2.51419 15.8616 1.67467 14.3336 1.30264 12.6651C0.930605 10.9966 1.04145 9.25671 1.62219 7.64893C2.20293 6.04114 3.22956 4.63199 4.58194 3.58638C5.93432 2.54077 7.55653 1.90193 9.25873 1.74463C8.26214 3.0929 7.78258 4.75408 7.90726 6.42604C8.03194 8.09801 8.75259 9.66969 9.93813 10.8552C11.1237 12.0408 12.6954 12.7614 14.3673 12.8861C16.0393 13.0108 17.7005 12.5312 19.0487 11.5346Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span v-else>
          <!-- Sun Icon for Light Mode -->
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_5830_246)">
              <path d="M12.8291 17.4111C15.5905 17.4111 17.8291 15.1726 17.8291 12.4111C17.8291 9.64971 15.5905 7.41113 12.8291 7.41113C10.0677 7.41113 7.8291 9.64971 7.8291 12.4111C7.8291 15.1726 10.0677 17.4111 12.8291 17.4111Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12.8291 1.41113V3.41113" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12.8291 21.4111V23.4111" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5.04932 4.6311L6.46932 6.0511" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19.189 18.7712L20.609 20.1912" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1.8291 12.4111H3.8291" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21.8291 12.4111H23.8291" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5.04932 20.1912L6.46932 18.7712" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19.189 6.0511L20.609 4.6311" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_5830_246">
                <rect width="24" height="24" fill="white" transform="translate(0.829102 0.411133)"/>
              </clipPath>
            </defs>
          </svg>

        </span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
/* Optional custom styles */
</style>
