/**
 * =====================================================
 * FILE: uploadRoute.js
 * =====================================================
 * Route untuk endpoint upload dokumen TXT
 * =====================================================
 */

import express from "express";
import {
    uploadDocuments,
    getUploadedDocuments,
    searchUploadedDocuments,
    clearUploadedDocuments
} from "../controllers/uploadController.js";

const router = express.Router();

/**
 * POST /api/v1/upload
 * Upload dokumen baru dari file TXT
 */
router.post('/upload', uploadDocuments);

/**
 * GET /api/v1/upload
 * Mendapatkan semua dokumen yang sudah di-upload
 */
router.get('/upload', getUploadedDocuments);

/**
 * GET /api/v1/upload/search?query=...
 * Mencari di dokumen yang di-upload
 */
router.get('/upload/search', searchUploadedDocuments);

/**
 * DELETE /api/v1/upload
 * Menghapus semua dokumen yang di-upload
 */
router.delete('/upload', clearUploadedDocuments);

export default router;
