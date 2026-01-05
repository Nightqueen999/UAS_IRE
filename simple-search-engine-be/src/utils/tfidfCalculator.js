/**
 * =====================================================
 * FILE: tfidfCalculator.js
 * =====================================================
 * Modul untuk menghitung TF-IDF dan Cosine Similarity secara manual
 * dengan output detail untuk keperluan edukasi.
 * 
 * RUMUS:
 * - TF(t,d) = jumlah kemunculan term t dalam dokumen d / total kata dalam d
 * - IDF(t) = log(N / df(t)) dimana N = total dokumen, df(t) = jumlah dokumen yang mengandung t
 * - TF-IDF(t,d) = TF(t,d) × IDF(t)
 * - Cosine Similarity = (A·B) / (||A|| × ||B||)
 * =====================================================
 */

/**
 * =====================================================
 * FUNGSI: Menghitung Term Frequency (TF)
 * =====================================================
 * TF = jumlah kemunculan kata dalam dokumen / total kata dalam dokumen
 * 
 * Contoh: Dokumen "java java python"
 * TF(java) = 2/3 = 0.667
 * TF(python) = 1/3 = 0.333
 */
export const calculateTF = (tokens) => {
    const tf = {};
    const totalTokens = tokens.length;

    // Hitung frekuensi setiap token
    tokens.forEach(token => {
        tf[token] = (tf[token] || 0) + 1;
    });

    // Normalisasi dengan total token
    const normalizedTF = {};
    Object.keys(tf).forEach(term => {
        normalizedTF[term] = {
            count: tf[term],
            tf: tf[term] / totalTokens,
            calculation: `${tf[term]} / ${totalTokens} = ${(tf[term] / totalTokens).toFixed(4)}`
        };
    });

    return {
        step: "TERM FREQUENCY (TF)",
        totalTokens: totalTokens,
        rawFrequency: tf,
        normalizedTF: normalizedTF,
        explanation: "TF = jumlah kemunculan kata dalam dokumen / total kata dalam dokumen"
    };
};

/**
 * =====================================================
 * FUNGSI: Menghitung Inverse Document Frequency (IDF)
 * =====================================================
 * IDF = log(N / df) dimana:
 * - N = total jumlah dokumen
 * - df = jumlah dokumen yang mengandung term tersebut
 * 
 * IDF tinggi = kata jarang muncul (lebih unik)
 * IDF rendah = kata sering muncul di banyak dokumen
 */
export const calculateIDF = (allDocumentTokens) => {
    const N = allDocumentTokens.length; // Total dokumen
    const documentFrequency = {}; // Jumlah dokumen yang mengandung setiap term

    // Hitung document frequency untuk setiap term
    allDocumentTokens.forEach((docTokens, docIndex) => {
        const uniqueTerms = [...new Set(docTokens)]; // Ambil term unik per dokumen
        uniqueTerms.forEach(term => {
            if (!documentFrequency[term]) {
                documentFrequency[term] = { count: 0, documents: [] };
            }
            documentFrequency[term].count++;
            documentFrequency[term].documents.push(docIndex + 1);
        });
    });

    // Hitung IDF untuk setiap term
    const idf = {};
    Object.keys(documentFrequency).forEach(term => {
        const df = documentFrequency[term].count;
        const idfValue = Math.log10(N / df);
        idf[term] = {
            documentFrequency: df,
            documentsContaining: documentFrequency[term].documents,
            idf: idfValue,
            calculation: `log10(${N} / ${df}) = ${idfValue.toFixed(4)}`
        };
    });

    return {
        step: "INVERSE DOCUMENT FREQUENCY (IDF)",
        totalDocuments: N,
        documentFrequency: documentFrequency,
        idf: idf,
        explanation: "IDF = log(N / df). Kata yang muncul di sedikit dokumen memiliki IDF tinggi (lebih penting)"
    };
};

/**
 * =====================================================
 * FUNGSI: Menghitung TF-IDF Matrix
 * =====================================================
 * TF-IDF = TF × IDF
 * 
 * Menghasilkan matrix bobot untuk setiap term di setiap dokumen
 */
export const calculateTFIDF = (allDocumentTokens, documentTitles) => {
    // Hitung IDF untuk semua term
    const idfResult = calculateIDF(allDocumentTokens);

    // Hitung TF-IDF untuk setiap dokumen
    const tfidfMatrix = allDocumentTokens.map((docTokens, docIndex) => {
        const tfResult = calculateTF(docTokens);
        const docTFIDF = {};

        Object.keys(tfResult.normalizedTF).forEach(term => {
            const tf = tfResult.normalizedTF[term].tf;
            const idf = idfResult.idf[term]?.idf || 0;
            const tfidf = tf * idf;

            docTFIDF[term] = {
                tf: tf,
                idf: idf,
                tfidf: tfidf,
                calculation: `${tf.toFixed(4)} × ${idf.toFixed(4)} = ${tfidf.toFixed(4)}`
            };
        });

        return {
            docId: docIndex + 1,
            title: documentTitles[docIndex] || `Document ${docIndex + 1}`,
            tfDetails: tfResult,
            tfidfWeights: docTFIDF
        };
    });

    // Buat ringkasan matrix dalam format tabel
    const allTerms = [...new Set(allDocumentTokens.flat())].sort();
    const matrixSummary = {
        terms: allTerms.slice(0, 20), // Batasi 20 term untuk readability
        documents: tfidfMatrix.map(doc => ({
            docId: doc.docId,
            title: doc.title,
            weights: {}
        }))
    };

    // Fill matrix values
    matrixSummary.documents.forEach((doc, docIndex) => {
        matrixSummary.terms.forEach(term => {
            doc.weights[term] = tfidfMatrix[docIndex].tfidfWeights[term]?.tfidf.toFixed(4) || "0.0000";
        });
    });

    return {
        step: "TF-IDF MATRIX",
        idfDetails: idfResult,
        documentDetails: tfidfMatrix,
        matrixSummary: matrixSummary,
        explanation: "TF-IDF = TF × IDF. Bobot tinggi = kata penting dalam dokumen tersebut dan jarang di dokumen lain"
    };
};

/**
 * =====================================================
 * FUNGSI: Menghitung Cosine Similarity
 * =====================================================
 * Cosine Similarity = (A·B) / (||A|| × ||B||)
 * 
 * - A·B = dot product dari vector A dan B
 * - ||A|| = magnitude (panjang) vector A
 * - ||B|| = magnitude (panjang) vector B
 * 
 * Hasil: 0 = tidak mirip, 1 = sangat mirip
 */
export const calculateCosineSimilarity = (queryTokens, allDocumentTokens, documentTitles) => {
    // Dapatkan semua term unik
    const allTerms = [...new Set([...queryTokens, ...allDocumentTokens.flat()])];

    // Buat vector untuk query
    const queryVector = allTerms.map(term => {
        return queryTokens.filter(t => t === term).length / queryTokens.length;
    });

    // Hitung similarity untuk setiap dokumen
    const results = allDocumentTokens.map((docTokens, docIndex) => {
        // Buat vector untuk dokumen
        const docVector = allTerms.map(term => {
            return docTokens.filter(t => t === term).length / docTokens.length;
        });

        // Hitung dot product
        let dotProduct = 0;
        for (let i = 0; i < allTerms.length; i++) {
            dotProduct += queryVector[i] * docVector[i];
        }

        // Hitung magnitude query
        const magnitudeQuery = Math.sqrt(queryVector.reduce((sum, val) => sum + val * val, 0));

        // Hitung magnitude document
        const magnitudeDoc = Math.sqrt(docVector.reduce((sum, val) => sum + val * val, 0));

        // Hitung cosine similarity
        const cosineSim = (magnitudeQuery * magnitudeDoc) === 0
            ? 0
            : dotProduct / (magnitudeQuery * magnitudeDoc);

        return {
            docId: docIndex + 1,
            title: documentTitles[docIndex] || `Document ${docIndex + 1}`,
            documentVector: docVector.slice(0, 10).map(v => v.toFixed(4)), // Batasi untuk readability
            dotProduct: dotProduct.toFixed(4),
            magnitudeQuery: magnitudeQuery.toFixed(4),
            magnitudeDoc: magnitudeDoc.toFixed(4),
            cosineSimilarity: cosineSim.toFixed(4),
            calculation: `(${dotProduct.toFixed(4)}) / (${magnitudeQuery.toFixed(4)} × ${magnitudeDoc.toFixed(4)}) = ${cosineSim.toFixed(4)}`
        };
    });

    // Sort by similarity score
    const ranking = results
        .sort((a, b) => parseFloat(b.cosineSimilarity) - parseFloat(a.cosineSimilarity))
        .map((r, index) => ({
            rank: index + 1,
            docId: r.docId,
            title: r.title,
            score: r.cosineSimilarity
        }));

    return {
        step: "COSINE SIMILARITY",
        query: queryTokens.join(' '),
        queryVector: queryVector.slice(0, 10).map(v => v.toFixed(4)), // Batasi untuk readability
        termsUsed: allTerms.slice(0, 10),
        documentResults: results,
        ranking: ranking,
        formula: "Cosine Similarity = (A·B) / (||A|| × ||B||)",
        explanation: "Mengukur sudut antara vector query dan document. Nilai 1 = identik, 0 = tidak ada kesamaan"
    };
};
