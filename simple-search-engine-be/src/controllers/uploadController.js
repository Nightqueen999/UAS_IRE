/**
 * =====================================================
 * FILE: uploadController.js
 * =====================================================
 * Controller untuk menangani upload file TXT dan menambahkannya
 * ke corpus dokumen untuk pencarian.
 * 
 * PENYIMPANAN: Dokumen disimpan di file JSON agar PERMANEN
 * File: src/datas/uploaded_documents.json
 * 
 * FORMAT FILE TXT:
 * Setiap file .txt berisi satu dokumen dengan format:
 * - Baris 1: Title (judul dokumen)
 * - Baris 2: Author (penulis)
 * - Baris 3+: Content (isi dokumen, bisa multi-line)
 * 
 * Contoh isi file dokumen.txt:
 * ---
 * Introduction to Python
 * John Doe
 * Python is a programming language that is widely used...
 * It was created by Guido van Rossum...
 * ---
 * =====================================================
 */

import { sendResponse } from "../utils/response.js";
import { fullPreprocessing } from "../utils/textProcessor.js";
import { calculateTFIDF, calculateCosineSimilarity } from "../utils/tfidfCalculator.js";
import TfIdf from 'tf-idf-search';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mendapatkan __dirname untuk ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path ke file JSON untuk menyimpan dokumen yang di-upload (PERMANEN)
const UPLOADED_DOCS_FILE = path.join(__dirname, '../datas/uploaded_documents.json');

/**
 * =====================================================
 * FUNGSI HELPER: Load dokumen dari file JSON
 * =====================================================
 */
const loadUploadedDocuments = () => {
    try {
        if (fs.existsSync(UPLOADED_DOCS_FILE)) {
            const data = fs.readFileSync(UPLOADED_DOCS_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('Error loading uploaded documents:', e);
    }
    return { documents: [], nextId: 100 };
};

/**
 * =====================================================
 * FUNGSI HELPER: Simpan dokumen ke file JSON
 * =====================================================
 */
const saveUploadedDocuments = (documents, nextId) => {
    try {
        const data = JSON.stringify({ documents, nextId }, null, 2);
        fs.writeFileSync(UPLOADED_DOCS_FILE, data, 'utf-8');
        return true;
    } catch (e) {
        console.error('Error saving uploaded documents:', e);
        return false;
    }
};

// Instance TF-IDF untuk dokumen yang di-upload
const uploadTfIdf = new TfIdf();

/**
 * =====================================================
 * FUNGSI: uploadDocuments
 * =====================================================
 * Endpoint: POST /api/v1/upload
 * Menerima array dokumen dari file TXT yang sudah di-parse di frontend
 * Dokumen disimpan PERMANEN ke file JSON
 * 
 * Request Body:
 * {
 *   "documents": [
 *     { "title": "...", "author": "...", "content": "..." },
 *     ...
 *   ]
 * }
 * =====================================================
 */
export const uploadDocuments = async (req, res) => {
    try {
        const { documents } = req.body;

        if (!documents || !Array.isArray(documents) || documents.length === 0) {
            return sendResponse(res, false, null, 'No documents provided', 400);
        }

        // Load dokumen yang sudah ada
        const stored = loadUploadedDocuments();
        let uploadedDocuments = stored.documents;
        let nextId = stored.nextId;

        const addedDocuments = [];
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        for (const doc of documents) {
            if (!doc.title || !doc.content) {
                continue; // Skip dokumen yang tidak valid
            }

            const newDoc = {
                id: nextId++,
                title: doc.title.trim(),
                author: doc.author?.trim() || 'Unknown Author',
                content: doc.content.trim(),
                date: today,
                source: 'uploaded' // Menandakan dokumen ini hasil upload
            };

            uploadedDocuments.push(newDoc);
            addedDocuments.push(newDoc);
        }

        // Simpan ke file JSON (PERMANEN)
        const saved = saveUploadedDocuments(uploadedDocuments, nextId);

        if (!saved) {
            return sendResponse(res, false, null, 'Failed to save documents to file', 500);
        }

        return sendResponse(res, true, {
            addedCount: addedDocuments.length,
            totalUploaded: uploadedDocuments.length,
            documents: addedDocuments,
            storageLocation: 'src/datas/uploaded_documents.json'
        }, `Successfully added ${addedDocuments.length} document(s) - SAVED PERMANENTLY`);

    } catch (e) {
        console.error('Error uploading documents:', e);
        sendResponse(res, false, null, 'Failed to upload documents', 500);
    }
};

/**
 * =====================================================
 * FUNGSI: getUploadedDocuments
 * =====================================================
 * Endpoint: GET /api/v1/upload
 * Mengambil semua dokumen yang sudah di-upload dari file JSON
 * =====================================================
 */
export const getUploadedDocuments = async (req, res) => {
    try {
        const stored = loadUploadedDocuments();
        return sendResponse(res, true, stored.documents, `Found ${stored.documents.length} uploaded document(s)`);
    } catch (e) {
        console.error('Error fetching uploaded documents:', e);
        sendResponse(res, false, null, 'Failed to fetch uploaded documents', 500);
    }
};

/**
 * =====================================================
 * FUNGSI: searchUploadedDocuments
 * =====================================================
 * Endpoint: GET /api/v1/upload/search?query=...
 * Mencari di dokumen yang di-upload menggunakan TF-IDF
 * =====================================================
 */
export const searchUploadedDocuments = async (req, res) => {
    try {
        const query = req.query.query;
        const stored = loadUploadedDocuments();
        const uploadedDocuments = stored.documents;

        if (!query) {
            return sendResponse(res, true, uploadedDocuments, 'All uploaded documents');
        }

        if (uploadedDocuments.length === 0) {
            return sendResponse(res, true, [], 'No uploaded documents to search');
        }

        // Preprocessing query
        const queryPreprocessing = fullPreprocessing(query);
        const stemmedQuery = queryPreprocessing.finalTokens;

        // Preprocessing semua dokumen
        const documentPreprocessing = uploadedDocuments.map((doc) => {
            const combinedText = `${doc.title} ${doc.author} ${doc.content}`;
            const preprocessing = fullPreprocessing(combinedText);
            return {
                docId: doc.id,
                title: doc.title,
                preprocessing: preprocessing
            };
        });

        const docContent = documentPreprocessing.map(d => d.preprocessing.finalTokens);
        const docTokenArrays = documentPreprocessing.map(d =>
            d.preprocessing.preprocessing.stemming.after
        );

        // Buat corpus dan search
        const tf_idf = new TfIdf();
        tf_idf.createCorpusFromStringArray(docContent);
        const searchResults = tf_idf.rankDocumentsByQuery(stemmedQuery);

        // TF-IDF dan Cosine details
        const documentTitles = uploadedDocuments.map(d => d.title);
        const tfidfDetails = calculateTFIDF(docTokenArrays, documentTitles);
        const queryTokens = queryPreprocessing.preprocessing.stemming.after;
        const cosineDetails = calculateCosineSimilarity(queryTokens, docTokenArrays, documentTitles);

        // Format hasil
        const result = searchResults
            .filter((r) => r.index < uploadedDocuments.length)
            .map((r) => ({
                ...uploadedDocuments[r.index],
                score: r.similarityIndex,
                token: r.document
            }));

        // Response dengan detail preprocessing
        return res.status(200).json({
            success: true,
            message: 'Uploaded documents ranked by TF-IDF',
            data: result.filter(r => r.score > 0),
            processingDetails: {
                queryInfo: {
                    originalQuery: query,
                    processedQuery: stemmedQuery
                },
                queryPreprocessing: {
                    step1_lexicalAnalysis: queryPreprocessing.preprocessing.lexicalAnalysis,
                    step2_stopwordRemoval: queryPreprocessing.preprocessing.stopwordRemoval,
                    step3_phraseDetection: queryPreprocessing.preprocessing.phraseDetection,
                    step4_stemming: queryPreprocessing.preprocessing.stemming,
                    summary: queryPreprocessing.summary
                },
                tfidfCalculation: {
                    explanation: tfidfDetails.explanation,
                    idfDetails: {
                        totalDocuments: tfidfDetails.idfDetails.totalDocuments,
                        explanation: tfidfDetails.idfDetails.explanation
                    },
                    matrixSummary: tfidfDetails.matrixSummary
                },
                cosineSimilarity: {
                    formula: cosineDetails.formula,
                    explanation: cosineDetails.explanation,
                    query: cosineDetails.query,
                    ranking: cosineDetails.ranking
                }
            }
        });

    } catch (e) {
        console.error('Error searching uploaded documents:', e);
        sendResponse(res, false, null, 'Failed to search uploaded documents', 500);
    }
};

/**
 * =====================================================
 * FUNGSI: clearUploadedDocuments
 * =====================================================
 * Endpoint: DELETE /api/v1/upload
 * Menghapus semua dokumen yang sudah di-upload dari file JSON
 * =====================================================
 */
export const clearUploadedDocuments = async (req, res) => {
    try {
        const stored = loadUploadedDocuments();
        const count = stored.documents.length;

        // Simpan array kosong ke file JSON
        saveUploadedDocuments([], 100);

        return sendResponse(res, true, null, `Cleared ${count} uploaded document(s)`);
    } catch (e) {
        console.error('Error clearing uploaded documents:', e);
        sendResponse(res, false, null, 'Failed to clear uploaded documents', 500);
    }
};

