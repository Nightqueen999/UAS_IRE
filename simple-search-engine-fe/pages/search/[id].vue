<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#app'
definePageMeta({
  layout: 'index-layout'
})
const route = useRoute()
const id = route.params.id
const blog = ref()
const config = useRuntimeConfig()
onMounted(async () => {
  // Filter sampleResults based on query
  const res = await $fetch(`${config.public.apiBaseUrl}/api/v1/blogs/${id}`, {
  })
  blog.value = res.data
})
</script>

<template>

  <div class="max-w-4xl mx-auto px-6 py-12" v-if="blog">
    <!-- Blog Title -->
    <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">{{ blog.title }}</h1>

    <!-- Blog Metadata -->
    <div class="text-sm text-gray-500 dark:text-gray-400 mb-6">
      <span>Written by <strong>{{ blog.author }}</strong></span> |
      <span>{{ blog.date }}</span>
    </div>

    <!-- Blog Content -->
    <div class="prose dark:prose-dark">
      <p>{{ blog.content }}</p>
    </div>
  </div>
</template>



<style scoped>
/* Dark mode support for prose content */
.prose {
  color: #333;
}
.dark .prose-dark {
  color: #ccc;
}
</style>
