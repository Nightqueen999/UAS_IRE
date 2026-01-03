<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from "~/components/navbar.vue";
import {textTruncate} from "../../utils/textTruncate";
import { useRuntimeConfig } from '#app'

definePageMeta({
  layout: 'index-layout'
})
const allResults = ref([])
const results = ref([])
const route = useRoute()
const query = ref(route.query.q || '')
const newQuery = ref()
const darkMode = ref(false)
const config = useRuntimeConfig()

onMounted(() => {
  performSearch()
})

const performSearch = async () => {
  if (query.value) {
    // Filter sampleResults based on query
     const res = await $fetch(`${config.public.apiBaseUrl}/api/v1/blogs`, {
       params : {
         search: query.value
       }
     })
    newQuery.value = query.value
    allResults.value = res.data
    results.value = allResults.value.filter(item => item.score > 0)
  } else {
    const res = await $fetch(`${config.public.apiBaseUrl}/api/v1/blogs`, {
    })
    allResults.value = res.data
    results.value = allResults.value
  }
}

</script>
<template>
  <div :class="darkMode ? 'dark' : ''" class="min-h-screen h-full">
    <div class=" p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen h-full">
      <div class="max-w-4xl mx-auto">
        <!-- Search bar di halaman hasil pencarian -->
        <form @submit.prevent="performSearch" class="mb-8">
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

        <!-- Toggle Dark Mode Button -->

        <!-- Menampilkan hasil pencarian -->
        <div v-if="results.length">
          <ul>
            <li
                v-for="(result, index) in results"
                :key="index"
                class="mb-6 border-b pb-4 border-gray-300 dark:border-gray-700"
            >
              <nuxt-link :to="`/search/${result.id}`" class="text-blue-600 dark:text-blue-400 text-lg hover:underline">
                {{ result.title }}
              </nuxt-link>
              <p class="text-gray-500 dark:text-gray-400">{{ result.author }}</p>
              <p class="text-gray-700 dark:text-gray-300">{{ textTruncate(result.content, 100) }}</p>
            </li>
          </ul>
        </div>
        <div v-else>
          <p class="text-gray-600 dark:text-gray-300">No results found </p>
        </div>
      </div>
    </div>
  </div>
</template>
