/**
 * =====================================================
 * FILE: textProcessor.js
 * =====================================================
 * Modul untuk TEXT PREPROCESSING dengan output detail di setiap tahap.
 * MENDUKUNG BAHASA INDONESIA DAN INGGRIS!
 * 
 * TAHAPAN TEXT PREPROCESSING:
 * 1. Lexical Analysis (Tokenization) - Memecah teks menjadi token/kata
 * 2. Stopword Removal - Menghapus kata-kata umum (EN + ID)
 * 3. Phrase Detection - Mendeteksi frasa (bigram, trigram)
 * 4. Stemming - Mengubah kata ke bentuk dasar (EN + ID)
 * =====================================================
 */

import natural from "natural";
import { removeStopwords, eng } from "stopword";

// Menggunakan PorterStemmer untuk stemming Bahasa Inggris
const stemmerEN = natural.PorterStemmer;

// =====================================================
// DAFTAR STOPWORDS BAHASA INDONESIA
// =====================================================
const STOPWORDS_ID = [
    // Kata hubung
    "yang", "dan", "di", "ke", "dari", "ini", "itu", "dengan", "untuk", "pada",
    "adalah", "sebagai", "dalam", "tidak", "akan", "juga", "atau", "ada", "mereka",
    "sudah", "saya", "kita", "kami", "anda", "ia", "dia", "telah", "oleh", "jika",
    "bila", "saat", "seperti", "setelah", "sebelum", "karena", "agar", "supaya",
    "maka", "namun", "tetapi", "walau", "meski", "bahwa", "apa", "siapa", "mana",
    "kapan", "dimana", "kemana", "bagaimana", "mengapa", "kenapa",
    // Kata bantu
    "bisa", "dapat", "harus", "perlu", "ingin", "mau", "akan", "sedang", "masih",
    "sudah", "belum", "pernah", "sering", "selalu", "jarang", "hampir", "sangat",
    "lebih", "paling", "kurang", "cukup", "terlalu", "sekali", "hanya", "saja",
    "lagi", "lalu", "kemudian", "sekarang", "nanti", "dulu", "baru", "masih",
    // Kata ganti
    "saya", "aku", "kamu", "engkau", "kita", "kami", "mereka", "dia", "ia", "beliau",
    "nya", "mu", "ku", "kami",
    // Preposisi
    "di", "ke", "dari", "pada", "untuk", "dengan", "tanpa", "oleh", "antara",
    "melalui", "tentang", "terhadap", "mengenai", "sampai", "hingga", "sejak",
    // Artikel dan lainnya
    "si", "sang", "para", "setiap", "semua", "seluruh", "beberapa", "banyak",
    "sedikit", "berbagai", "tersebut", "hal", "cara", "serta"
];

// =====================================================
// ATURAN STEMMING BAHASA INDONESIA (Sederhana)
// =====================================================
// Prefix: me-, di-, ber-, ter-, pe-, ke-, se-
// Suffix: -kan, -an, -i, -nya, -lah, -kah
const INDONESIAN_PREFIXES = [
    { pattern: /^meng/, replacement: "" },
    { pattern: /^mem/, replacement: "" },
    { pattern: /^men/, replacement: "" },
    { pattern: /^meny/, replacement: "s" },
    { pattern: /^me/, replacement: "" },
    { pattern: /^di/, replacement: "" },
    { pattern: /^ber/, replacement: "" },
    { pattern: /^ter/, replacement: "" },
    { pattern: /^peng/, replacement: "" },
    { pattern: /^pem/, replacement: "" },
    { pattern: /^pen/, replacement: "" },
    { pattern: /^peny/, replacement: "s" },
    { pattern: /^pe/, replacement: "" },
    { pattern: /^ke/, replacement: "" },
    { pattern: /^se/, replacement: "" }
];

const INDONESIAN_SUFFIXES = [
    { pattern: /kan$/, replacement: "" },
    { pattern: /an$/, replacement: "" },
    { pattern: /i$/, replacement: "" },
    { pattern: /nya$/, replacement: "" },
    { pattern: /lah$/, replacement: "" },
    { pattern: /kah$/, replacement: "" }
];

/**
 * Stemmer sederhana untuk Bahasa Indonesia
 * Menghapus prefix dan suffix umum
 */
const stemIndonesian = (word) => {
    let stemmed = word.toLowerCase();

    // Hapus suffix terlebih dahulu
    for (const rule of INDONESIAN_SUFFIXES) {
        if (rule.pattern.test(stemmed) && stemmed.length > 4) {
            stemmed = stemmed.replace(rule.pattern, rule.replacement);
            break;
        }
    }

    // Hapus prefix
    for (const rule of INDONESIAN_PREFIXES) {
        if (rule.pattern.test(stemmed) && stemmed.length > 3) {
            stemmed = stemmed.replace(rule.pattern, rule.replacement);
            break;
        }
    }

    return stemmed;
};

/**
 * Deteksi bahasa sederhana berdasarkan kata-kata umum
 */
const detectLanguage = (tokens) => {
    const idWords = ["yang", "dan", "untuk", "dengan", "adalah", "dalam", "pada", "ini", "itu", "dari"];
    const enWords = ["the", "is", "are", "was", "were", "and", "or", "for", "with", "this", "that"];

    let idCount = 0;
    let enCount = 0;

    tokens.forEach(token => {
        if (idWords.includes(token.toLowerCase())) idCount++;
        if (enWords.includes(token.toLowerCase())) enCount++;
    });

    return idCount > enCount ? "ID" : "EN";
};

// region Krisna
/**
 * =====================================================
 * TAHAP 1: LEXICAL ANALYSIS (TOKENIZATION)
 * =====================================================
 * Memecah teks menjadi token/kata individual
 * Mendukung karakter Indonesia (tidak menghapus karakter khusus ID)
 */
export const lexicalAnalysis = (text) => {
    // Hapus karakter khusus tapi pertahankan huruf dan angka
    // Regex diubah untuk mendukung karakter Indonesia
    const cleanedText = text.replace(/[^\w\s]/g, "").toLowerCase();

    // Pecah teks menjadi array token berdasarkan spasi
    const tokens = cleanedText.split(/\s+/).filter(token => token.length > 0);

    return {
        step: "1. LEXICAL ANALYSIS (Tokenization)",
        original: text,
        cleaned: cleanedText,
        tokens: tokens,
        tokenCount: tokens.length,
        explanation: "Memecah teks menjadi token/kata individual dengan menghapus karakter khusus dan mengkonversi ke huruf kecil"
    };
};

/**
 * =====================================================
 * TAHAP 2: STOPWORD REMOVAL (BILINGUAL: EN + ID)
 * =====================================================
 * Menghapus kata-kata umum dalam Bahasa Inggris DAN Indonesia
 */
export const stopwordRemoval = (tokens) => {
    // Deteksi bahasa
    const language = detectLanguage(tokens);

    // Gabungkan stopwords Inggris dan Indonesia
    const combinedStopwords = [...eng, ...STOPWORDS_ID];

    // Hapus stopwords
    const filteredTokens = removeStopwords(tokens, combinedStopwords);

    // Identifikasi kata yang dihapus
    const removedWords = tokens.filter(token => !filteredTokens.includes(token));

    return {
        step: "2. STOPWORD REMOVAL (Bilingual: EN + ID)",
        detectedLanguage: language,
        before: tokens,
        removed: removedWords,
        after: filteredTokens,
        removedCount: removedWords.length,
        explanation: "Menghapus kata-kata umum (stopwords) dalam Bahasa Inggris dan Indonesia. Contoh EN: is, the, are. Contoh ID: yang, dan, untuk, dengan"
    };
};

// End region 

// Start Region Triana
/**
 * =====================================================
 * TAHAP 3: PHRASE DETECTION (N-GRAM)
 * =====================================================
 */
export const phraseDetection = (tokens) => {
    const unigrams = [...tokens];
    const bigrams = [];
    const trigrams = [];

    // Generate bigrams (kombinasi 2 kata berturutan)
    for (let i = 0; i < tokens.length - 1; i++) {
        bigrams.push(`${tokens[i]} ${tokens[i + 1]}`);
    }

    // Generate trigrams (kombinasi 3 kata berturutan)
    for (let i = 0; i < tokens.length - 2; i++) {
        trigrams.push(`${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`);
    }

    return {
        step: "3. PHRASE DETECTION (N-Gram)",
        tokens: tokens,
        unigrams: unigrams,
        bigrams: bigrams,
        trigrams: trigrams,
        explanation: "Mendeteksi frasa dengan mengkombinasikan kata-kata berturutan. Unigram = 1 kata, Bigram = 2 kata, Trigram = 3 kata"
    };
};

/**
 * =====================================================
 * TAHAP 4: STEMMING (BILINGUAL: EN + ID)
 * =====================================================
 * Menggunakan Porter Stemmer untuk Inggris
 * Menggunakan custom stemmer untuk Indonesia
 */
export const stemmingProcess = (tokens) => {
    const stemmedTokens = tokens.map(token => {
        // Coba stem dengan stemmer Indonesia jika hasilnya berbeda
        const stemmedID = stemIndonesian(token);
        const stemmedEN = stemmerEN.stem(token);

        // Pilih hasil yang lebih pendek (lebih mungkin bentuk dasar)
        // Tapi harus minimal 2 karakter
        if (stemmedID.length >= 2 && stemmedID.length < token.length) {
            return stemmedID;
        } else if (stemmedEN.length >= 2 && stemmedEN.length < token.length) {
            return stemmedEN;
        }
        return token;
    });

    // Buat mapping untuk melihat perubahan
    const mapping = {};
    tokens.forEach((original, index) => {
        if (original !== stemmedTokens[index]) {
            mapping[original] = stemmedTokens[index];
        }
    });

    return {
        step: "4. STEMMING (Bilingual: EN Porter + ID)",
        before: tokens,
        after: stemmedTokens,
        mapping: mapping,
        changedCount: Object.keys(mapping).length,
        explanation: "Mengubah kata ke bentuk dasarnya. EN: 'programming' → 'program'. ID: 'membangun' → 'bangun', 'pengembangan' → 'kembang'"
    };
};

// End region Triana

/**
 * =====================================================
 * FUNGSI UTAMA: PROSES SEMUA TAHAPAN
 * =====================================================
 */
export const fullPreprocessing = (text) => {
    // Tahap 1: Lexical Analysis
    const lexicalResult = lexicalAnalysis(text);

    // Tahap 2: Stopword Removal (Bilingual)
    const stopwordResult = stopwordRemoval(lexicalResult.tokens);

    // Tahap 3: Phrase Detection
    const phraseResult = phraseDetection(stopwordResult.after);

    // Tahap 4: Stemming (Bilingual)
    const stemmingResult = stemmingProcess(stopwordResult.after);

    return {
        preprocessing: {
            lexicalAnalysis: lexicalResult,
            stopwordRemoval: stopwordResult,
            phraseDetection: phraseResult,
            stemming: stemmingResult
        },
        finalTokens: stemmingResult.after.join(' '),
        summary: {
            originalText: text,
            originalWordCount: lexicalResult.tokenCount,
            afterStopwordRemoval: stopwordResult.after.length,
            finalTokenCount: stemmingResult.after.length,
            wordsRemoved: lexicalResult.tokenCount - stemmingResult.after.length
        }
    };
};

