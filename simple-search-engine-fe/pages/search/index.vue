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
    
    // =====================================================
    // TAMPILKAN DETAIL PREPROCESSING DI CONSOLE BROWSER
    // =====================================================
    if (res.processingDetails) {
      const details = res.processingDetails;
      
      console.log('%c═══════════════════════════════════════════════════════════════', 'color: #2196F3; font-weight: bold;');
      console.log('%c                    SEARCH ENGINE - TEXT PREPROCESSING DETAILS', 'color: #2196F3; font-weight: bold; font-size: 14px;');
      console.log('%c═══════════════════════════════════════════════════════════════', 'color: #2196F3; font-weight: bold;');
      
      // Query Info
      console.log('%c\n📝 QUERY INFO:', 'color: #4CAF50; font-weight: bold; font-size: 12px;');
      console.log('   Original Query:', details.queryInfo.originalQuery);
      console.log('   Processed Query:', details.queryInfo.processedQuery);
      
      // Step 1: Lexical Analysis
      console.log('%c\n═══════════════════════════════════════════════════════════════', 'color: #FF9800;');
      console.log('%c TAHAP 1: LEXICAL ANALYSIS (Tokenization)', 'color: #FF9800; font-weight: bold; font-size: 12px;');
      console.log('%c═══════════════════════════════════════════════════════════════', 'color: #FF9800;');
      console.log('   📖 Penjelasan:', details.queryPreprocessing.step1_lexicalAnalysis.explanation);
      console.log('   📄 Original:', details.queryPreprocessing.step1_lexicalAnalysis.original);
      console.log('   🔤 Tokens:', details.queryPreprocessing.step1_lexicalAnalysis.tokens);
      console.log('   📊 Jumlah Token:', details.queryPreprocessing.step1_lexicalAnalysis.tokenCount);
      
      // Step 2: Stopword Removal
      console.log('%c\n═══════════════════════════════════════════════════════════════', 'color: #E91E63;');
      console.log('%c TAHAP 2: STOPWORD REMOVAL', 'color: #E91E63; font-weight: bold; font-size: 12px;');
      console.log('%c═══════════════════════════════════════════════════════════════', 'color: #E91E63;');
      console.log('   📖 Penjelasan:', details.queryPreprocessing.step2_stopwordRemoval.explanation);
      console.log('   ⬅️  Before:', details.queryPreprocessing.step2_stopwordRemoval.before);
      console.log('   🗑️  Removed:', details.queryPreprocessing.step2_stopwordRemoval.removed);
      console.log('   ➡️  After:', details.queryPreprocessing.step2_stopwordRemoval.after);
      
      // Step 3: Phrase Detection
      console.log('%c\n═══════════════════════════════════════════════════════════════', 'color: #9C27B0;');
      console.log('%c TAHAP 3: PHRASE DETECTION (N-Gram)', 'color: #9C27B0; font-weight: bold; font-size: 12px;');
      console.log('%c═══════════════════════════════════════════════════════════════', 'color: #9C27B0;');
      console.log('   📖 Penjelasan:', details.queryPreprocessing.step3_phraseDetection.explanation);
      console.log('   1️⃣  Unigrams:', details.queryPreprocessing.step3_phraseDetection.unigrams);
      console.log('   2️⃣  Bigrams:', details.queryPreprocessing.step3_phraseDetection.bigrams);
      console.log('   3️⃣  Trigrams:', details.queryPreprocessing.step3_phraseDetection.trigrams);
      
      // Step 4: Stemming
      console.log('%c\n═══════════════════════════════════════════════════════════════', 'color: #00BCD4;');
      console.log('%c TAHAP 4: STEMMING (Porter Stemmer)', 'color: #00BCD4; font-weight: bold; font-size: 12px;');
      console.log('%c═══════════════════════════════════════════════════════════════', 'color: #00BCD4;');
      console.log('   📖 Penjelasan:', details.queryPreprocessing.step4_stemming.explanation);
      console.log('   ⬅️  Before:', details.queryPreprocessing.step4_stemming.before);
      console.log('   ➡️  After:', details.queryPreprocessing.step4_stemming.after);
      console.log('   🔄 Mapping:', details.queryPreprocessing.step4_stemming.mapping);
      
      // Step 5: TF-IDF
      console.log('%c\n═══════════════════════════════════════════════════════════════', 'color: #795548;');
      console.log('%c TAHAP 5: TF-IDF CALCULATION', 'color: #795548; font-weight: bold; font-size: 12px;');
      console.log('%c═══════════════════════════════════════════════════════════════', 'color: #795548;');
      console.log('   📖 Penjelasan:', details.tfidfCalculation.explanation);
      console.log('   📊 Total Dokumen:', details.tfidfCalculation.idfDetails.totalDocuments);
      console.log('   📋 IDF Sample Terms:', details.tfidfCalculation.idfDetails.sampleTerms);
      console.log('   📈 TF-IDF Matrix (sample):');
      console.table(details.tfidfCalculation.matrixSummary?.documents || []);
      
      // Step 6: Cosine Similarity
      console.log('%c\n═══════════════════════════════════════════════════════════════', 'color: #F44336;');
      console.log('%c TAHAP 6: COSINE SIMILARITY', 'color: #F44336; font-weight: bold; font-size: 12px;');
      console.log('%c═══════════════════════════════════════════════════════════════', 'color: #F44336;');
      console.log('   📖 Formula:', details.cosineSimilarity.formula);
      console.log('   📖 Penjelasan:', details.cosineSimilarity.explanation);
      console.log('   🔍 Query:', details.cosineSimilarity.query);
      console.log('   📊 Query Vector:', details.cosineSimilarity.queryVector);
      console.log('%c   🏆 RANKING HASIL:', 'color: #4CAF50; font-weight: bold;');
      console.table(details.cosineSimilarity.ranking);
      
      console.log('%c\n═══════════════════════════════════════════════════════════════', 'color: #2196F3; font-weight: bold;');
      console.log('%c                              SELESAI!', 'color: #2196F3; font-weight: bold; font-size: 14px;');
      console.log('%c═══════════════════════════════════════════════════════════════', 'color: #2196F3; font-weight: bold;');
    }
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
                placeholder="Search Adalah Pokoknya Browser"
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
