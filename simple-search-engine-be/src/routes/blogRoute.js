/**
 * =====================================================
 * FILE: blogRoute.js
 * =====================================================
 * File ini mendefinisikan ROUTING untuk endpoint blog.
 * Routing menentukan URL mana yang akan memanggil fungsi controller mana.
 * =====================================================
 */

// Mengimpor Express untuk membuat router
import express from "express";

// Mengimpor fungsi controller untuk menangani request
// - getBlogs: mendapatkan semua blog atau mencari blog berdasarkan query
// - getBlogById: mendapatkan blog berdasarkan ID tertentu
import { getBlogById, getBlogs } from "../controllers/blogController.js";

// Membuat instance Router dari Express
// Router memungkinkan kita mengelompokkan route-route yang terkait
const router = express.Router();

/**
 * Route: GET /blogs
 * Contoh URL lengkap: GET /api/v1/blogs atau GET /api/v1/blogs?search=javascript
 * Fungsi: Mengambil semua blog atau mencari blog dengan TF-IDF
 * Handler: getBlogs di blogController.js
 */
router.get('/blogs', getBlogs);

/**
 * Route: GET /blogs/:id
 * Contoh URL lengkap: GET /api/v1/blogs/1
 * Fungsi: Mengambil satu blog berdasarkan ID
 * Handler: getBlogById di blogController.js
 * Parameter :id akan tersedia di req.params.id
 */
router.get('/blogs/:id', getBlogById);

// Mengekspor router agar bisa digunakan di app.js
export default router;