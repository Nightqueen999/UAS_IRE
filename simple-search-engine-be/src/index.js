/**
 * =====================================================
 * FILE: index.js
 * =====================================================
 * Ini adalah ENTRY POINT (titik masuk) dari aplikasi backend.
 * File ini bertanggung jawab untuk menjalankan server Express.
 * =====================================================
 */

// Mengimpor konfigurasi aplikasi Express yang sudah dibuat di app.js
import app from "./app.js";

// Mengimpor dotenv untuk membaca environment variables dari file .env
import dotenv from "dotenv";

// Memuat konfigurasi dari file .env ke process.env
// Contoh isi .env: PORT=8000, HOST=localhost
dotenv.config();

// Menentukan port server, ambil dari .env atau default 8000
const port = process.env.PORT || 8000;

// Menentukan host server, ambil dari .env atau default 'localhost'
const host = process.env.HOST || 'localhost';

// Menjalankan server Express pada port dan host yang ditentukan
// app.listen() akan membuat server HTTP dan mulai menerima request
app.listen(port, () => {
    // Callback ini dipanggil ketika server berhasil berjalan
    console.log(`Server is running on http://${host}:${port}`)
});