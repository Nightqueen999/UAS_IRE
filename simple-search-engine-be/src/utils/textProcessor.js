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
import { removeStopwords, eng, ind } from "stopword";
import { Stemmer as StemmerSastrawi } from "sastrawijs";

// Menggunakan PorterStemmer untuk stemming Bahasa Inggris
const stemmerEN = natural.PorterStemmer;

// Menggunakan Sastrawi untuk stemming Bahasa Indonesia (Algoritma Nazief-Adriani)
const stemmerID = new StemmerSastrawi();

/**
 * Stemmer Bahasa Indonesia menggunakan Sastrawi (Algoritma Nazief-Adriani)
 * Lebih akurat dibanding rule-based sederhana
 */
const stemIndonesian = (word) => {
    return stemmerID.stem(word.toLowerCase());
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

    // Gabungkan stopwords Inggris dan Indonesia dari library
    const combinedStopwords = [...eng, ...ind];

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
        step: "4. STEMMING (Bilingual: EN Porter + ID Sastrawi)",
        before: tokens,
        after: stemmedTokens,
        mapping: mapping,
        changedCount: Object.keys(mapping).length,
        explanation: "Mengubah kata ke bentuk dasarnya. EN: Porter Stemmer. ID: Sastrawi (Algoritma Nazief-Adriani). Contoh: 'membangun' → 'bangun', 'pembelajaran' → 'ajar'"
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

