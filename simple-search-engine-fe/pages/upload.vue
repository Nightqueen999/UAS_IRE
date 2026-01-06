<script setup lang="ts">
/**
 * =====================================================
 * FILE: upload.vue
 * =====================================================
 * Halaman untuk upload file TXT sebagai dokumen pencarian.
 * 
 * FORMAT FILE TXT:
 * - Baris 1: Title (judul dokumen)
 * - Baris 2: Author (penulis)
 * - Baris 3+: Content (isi dokumen)
 * =====================================================
 */
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'

definePageMeta({
  layout: 'index-layout'
})

const config = useRuntimeConfig()
const files = ref<File[]>([])
const parsedDocuments = ref<any[]>([])
const uploadedDocuments = ref<any[]>([])
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isUploading = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error' | 'info'>('info')
const selectedDocument = ref<any>(null) // Untuk menampilkan detail dokumen yang diklik

// Fetch existing uploaded documents on mount
onMounted(async () => {
  await fetchUploadedDocuments()
})

// Fetch uploaded documents from server
const fetchUploadedDocuments = async () => {
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/api/v1/upload`)
    uploadedDocuments.value = res.data || []
  } catch (e) {
    console.error('Error fetching uploaded documents:', e)
  }
}

// Handle file selection
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    files.value = Array.from(target.files).filter(f => f.name.endsWith('.txt'))
    parseFiles()
  }
}

// Handle drag and drop
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files) {
    files.value = Array.from(event.dataTransfer.files).filter(f => f.name.endsWith('.txt'))
    parseFiles()
  }
}

// Parse TXT files - mendukung multi-paragraf
const parseFiles = async () => {
  parsedDocuments.value = []
  
  for (const file of files.value) {
    const text = await file.text()
    // Split berdasarkan newline, tapi pertahankan struktur paragraf
    const lines = text.split('\n')
    
    // Baris 1: Title, Baris 2: Author, Baris 3+: Content
    const title = lines[0]?.trim() || 'Untitled'
    const author = lines[1]?.trim() || 'Unknown Author'
    
    // Content: gabungkan baris 3+ dengan mempertahankan paragraf
    // Double newline (\n\n) menjadi pemisah paragraf
    const contentLines = lines.slice(2)
    const content = contentLines.join('\n').trim()
    
    if (title && content) {
      parsedDocuments.value.push({
        fileName: file.name,
        title: title,
        author: author,
        content: content // Sekarang mendukung multi-paragraf!
      })
    }
  }
  
  showMessage(`Parsed ${parsedDocuments.value.length} file(s)`, 'info')
}

// Upload documents to server
const uploadDocuments = async () => {
  if (parsedDocuments.value.length === 0) {
    showMessage('No documents to upload', 'error')
    return
  }
  
  isUploading.value = true
  
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/api/v1/upload`, {
      method: 'POST',
      body: {
        documents: parsedDocuments.value
      }
    })
    
    showMessage(res.message, 'success')
    parsedDocuments.value = []
    files.value = []
    await fetchUploadedDocuments()
  } catch (e) {
    showMessage('Failed to upload documents', 'error')
    console.error(e)
  } finally {
    isUploading.value = false
  }
}

// Search uploaded documents
const searchDocuments = async () => {
  if (!searchQuery.value) {
    searchResults.value = []
    return
  }
  
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/api/v1/upload/search`, {
      params: { query: searchQuery.value }
    })
    
    searchResults.value = res.data || []
    
    // Log preprocessing details to console
    if (res.processingDetails) {
      logPreprocessingDetails(res.processingDetails)
    }
  } catch (e) {
    console.error('Error searching:', e)
  }
}

// Log preprocessing details (same as search page)
const logPreprocessingDetails = (details: any) => {
  console.log('%c═══════════════════════════════════════════════════════════════', 'color: #2196F3; font-weight: bold;')
  console.log('%c              UPLOADED DOCS - TEXT PREPROCESSING DETAILS', 'color: #2196F3; font-weight: bold; font-size: 14px;')
  console.log('%c═══════════════════════════════════════════════════════════════', 'color: #2196F3; font-weight: bold;')
  
  console.log('%c\n📝 QUERY INFO:', 'color: #4CAF50; font-weight: bold;')
  console.log('   Original:', details.queryInfo?.originalQuery)
  console.log('   Processed:', details.queryInfo?.processedQuery)
  
  if (details.queryPreprocessing) {
    console.log('%c\n TAHAP 1: LEXICAL ANALYSIS', 'color: #FF9800; font-weight: bold;')
    console.log('   Tokens:', details.queryPreprocessing.step1_lexicalAnalysis?.tokens)
    
    console.log('%c\n TAHAP 2: STOPWORD REMOVAL', 'color: #E91E63; font-weight: bold;')
    console.log('   After:', details.queryPreprocessing.step2_stopwordRemoval?.after)
    
    console.log('%c\n TAHAP 3: PHRASE DETECTION', 'color: #9C27B0; font-weight: bold;')
    console.log('   Bigrams:', details.queryPreprocessing.step3_phraseDetection?.bigrams)
    
    console.log('%c\n TAHAP 4: STEMMING', 'color: #00BCD4; font-weight: bold;')
    console.log('   After:', details.queryPreprocessing.step4_stemming?.after)
  }
  
  console.log('%c\n TAHAP 5: TF-IDF', 'color: #795548; font-weight: bold;')
  console.log('   Total Docs:', details.tfidfCalculation?.idfDetails?.totalDocuments)
  
  console.log('%c\n TAHAP 6: COSINE SIMILARITY - RANKING:', 'color: #F44336; font-weight: bold;')
  console.table(details.cosineSimilarity?.ranking)
}

// Clear all uploaded documents
const clearDocuments = async () => {
  if (!confirm('Are you sure you want to clear all uploaded documents?')) return
  
  try {
    await $fetch(`${config.public.apiBaseUrl}/api/v1/upload`, { method: 'DELETE' })
    uploadedDocuments.value = []
    searchResults.value = []
    showMessage('All documents cleared', 'success')
  } catch (e) {
    showMessage('Failed to clear documents', 'error')
  }
}

// Show message
const showMessage = (msg: string, type: 'success' | 'error' | 'info') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => { message.value = '' }, 3000)
}

// Tampilkan detail dokumen
const showDocument = (doc: any) => {
  selectedDocument.value = doc
}

// Tutup modal dokumen
const closeDocument = () => {
  selectedDocument.value = null
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">📄 Upload Dokumen TXT</h1>
        <p class="text-gray-600 dark:text-gray-400">Upload file .txt untuk menambahkan dokumen ke corpus pencarian</p>
        <nuxt-link to="/" class="text-blue-500 hover:underline">← Kembali ke Beranda</nuxt-link>
      </div>

      <!-- Message Alert -->
      <div v-if="message" 
           :class="[
             'p-4 rounded-lg mb-6',
             messageType === 'success' ? 'bg-green-100 text-green-800' : '',
             messageType === 'error' ? 'bg-red-100 text-red-800' : '',
             messageType === 'info' ? 'bg-blue-100 text-blue-800' : ''
           ]">
        {{ message }}
      </div>

      <!-- Format Guide -->
      <div class="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
        <h3 class="font-bold text-yellow-800 dark:text-yellow-200 mb-2">📝 Format File TXT:</h3>
        <pre class="text-sm text-yellow-700 dark:text-yellow-300 whitespace-pre-wrap">Baris 1: Judul Dokumen
Baris 2: Nama Penulis
Baris 3+: Isi/Konten Dokumen...

Contoh:
---
Introduction to Python
John Doe
Python is a programming language that is widely used for web development, data science, and automation...</pre>
      </div>

      <!-- Upload Area -->
      <div 
        @drop="handleDrop"
        @dragover.prevent
        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center mb-6 hover:border-blue-500 transition-colors cursor-pointer"
      >
        <input type="file" accept=".txt" multiple @change="handleFileSelect" class="hidden" id="fileInput">
        <label for="fileInput" class="cursor-pointer">
          <div class="text-4xl mb-4">📁</div>
          <p class="text-gray-600 dark:text-gray-300 mb-2">Drag & Drop file .txt di sini</p>
          <p class="text-gray-500 dark:text-gray-400 text-sm">atau klik untuk memilih file</p>
        </label>
      </div>

      <!-- Parsed Documents Preview -->
      <div v-if="parsedDocuments.length > 0" class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow">
        <h3 class="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">📋 Preview Dokumen ({{ parsedDocuments.length }})</h3>
        <div v-for="(doc, i) in parsedDocuments" :key="i" class="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-0">
          <p class="text-sm text-gray-500">File: {{ doc.fileName }}</p>
          <p class="font-semibold text-gray-800 dark:text-gray-100">{{ doc.title }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Oleh: {{ doc.author }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">{{ doc.content.substring(0, 150) }}...</p>
        </div>
        <button 
          @click="uploadDocuments" 
          :disabled="isUploading"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {{ isUploading ? 'Uploading...' : '⬆️ Upload Dokumen' }}
        </button>
      </div>

      <!-- Uploaded Documents -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-lg text-gray-800 dark:text-gray-100">📚 Dokumen Ter-upload ({{ uploadedDocuments.length }})</h3>
          <button v-if="uploadedDocuments.length > 0" @click="clearDocuments" class="text-red-500 hover:text-red-700 text-sm">
            🗑️ Hapus Semua
          </button>
        </div>
        
        <!-- Search in uploaded docs -->
        <div v-if="uploadedDocuments.length > 0" class="mb-4">
          <form @submit.prevent="searchDocuments" class="flex gap-2">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Cari dalam dokumen yang diupload..." 
              class="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
            <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
              🔍 Cari
            </button>
          </form>
          <p class="text-xs text-gray-500 mt-2">💡 Buka Console (F12) untuk melihat detail preprocessing</p>
        </div>

        <!-- Search Results -->
        <div v-if="searchResults.length > 0" class="mb-4">
          <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Hasil Pencarian:</h4>
          <div 
            v-for="result in searchResults" 
            :key="result.id" 
            @click="showDocument(result)"
            class="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
          >
            <p class="font-semibold text-blue-600 dark:text-blue-400 hover:underline">{{ result.title }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ result.author }} | Score: {{ result.score?.toFixed(4) }}</p>
            <p class="text-sm text-gray-500">{{ result.content?.substring(0, 100) }}...</p>
          </div>
        </div>

        <!-- Document List -->
        <div v-if="uploadedDocuments.length === 0" class="text-gray-500 text-center py-8">
          Belum ada dokumen yang diupload
        </div>
        <div v-else class="space-y-3 max-h-60 overflow-y-auto">
          <div 
            v-for="doc in uploadedDocuments" 
            :key="doc.id" 
            @click="showDocument(doc)"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <p class="font-semibold text-gray-800 dark:text-gray-100">{{ doc.title }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ doc.author }} | {{ doc.date }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Detail Dokumen -->
    <div 
      v-if="selectedDocument" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeDocument"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-xl">
        <!-- Header Modal -->
        <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">{{ selectedDocument.title }}</h2>
          <button @click="closeDocument" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl">
            &times;
          </button>
        </div>
        <!-- Info Dokumen -->
        <div class="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            <span class="font-semibold">Penulis:</span> {{ selectedDocument.author }} | 
            <span class="font-semibold">Tanggal:</span> {{ selectedDocument.date }}
            <span v-if="selectedDocument.score" class="ml-2">| <span class="font-semibold">Score:</span> {{ selectedDocument.score?.toFixed(4) }}</span>
          </p>
        </div>
        <!-- Content Dokumen -->
        <div class="p-4 overflow-y-auto max-h-[60vh]">
          <p class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{{ selectedDocument.content }}</p>
        </div>
        <!-- Footer Modal -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <button 
            @click="closeDocument" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
