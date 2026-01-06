/**
 * =====================================================
 * FILE: blogController.js
 * =====================================================
 * File ini adalah CONTROLLER yang berisi logika bisnis untuk pencarian blog
 * menggunakan algoritma TF-IDF (Term Frequency - Inverse Document Frequency)
 * dan Cosine Similarity.
 * 
 * KONSEP PENTING:
 * 1. TF (Term Frequency): Seberapa sering sebuah kata muncul dalam dokumen
 * 2. IDF (Inverse Document Frequency): Mengukur keunikan kata di seluruh dokumen
 * 3. TF-IDF = TF × IDF → Bobot kata yang lebih tinggi jika sering muncul di dokumen tapi jarang di corpus
 * 4. Cosine Similarity: Mengukur kemiripan antara query dan dokumen
 * 
 * ALUR PROSES:
 * Query User → Preprocessing (Tokenization, Stopword Removal, Stemming) 
 * → Hitung TF-IDF → Hitung Cosine Similarity → Ranking Hasil
 * =====================================================
 */

// Mengimpor library TF-IDF untuk menghitung bobot kata dan ranking dokumen
import TfIdf from 'tf-idf-search'

// Mengimpor data blog dari file blog.js (ini adalah corpus/kumpulan dokumen)
import { blogs } from "../datas/blog.js";

// Mengimpor fungsi helper untuk mengirim response yang terstandarisasi
import { sendResponse } from "../utils/response.js";

// Mengimpor library Natural untuk NLP (Natural Language Processing)
// Natural menyediakan berbagai tool untuk pemrosesan teks, termasuk stemming
import natural from "natural";

// Mengimpor fungsi removeStopwords untuk menghapus kata-kata umum yang tidak penting
// Stopwords contoh: "the", "is", "at", "which", "on", dll
import { removeStopwords } from "stopword";

// =====================================================
// IMPORT MODUL PREPROCESSING DAN TF-IDF CALCULATOR
// =====================================================
import {
    lexicalAnalysis,
    stopwordRemoval,
    phraseDetection,
    stemmingProcess,
    fullPreprocessing
} from "../utils/textProcessor.js";

import {
    calculateTF,
    calculateIDF,
    calculateTFIDF,
    calculateCosineSimilarity
} from "../utils/tfidfCalculator.js";

// Membuat instance TF-IDF untuk menghitung bobot kata
const tf_idf = new TfIdf()

// Menggunakan PorterStemmer dari library natural
// Stemmer mengubah kata ke bentuk dasarnya, contoh:
// "running" → "run", "programming" → "program", "learning" → "learn"
const stemmer = natural.PorterStemmer;

// =====================================================
// IMPORT UNTUK MEMBACA FILE UPLOADED DOCUMENTS
// =====================================================
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADED_DOCS_FILE = path.join(__dirname, '../datas/uploaded_documents.json');

/**
 * =====================================================
 * FUNGSI HELPER: Load dokumen yang di-upload dari file JSON
 * =====================================================
 */
const loadUploadedDocuments = () => {
    try {
        if (fs.existsSync(UPLOADED_DOCS_FILE)) {
            const data = fs.readFileSync(UPLOADED_DOCS_FILE, 'utf-8');
            const parsed = JSON.parse(data);
            return parsed.documents || [];
        }
    } catch (e) {
        console.error('Error loading uploaded documents:', e);
    }
    return [];
};

/**
 * =====================================================
 * FUNGSI HELPER: Gabungkan blog.js + uploaded documents
 * =====================================================
 */
const getAllDocuments = () => {
    const uploadedDocs = loadUploadedDocuments();
    // Gabungkan blogs dari blog.js dengan dokumen yang di-upload
    return [...blogs, ...uploadedDocs];
};

/**
 * =====================================================
 * FUNGSI: getBlogs
 * =====================================================
 * Endpoint: GET /api/v1/blogs?search=<keyword>
 * Fungsi ini mencari blog berdasarkan query menggunakan TF-IDF
 * 
 * SEKARANG MENCARI DI SEMUA DOKUMEN:
 * - Data dari blog.js (dokumen bawaan)
 * - Data dari uploaded_documents.json (dokumen yang di-upload)
 * 
 * PROSES:
 * 1. Jika tidak ada query, return semua dokumen
 * 2. Jika ada query:
 *    a. Preprocessing query (stopword removal + stemming)
 *    b. Preprocessing semua dokumen
 *    c. Buat corpus TF-IDF
 *    d. Hitung similarity antara query dan setiap dokumen
 *    e. Return hasil yang diurutkan berdasarkan skor
 * 
 * RESPONSE: Menyertakan detail preprocessing untuk console browser
 * =====================================================
 */
export const getBlogs = async (req, res) => {
    // Mengambil parameter 'search' dari query string URL
    // Contoh: /api/v1/blogs?search=javascript → query = "javascript"
    const query = req.query.search;

    try {
        // Gabungkan semua dokumen (blog.js + uploaded)
        const allDocuments = getAllDocuments();

        // Jika tidak ada query pencarian, kembalikan semua data
        if (!query) {
            return sendResponse(res, true, allDocuments, `All Data (${blogs.length} built-in + ${allDocuments.length - blogs.length} uploaded)`);
        }

        // =====================================================
        // TAHAP 1: PREPROCESSING QUERY (dengan output detail)
        // =====================================================
        const queryPreprocessing = fullPreprocessing(query);

        // Query yang sudah di-stem
        const stemmedQuery = queryPreprocessing.finalTokens;

        // =====================================================
        // TAHAP 2: PREPROCESSING SEMUA DOKUMEN (dengan output detail)
        // =====================================================
        const documentPreprocessing = allDocuments.map((blog, index) => {
            const combinedText = `${blog.title} ${blog.author} ${blog.content}`;
            const preprocessing = fullPreprocessing(combinedText);
            return {
                docId: blog.id,
                title: blog.title,
                originalText: combinedText.substring(0, 100) + '...', // Batasi untuk readability
                preprocessing: preprocessing
            };
        });

        // Ambil token yang sudah di-stem untuk setiap dokumen
        const blogContent = documentPreprocessing.map(doc => doc.preprocessing.finalTokens);
        const blogTokenArrays = documentPreprocessing.map(doc =>
            doc.preprocessing.preprocessing.stemming.after
        );

        // =====================================================
        // TAHAP 3: MEMBUAT CORPUS TF-IDF
        // =====================================================
        let corpus = tf_idf.createCorpusFromStringArray(blogContent);

        // =====================================================
        // TAHAP 4: HITUNG TF-IDF MATRIX (dengan output detail)
        // =====================================================
        const documentTitles = allDocuments.map(b => b.title);
        const tfidfDetails = calculateTFIDF(blogTokenArrays, documentTitles);

        // =====================================================
        // TAHAP 5: HITUNG COSINE SIMILARITY (dengan output detail)
        // =====================================================
        const queryTokens = queryPreprocessing.preprocessing.stemming.after;
        const cosineDetails = calculateCosineSimilarity(queryTokens, blogTokenArrays, documentTitles);

        // =====================================================
        // TAHAP 6: RANKING DOKUMEN MENGGUNAKAN COSINE SIMILARITY
        // =====================================================
        // Gunakan hasil cosine similarity untuk ranking (sama dengan yang di console)
        const cosineRanking = cosineDetails.ranking;

        // Format hasil pencarian berdasarkan cosine ranking
        const result = cosineRanking
            .filter((ranked) => parseFloat(ranked.score) > 0)
            .map((ranked) => {
                const blog = allDocuments.find(doc => doc.title === ranked.title);
                if (!blog) return null;
                return {
                    ...blog,
                    score: parseFloat(ranked.score),
                    rank: ranked.rank
                };
            })
            .filter(item => item !== null);

        // =====================================================
        // RESPONSE DENGAN DETAIL PREPROCESSING
        // =====================================================
        // Detail ini akan ditampilkan di console browser
        const processingDetails = {
            // Informasi Query
            queryInfo: {
                originalQuery: query,
                processedQuery: stemmedQuery
            },

            // TAHAP 1-4: Text Preprocessing Query
            queryPreprocessing: {
                step1_lexicalAnalysis: queryPreprocessing.preprocessing.lexicalAnalysis,
                step2_stopwordRemoval: queryPreprocessing.preprocessing.stopwordRemoval,
                step3_phraseDetection: queryPreprocessing.preprocessing.phraseDetection,
                step4_stemming: queryPreprocessing.preprocessing.stemming,
                summary: queryPreprocessing.summary
            },

            // TAHAP 5: TF-IDF Calculation
            tfidfCalculation: {
                explanation: tfidfDetails.explanation,
                idfDetails: {
                    totalDocuments: tfidfDetails.idfDetails.totalDocuments,
                    explanation: tfidfDetails.idfDetails.explanation,
                    // Ambil 10 term pertama untuk contoh
                    sampleTerms: Object.entries(tfidfDetails.idfDetails.idf)
                        .slice(0, 10)
                        .reduce((obj, [key, val]) => {
                            obj[key] = val;
                            return obj;
                        }, {})
                },
                matrixSummary: tfidfDetails.matrixSummary
            },

            // TAHAP 6: Cosine Similarity
            cosineSimilarity: {
                formula: cosineDetails.formula,
                explanation: cosineDetails.explanation,
                query: cosineDetails.query,
                queryVector: cosineDetails.queryVector,
                ranking: cosineDetails.ranking
            },

            // Instruksi untuk user
            consoleInstructions: "Buka Developer Tools (F12) → Console untuk melihat detail preprocessing"
        };

        // Kirim response dengan data dan detail preprocessing
        return res.status(200).json({
            success: true,
            message: 'Articles ranked by TF-IDF',
            data: result,
            // Detail untuk ditampilkan di console browser
            processingDetails: processingDetails
        });

    } catch (e) {
        // Jika terjadi error, log error dan kirim response error
        console.error('Error fetching articles:', e);
        sendResponse(res, false, null, 'Failed to fetch articles', 500);
    }
}

/**
 * =====================================================
 * FUNGSI: getBlogById
 * =====================================================
 * Endpoint: GET /api/v1/blogs/:id
 * Fungsi ini mengambil satu blog berdasarkan ID
 * 
 * Parameter:
 * - id: ID blog yang dicari (dari URL parameter)
 * 
 * Return:
 * - Blog dengan ID yang sesuai, atau error 404 jika tidak ditemukan
 * =====================================================
 */
export const getBlogById = async (req, res) => {
    try {
        // Mengambil parameter 'id' dari URL
        // Contoh: /api/v1/blogs/5 → id = "5"
        const { id } = req.params;

        // Mencari blog dengan ID yang cocok
        // parseInt() mengubah string "5" menjadi angka 5
        const blog = blogs.find((item) => item.id === parseInt(id));

        // Jika blog tidak ditemukan, kirim response 404
        if (!blog) {
            return sendResponse(res, false, null, 'blog data not found', 404);
        }

        // Jika blog ditemukan, kirim response sukses
        return sendResponse(res, true, blog, 'Article found by TF-IDF');
    } catch (e) {
        // Jika terjadi error, log error dan kirim response error
        console.error('Error fetching articles:', e);
        sendResponse(res, false, null, 'Failed to fetch articles', 500);
    }
}

