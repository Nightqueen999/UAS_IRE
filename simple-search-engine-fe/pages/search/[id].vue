<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#app'
definePageMeta({
  layout: 'index-layout'
})
const route = useRoute()
const id = route.params.id
const blog = ref<any>(null)
const loading = ref(true)
const error = ref('')
const config = useRuntimeConfig()

onMounted(async () => {
  try {
    // Coba ambil dari blogs terlebih dahulu
    const res: any = await $fetch(`${config.public.apiBaseUrl}/api/v1/blogs/${id}`)
    if (res.data) {
      blog.value = res.data
    }
  } catch (e) {
    // Jika tidak ditemukan di blogs, cari di uploaded documents
    try {
      const uploadRes: any = await $fetch(`${config.public.apiBaseUrl}/api/v1/upload`)
      const uploadedDocs = uploadRes.data || []
      const found = uploadedDocs.find((doc: any) => doc.id == id)
      if (found) {
        blog.value = found
      } else {
        error.value = 'Dokumen tidak ditemukan'
      }
    } catch (e2) {
      error.value = 'Gagal mengambil dokumen'
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="max-w-4xl mx-auto px-6 py-12 text-center">
    <p class="text-gray-500">Memuat dokumen...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="max-w-4xl mx-auto px-6 py-12 text-center">
    <p class="text-red-500">{{ error }}</p>
    <nuxt-link to="/search" class="text-blue-500 hover:underline mt-4 inline-block">← Kembali ke Pencarian</nuxt-link>
  </div>

  <!-- Blog Content -->
  <div class="max-w-4xl mx-auto px-6 py-12" v-else-if="blog">
    <!-- Blog Title -->
    <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">{{ blog.title }}</h1>

    <!-- Blog Metadata -->
    <div class="text-sm text-gray-500 dark:text-gray-400 mb-6">
      <span>Written by <strong>{{ blog.author }}</strong></span> |
      <span>{{ blog.date }}</span>
      <span v-if="blog.source === 'uploaded'" class="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">📤 Uploaded</span>
    </div>

    <!-- Blog Content -->
    <div class="prose max-w-none">
      <p class="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed text-base">{{ blog.content }}</p>
    </div>

    <!-- Back Link -->
    <div class="mt-8">
      <nuxt-link to="/search" class="text-blue-500 hover:underline">← Kembali ke Pencarian</nuxt-link>
    </div>
  </div>
</template>



<style scoped>
/* Prose content styling */
.prose {
  line-height: 1.75;
}
</style>
