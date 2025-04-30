const pdf = require('pdf-parse');
const { PDFDocument } = require('pdf-lib');


const scoringRules = {
    // Rule 1: Memiliki ringkasan profil (20 poin)
    hasProfileSummary: (text) => {
        const keywords = ['profil', 'ringkasan', 'tentang saya', 'summary', 'about me'];
        return keywords.some(keyword => text.toLowerCase().includes(keyword)) ? 20 : 0;
    },

    // Rule 2: Panjang CV (20 poin)
    checkCVLength: async (buffer) => {
        try {
            const data = await pdf(buffer);
            return data.numpages > 1 ? 20 : 0; // Tambahkan 20 poin jika halaman > 2
        } catch (error) {
            console.error('Error checking CV length:', error);
            return 0;
        }
    },

    // Rule 3: Memiliki skill (15 poin)
    hasSkills: (text) => {
        const keywords = ['skills', 'keahlian', 'kemampuan', 'keterampilan', 'technical skills', 'kompetensi', 'competencies'];
        return keywords.some(keyword => text.toLowerCase().includes(keyword)) ? 15 : 0;
    },

    // Rule 4: Format dan struktur (15 poin)
    checkFormat: (text) => {
        let score = 0;

        // Cek kontak informasi
        if (/email|telepon|phone|alamat|address/i.test(text)) score += 5;

        // Cek pengalaman kerja
        if (/pengalaman|kerja|experience|work/i.test(text)) score += 5;

        // Cek pendidikan
        if (/pendidikan|education|gelar|sarjana/i.test(text)) score += 5;

        return score; // Maksimal 15 poin
    },

    // Rule 5: Kata kunci penting (20 poin)
    checkKeywords: (text) => {
        const importantKeywords = [
            'project', 'proyek', 'achievement', 'prestasi',
            'leadership', 'kepemimpinan', 'certification', 'sertifikasi',
            'teamwork', 'collaboration', 'problem solving', 'critical thinking',
            'management', 'analysis', 'communication', 'innovation',
            'research', 'development', 'training', 'mentoring',
            'planning', 'strategy', 'design', 'implementation'
        ];

        const matches = importantKeywords.filter(keyword =>
            text.toLowerCase().includes(keyword)
        );

        return Math.min(matches.length * 2, 20); // Maksimal 20 poin
    },

    // Rule 6: Kontak profesional (10 poin)
    checkProfessionalContacts: (text) => {
        let score = 0;
        if (/linkedin\.com/i.test(text)) score += 5;
        if (/github\.com/i.test(text)) score += 5;
        if (/portfolio|portofolio/i.test(text)) score += 5;
        return Math.min(score, 10); // Maksimal 10 poin
    }
};


const repairPDF = async (pdfBuffer) => {
    try {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const repairedBuffer = await pdfDoc.save();
        return repairedBuffer;
    } catch (error) {
        console.error('Error repairing PDF:', error.message);
        throw new Error('Gagal memperbaiki file PDF.');
    }
};

const scoreCV = async (pdfBuffer) => {
    try {
        // Perbaiki file PDF sebelum diproses
        const repairedBuffer = await repairPDF(pdfBuffer);

        const data = await pdf(repairedBuffer);
        const text = data.text;

        const scores = {
            profileSummary: scoringRules.hasProfileSummary(text),
            cvLength: await scoringRules.checkCVLength(repairedBuffer),
            skills: scoringRules.hasSkills(text),
            format: scoringRules.checkFormat(text),
            keywords: scoringRules.checkKeywords(text),
            professionalContacts: scoringRules.checkProfessionalContacts(text)
        };

        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

        return {
            scores,
            totalScore,
            details: {
                pageCount: data.numpages,
                wordCount: text.split(/\s+/).length,
            }
        };
    } catch (error) {
        console.error('Error scoring CV:', error.message);
        throw new Error(`Error scoring CV: ${error.message}`);
    }
};
module.exports = { scoreCV };