<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {darkMode} from "~/utils/globalVariable";
definePageMeta({
  layout: 'index-layout'
})
const query = ref('')
const router = useRouter()
const performSearch = () => {
  if (query.value) {
    // Navigate to search results page with the query
    router.push({ path: '/search', query: { q: query.value } })
  }
}
onBeforeMount(() => {
  if (darkMode.value == null) {
    localStorage.setItem('darkMode', false)
  }
})
</script>
<template>
  <div :class="darkMode.value === true ? 'dark' : ''" class="min-h-screen h-full">
    <div class="flex flex-col items-center justify-center min-h-screen h-full bg-white dark:bg-gray-900">
      <!-- Google logo -->
      <div class="mb-8">
        <h1 class="text-5xl font-bold text-gray-800 dark:text-gray-200">Abang Messi</h1>
      </div>

      <!-- Search Bar -->
      <div class="w-full max-w-xl">
        <form @submit.prevent="performSearch">
          <div class="flex items-center border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2">
            <input
                v-model="query"
                type="text"
                class="w-full focus:outline-none text-lg text-gray-900 dark:text-gray-100 bg-transparent"
                placeholder="Search Messi Browser"
            />
            <button type="submit" class="ml-2">
              <svg
                  class="w-6 h-6 text-gray-500 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </button>
          </div>
        </form>
      </div>

      <!-- Toggle Dark Mode Button with Icon -->


      <!-- Footer -->
      <div class="absolute bottom-0 w-full py-4 text-center border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-600 dark:text-gray-300">© 2024 Google Clone</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional custom styles */
</style>
