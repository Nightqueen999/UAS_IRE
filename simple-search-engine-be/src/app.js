/**
 * =====================================================
 * FILE: app.js
 * =====================================================
 * File ini adalah KONFIGURASI UTAMA dari aplikasi Express.
 * Di sini kita mengatur middleware, routing, dan pengaturan lainnya.
 * =====================================================
 */

// Mengimpor Express - framework web untuk Node.js
import express from "express";

// Mengimpor body-parser untuk menguraikan (parse) request body dalam format JSON
import bodyParser from "body-parser";

// Mengimpor CORS (Cross-Origin Resource Sharing) untuk mengizinkan 
// request dari domain/origin yang berbeda (misal: frontend di port 3000, backend di port 8000)
import cors from "cors"

// Mengimpor router yang berisi definisi route untuk blog
import blogRouter from "./routes/blogRoute.js";

// Mengimpor router untuk upload dokumen
import uploadRouter from "./routes/uploadRoute.js";


// Membuat instance aplikasi Express
const app = express();

// Mengaktifkan CORS - memungkinkan frontend dari domain lain mengakses API ini
// Tanpa ini, browser akan memblokir request dari frontend ke backend
app.use(cors());

// Mengaktifkan body-parser untuk menguraikan request body dalam format JSON
// Ini memungkinkan kita mengakses data JSON yang dikirim client melalui req.body
// Limit ditingkatkan untuk mengakomodasi upload dokumen besar
app.use(bodyParser.json({ limit: '10mb' }));

// Mendaftarkan router dengan prefix '/api/v1'
// Semua route di blogRoute.js akan dimulai dengan '/api/v1'
// Contoh: GET /api/v1/blogs, GET /api/v1/blogs/:id
app.use('/api/v1', blogRouter);

// Mendaftarkan upload router
// Contoh: POST /api/v1/upload, GET /api/v1/upload/search
app.use('/api/v1', uploadRouter);

// Mengekspor app agar bisa digunakan di file lain (index.js)
export default app;

