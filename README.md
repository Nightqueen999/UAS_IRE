# 🔍 Simple Search Engine dengan TF-IDF

Aplikasi mesin pencari sederhana menggunakan algoritma **TF-IDF** dan **Cosine Similarity** dengan fitur text preprocessing lengkap.

---

## 📋 Fitur Utama

- ✅ Pencarian dokumen menggunakan **TF-IDF** dan **Cosine Similarity**
- ✅ Text Preprocessing lengkap (Tokenization, Stopword Removal, Stemming, N-Gram)
- ✅ **Mendukung Bahasa Indonesia dan Inggris** (Bilingual)
- ✅ Upload dokumen TXT custom
- ✅ Detail preprocessing ditampilkan di Console Browser (F12)
- ✅ Penyimpanan dokumen upload secara permanen (JSON)

---

## 🚀 Cara Instalasi & Menjalankan

### Prasyarat
- Node.js v18+ terinstal
- npm (Node Package Manager)

### 1️⃣ Clone atau Download Project

```bash
git clone <repository-url>
cd UAS_IRE
```

### 2️⃣ Setup Backend (BE)

```bash
# Masuk ke folder backend
cd simple-search-engine-be

# Install dependencies
npm install

# Buat file .env (jika belum ada)
# Isi dengan:
# PORT=8000

# Jalankan server backend
npm run dev
```

Backend akan berjalan di: **http://localhost:8000**

### 3️⃣ Setup Frontend (FE)

Buka terminal baru:

```bash
# Masuk ke folder frontend
cd simple-search-engine-fe

# Install dependencies
npm install

# Buat file .env (jika belum ada)
# Isi dengan:
# NUXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Jalankan server frontend
npm run dev
```

Frontend akan berjalan di: **http://localhost:3000**

---

## 📁 Struktur Project

```
UAS_IRE/
├── simple-search-engine-be/     # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── blogController.js    # Logika pencarian TF-IDF
│   │   │   └── uploadController.js  # Logika upload dokumen
│   │   ├── datas/
│   │   │   ├── blog.js              # Data dokumen bawaan (10 artikel)
│   │   │   └── uploaded_documents.json  # Dokumen yang diupload
│   │   ├── routes/
│   │   │   ├── blogRoute.js         # Route pencarian
│   │   │   └── uploadRoute.js       # Route upload
│   │   ├── utils/
│   │   │   ├── textProcessor.js     # Modul preprocessing (EN+ID)
│   │   │   ├── tfidfCalculator.js   # Modul TF-IDF & Cosine
│   │   │   └── response.js          # Helper response
│   │   ├── app.js                   # Konfigurasi Express
│   │   └── index.js                 # Entry point
│   └── package.json
│
├── simple-search-engine-fe/     # Frontend (Nuxt.js)
│   ├── pages/
│   │   ├── index.vue                # Halaman utama
│   │   ├── upload.vue               # Halaman upload dokumen
│   │   └── search/
│   │       ├── index.vue            # Hasil pencarian
│   │       └── [id].vue             # Detail dokumen
│   ├── components/
│   │   └── navbar.vue               # Navigasi
│   └── package.json
│
└── contoh_dokumen/              # 10 contoh file TXT untuk upload
```

---

## 📝 Format File TXT untuk Upload

```
Baris 1: Judul Dokumen
Baris 2: Nama Penulis
Baris 3+: Isi/Konten Dokumen (bisa multi-paragraf)
```

**Contoh:**
```
Pengenalan Kecerdasan Buatan
Dr. Ahmad Wijaya
Kecerdasan Buatan atau AI adalah cabang ilmu komputer...

Paragraf kedua...
```

---

## 🔧 API Endpoints

### Pencarian
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/v1/blogs` | Ambil semua dokumen |
| GET | `/api/v1/blogs?search=keyword` | Cari dokumen |
| GET | `/api/v1/blogs/:id` | Detail dokumen berdasarkan ID |

### Upload Dokumen
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/v1/upload` | Ambil semua dokumen yang diupload |
| POST | `/api/v1/upload` | Upload dokumen baru |
| GET | `/api/v1/upload/search?query=keyword` | Cari di dokumen upload |
| DELETE | `/api/v1/upload` | Hapus semua dokumen upload |

---

## 🎯 Cara Penggunaan

1. Buka **http://localhost:3000**
2. Ketik kata kunci di search bar dan tekan Enter
3. Lihat hasil pencarian dengan skor relevansi
4. Tekan **F12** → Tab **Console** untuk melihat detail preprocessing:
   - Lexical Analysis
   - Stopword Removal (EN + ID)
   - Phrase Detection (N-Gram)
   - Stemming (EN + ID)
   - TF-IDF Matrix
   - Cosine Similarity

### Upload Dokumen Custom
1. Klik tombol **"📄 Upload Dokumen TXT"** di halaman utama
2. Drag & drop file .txt atau klik untuk memilih
3. Preview dokumen lalu klik **"Upload"**
4. Dokumen akan tersimpan permanen dan bisa dicari

---

## 👥 Tim Pengembang

- **Krisna** - Lexical Analysis, Stopword Removal
- **Triana** - Phrase Detection, Stemming
- **[Nama lain...]** - [Kontribusi]

---

## 📚 Teknologi yang Digunakan

**Backend:**
- Node.js + Express.js
- tf-idf-search (library TF-IDF)
- natural (NLP library untuk stemming)
- stopword (library stopword removal)

**Frontend:**
- Nuxt.js 3
- Vue 3
- Tailwind CSS
