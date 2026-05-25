import { useState, useRef, useCallback } from 'react';
import { reportTemplates } from '../data/dssData';
import { pittiSummary } from '../data/pittiOverlap';
import { hguSummary } from '../data/hguSawit';
import { iupSummary } from '../data/iupMinerba';
import { psnSummary } from '../data/psnPapuaData';
import { sentimentSummary } from '../data/socialIncidentsData';
import { hotspotSummary } from '../data/hotspotData';

// ── Section metadata for each template ──
const sectionMeta = {
  peta_overlap: { label: 'Peta Tumpang Tindih', icon: '🗺️' },
  tabel_konflik: { label: 'Tabel Konflik Spasial', icon: '📋' },
  rekomendasi_dss: { label: 'Rekomendasi DSS Engine', icon: '🤖' },
  timeline_berita: { label: 'Timeline Berita Terkait', icon: '📰' },
  skor_kepatuhan: { label: 'Skor Kepatuhan ISPO/RSPO', icon: '✅' },
  change_detection: { label: 'Change Detection Satelit', icon: '🛰️' },
  hotspot_karhutla: { label: 'Hotspot Karhutla', icon: '🔥' },
  sensor_gambut: { label: 'Sensor IoT Gambut', icon: '💧' },
  kpi_psn: { label: 'KPI Progres PSN', icon: '📊' },
  peta_klaster: { label: 'Peta Klaster Food Estate', icon: '🗺️' },
  produksi_komoditas: { label: 'Produksi Komoditas', icon: '🌾' },
  infrastruktur: { label: 'Status Infrastruktur', icon: '🏗️' },
  sentimen_analisis: { label: 'Analisis Sentimen NLP', icon: '🧠' },
  peta_konflik: { label: 'Peta Konflik Sosial', icon: '⚔️' },
  entity_suku: { label: 'Entity Extraction Suku', icon: '🏘️' },
  rekomendasi: { label: 'Rekomendasi Kebijakan', icon: '📌' },
  overview_nasional: { label: 'Overview Nasional', icon: '🇮🇩' },
  focus_papua: { label: 'Fokus Papua Selatan', icon: '📍' },
  dss_scoring: { label: 'DSS Scoring AHP', icon: '🎯' },
  rekomendasi_kebijakan: { label: 'Rekomendasi Kebijakan', icon: '📌' },
};

const timeRanges = [
  { id: '7d', label: '7 Hari Terakhir' },
  { id: '30d', label: '30 Hari Terakhir' },
  { id: '90d', label: '90 Hari Terakhir' },
  { id: '6m', label: '6 Bulan Terakhir' },
  { id: '1y', label: '1 Tahun Terakhir' },
  { id: 'custom', label: 'Kustom' },
];

const regions = [
  { id: 'papua_selatan', label: 'Papua Selatan' },
  { id: 'nasional', label: 'Nasional' },
];

// ── Generate realistic content for each section ──
function generateSectionContent(sectionId, region) {
  const isPapua = region === 'papua_selatan';
  const regionLabel = isPapua ? 'Papua Selatan' : 'Nasional';

  const contents = {
    peta_overlap: () => ({
      title: 'Peta Tumpang Tindih Izin',
      stats: [
        { label: 'Total Overlap', value: isPapua ? pittiSummary.totalOverlapPapuaSelatan.toLocaleString() : pittiSummary.totalOverlapNasional.toLocaleString(), unit: 'kasus' },
        { label: 'Total Luas', value: isPapua ? pittiSummary.totalLuasOverlapPapua.toLocaleString() : (pittiSummary.totalLuasOverlap / 1000).toFixed(0) + 'K', unit: 'ha' },
      ],
      body: `Berdasarkan analisis spasial Cross-DSS terhadap data PITTI OneMap BIG, teridentifikasi ${isPapua ? pittiSummary.totalOverlapPapuaSelatan : pittiSummary.totalOverlapNasional} kasus tumpang tindih izin di wilayah ${regionLabel}. Overlap severity CRITICAL mencapai ${pittiSummary.perSeverity.critical.count.toLocaleString()} kasus secara nasional dengan luas total ${(pittiSummary.perSeverity.critical.luasHa / 1000).toFixed(0)}K hektare.`,
      details: pittiSummary.perTipeKonflik.map(t => `• ${t.type}: ${t.count.toLocaleString()} kasus (${t.luasHa.toLocaleString()} ha) — ${t.persen}%`),
    }),
    tabel_konflik: () => ({
      title: 'Tabel Konflik Spasial',
      stats: [
        { label: 'Tipe Konflik', value: pittiSummary.perTipeKonflik.length, unit: 'jenis' },
        { label: 'Severity CRITICAL', value: pittiSummary.perSeverity.critical.count.toLocaleString(), unit: 'kasus' },
      ],
      body: `Distribusi konflik spasial berdasarkan tipe di wilayah ${regionLabel}. Konflik terbesar: HGU vs Kawasan Hutan (${pittiSummary.perTipeKonflik[0].persen}%), diikuti HGU vs IUP (${pittiSummary.perTipeKonflik[1].persen}%) dan IUP vs Kawasan Hutan (${pittiSummary.perTipeKonflik[2].persen}%).`,
      details: pittiSummary.trendBulanan.map(t => `• ${t.bulan}: +${t.baru} kasus baru, ${t.selesai} terselesaikan`),
    }),
    rekomendasi_dss: () => ({
      title: 'Rekomendasi DSS Engine',
      stats: [
        { label: 'Zona Evaluasi', value: '5', unit: 'zona' },
        { label: 'Risiko Kritis', value: '2', unit: 'zona' },
      ],
      body: `DSS Engine Cross-DSS dengan metode AHP menghasilkan rekomendasi untuk 5 zona evaluasi di ${regionLabel}. 2 zona mendapat rekomendasi HENTIKAN & EVALUASI, 2 zona REVISI ZONASI, dan 1 zona LANJUTKAN.`,
      details: [
        '• ZONE-BDG-001: IUP Kuarsa vs Hutan Ulayat Awyu — HENTIKAN & EVALUASI (Sustainability Score: 0.22)',
        '• ZONE-MRK-001: HGU Sawit vs Food Estate — REVISI ZONASI (Sustainability Score: 0.38)',
        '• ZONE-MPP-001: IUP Nikel vs Kawasan Hutan — REVISI ZONASI (Sustainability Score: 0.42)',
        '• ZONE-MRK-002: Tebu vs Hutan Sagu — LANJUTKAN DENGAN MITIGASI (Score: 0.55)',
        '• ZONE-MRK-003: Peternakan Sapi Terpadu — LANJUTKAN (Score: 0.78)',
      ],
    }),
    timeline_berita: () => ({
      title: 'Timeline Berita Terkait',
      stats: [
        { label: 'Total Berita', value: sentimentSummary.total, unit: 'artikel' },
        { label: 'Sentimen Negatif', value: sentimentSummary.negatif, unit: 'artikel' },
      ],
      body: `Hasil crawling NLP mendeteksi ${sentimentSummary.total} berita terkait ${regionLabel} dalam periode laporan. Sentimen rata-rata: ${sentimentSummary.avgScore.toFixed(2)} (negatif). ${sentimentSummary.negatif} dari ${sentimentSummary.total} berita bernada negatif, dominan terkait konflik agraria dan sengketa ulayat.`,
      details: [
        '• 22 Mei 2026: Unjuk Rasa Suku Marind — Sentimen: -0.965 (CRITICAL)',
        '• 20 Mei 2026: Gugatan Suku Awyu ke PTUN — Sentimen: -0.89 (HIGH)',
        '• 15 Mei 2026: Deforestasi 2.800 Ha Terdeteksi — Sentimen: -0.92 (CRITICAL)',
        '• 18 Mei 2026: Progres Cetak Sawah 42.000 Ha — Sentimen: +0.78 (POSITIVE)',
        '• 12 Mei 2026: Pabrik Gula Rampung 45% — Sentimen: +0.82 (POSITIVE)',
      ],
    }),
    skor_kepatuhan: () => ({
      title: 'Skor Kepatuhan Lingkungan',
      stats: [
        { label: 'RSPO Certified', value: hguSummary.sertifikasi.rspo.toLocaleString(), unit: 'HGU' },
        { label: 'ISPO Certified', value: hguSummary.sertifikasi.ispo.toLocaleString(), unit: 'HGU' },
        { label: 'Belum Sertifikasi', value: hguSummary.sertifikasi.belum.toLocaleString(), unit: 'HGU' },
      ],
      body: `Dari total ${hguSummary.totalNasional.toLocaleString()} HGU nasional, ${hguSummary.sertifikasi.rspo} memiliki sertifikasi RSPO dan ${hguSummary.sertifikasi.ispo.toLocaleString()} bersertifikasi ISPO. Masih terdapat ${hguSummary.sertifikasi.belum} HGU tanpa sertifikasi kepatuhan lingkungan.`,
      details: [
        `• Papua Selatan: ${hguSummary.totalPapuaSelatan} HGU — 2 ISPO, 1 RSPO, 3 Belum Sertifikasi`,
        `• Total luas HGU bersertifikasi: ~${((hguSummary.sertifikasi.rspo + hguSummary.sertifikasi.ispo) / hguSummary.totalNasional * 100).toFixed(1)}% dari total`,
        '• Rekomendasi: Percepat sertifikasi ISPO untuk 705 HGU yang belum tersertifikasi',
      ],
    }),
    change_detection: () => ({
      title: 'Change Detection Satelit',
      stats: [
        { label: 'Deteksi', value: '4', unit: 'area' },
        { label: 'Kritis', value: '2', unit: 'area' },
      ],
      body: 'Sistem change detection berbasis citra Sentinel-2 dan Landsat-9 mendeteksi 4 perubahan signifikan di area pemantauan. 2 deteksi berkategori CRITICAL terkait pembukaan lahan tanpa izin.',
      details: [
        '• CD-001: Pembukaan hutan 450 ha di luar batas HGU — CRITICAL (Confidence: 94%)',
        '• CD-003: Clearing 180 ha melampaui AMDAL — CRITICAL (Confidence: 91%)',
        '• CD-002: Ekspansi HGU 280 ha (terverifikasi) — LOW',
        '• CD-004: Konstruksi feedlot 1.200 ha (sesuai rencana) — INFO',
      ],
    }),
    hotspot_karhutla: () => ({
      title: 'Hotspot Kebakaran Hutan & Lahan',
      stats: [
        { label: 'Hotspot 24 Jam', value: hotspotSummary.total24Jam, unit: 'titik' },
        { label: 'Dalam Konsesi', value: hotspotSummary.totalDalamKonsesi, unit: 'titik' },
        { label: 'High Confidence', value: hotspotSummary.highConfidence, unit: 'titik' },
      ],
      body: `Terdeteksi ${hotspotSummary.total24Jam} titik panas dalam 24 jam terakhir berdasarkan data MODIS/VIIRS NASA FIRMS. ${hotspotSummary.totalDalamKonsesi} titik berada dalam area konsesi, ${hotspotSummary.totalDiluarKonsesi} di luar konsesi.`,
      details: hotspotSummary.perProvinsi.map(p => `• ${p.province}: ${p.count} hotspot`),
    }),
    sensor_gambut: () => ({
      title: 'Sensor IoT Muka Air Gambut',
      stats: [
        { label: 'Total Sensor', value: hotspotSummary.sensorGambut.total, unit: 'unit' },
        { label: 'Status Normal', value: hotspotSummary.sensorGambut.normal, unit: 'unit' },
        { label: 'Status CRITICAL', value: hotspotSummary.sensorGambut.critical, unit: 'unit' },
      ],
      body: `Jaringan ${hotspotSummary.sensorGambut.total} sensor IoT muka air gambut menunjukkan ${hotspotSummary.sensorGambut.critical} sensor dalam status CRITICAL (muka air <-40cm). ${hotspotSummary.sensorGambut.warning} sensor dalam status WARNING, memerlukan perhatian.`,
      details: [
        '• PWT-MRK-003 (Gambut Animha): -45cm — CRITICAL (Trend: Menurun)',
        '• PWT-BDG-001 (Boven Digoel): -42cm — CRITICAL (Trend: Menurun)',
        '• PWT-MRK-002 (Wanam Selatan): -38cm — WARNING (Trend: Menurun)',
        '• PWT-RIA-001 (Siak Riau): -35cm — WARNING (Trend: Menurun)',
      ],
    }),
    kpi_psn: () => ({
      title: 'KPI Progres PSN Food Estate',
      stats: [
        { label: 'Total Klaster', value: psnSummary.totalKlaster, unit: 'klaster' },
        { label: 'Realisasi Luas', value: psnSummary.realisasiTotal.toLocaleString(), unit: 'ha' },
        { label: 'Progress', value: psnSummary.progressTotal.toFixed(1), unit: '%' },
      ],
      body: `PSN Food Estate Papua Selatan terdiri dari ${psnSummary.totalKlaster} klaster dengan target total ${psnSummary.targetLuasTotal.toLocaleString()} hektare. Realisasi saat ini ${psnSummary.realisasiTotal.toLocaleString()} ha (${psnSummary.progressTotal.toFixed(1)}%).`,
      details: [
        `• Padi: ${psnSummary.perKomoditas.padi.klaster} klaster — ${psnSummary.perKomoditas.padi.realisasiHa.toLocaleString()} / ${psnSummary.perKomoditas.padi.targetHa.toLocaleString()} ha`,
        `• Tebu: ${psnSummary.perKomoditas.tebu.klaster} klaster — ${psnSummary.perKomoditas.tebu.realisasiHa.toLocaleString()} / ${psnSummary.perKomoditas.tebu.targetHa.toLocaleString()} ha`,
        `• Sapi: ${psnSummary.perKomoditas.sapi.klaster} klaster — ${psnSummary.perKomoditas.sapi.realisasiHa.toLocaleString()} / ${psnSummary.perKomoditas.sapi.targetHa.toLocaleString()} ha`,
      ],
    }),
    peta_klaster: () => ({
      title: 'Peta Klaster Food Estate',
      stats: [
        { label: 'Klaster Aktif', value: '3', unit: 'klaster' },
        { label: 'POI Terpetakan', value: psnSummary.totalPOI, unit: 'titik' },
      ],
      body: `Peta spasial ${psnSummary.totalKlaster} klaster PSN menampilkan distribusi area pertanian, perkebunan, dan peternakan di Kabupaten Merauke. Total ${psnSummary.totalPOI} POI terpetakan mencakup infrastruktur logistik, produksi, dan wilayah adat.`,
      details: Object.entries(psnSummary.perKategoriPOI).map(([k, v]) => `• ${k}: ${v} lokasi`),
    }),
    produksi_komoditas: () => ({
      title: 'Produksi Komoditas',
      stats: [
        { label: 'Padi Realisasi', value: (psnSummary.perKomoditas.padi.realisasiTon / 1000).toFixed(0) + 'K', unit: 'ton' },
        { label: 'Tebu Realisasi', value: (psnSummary.perKomoditas.tebu.realisasiTon / 1e6).toFixed(1) + 'M', unit: 'ton' },
        { label: 'Sapi Populasi', value: psnSummary.perKomoditas.sapi.realisasiPopulasi?.toLocaleString() || '85.000', unit: 'ekor' },
      ],
      body: `Capaian produksi komoditas PSN Papua Selatan: Padi ${psnSummary.perKomoditas.padi.realisasiTon.toLocaleString()} ton dari target ${psnSummary.perKomoditas.padi.targetTon.toLocaleString()} ton, Tebu ${psnSummary.perKomoditas.tebu.realisasiTon.toLocaleString()} ton dari target ${psnSummary.perKomoditas.tebu.targetTon.toLocaleString()} ton.`,
      details: [
        `• Gap Padi: ${((1 - psnSummary.perKomoditas.padi.realisasiTon / psnSummary.perKomoditas.padi.targetTon) * 100).toFixed(1)}% dari target`,
        `• Gap Tebu: ${((1 - psnSummary.perKomoditas.tebu.realisasiTon / psnSummary.perKomoditas.tebu.targetTon) * 100).toFixed(1)}% dari target`,
        '• Prediksi 2027: Padi 756.000 ton, Tebu 4.800.000 ton',
      ],
    }),
    infrastruktur: () => ({
      title: 'Status Infrastruktur',
      stats: [
        { label: 'POI Infrastruktur', value: psnSummary.perKategoriPOI.INFRASTRUKTUR, unit: 'lokasi' },
        { label: 'POI Logistik', value: psnSummary.perKategoriPOI.LOGISTIK, unit: 'lokasi' },
      ],
      body: 'Pembangunan infrastruktur pendukung PSN meliputi bandara, pembangkit listrik, bendungan irigasi, pelabuhan, dan jalur Trans-Papua. Progres konstruksi bervariasi antara 45% hingga 72%.',
      details: [
        '• Bendungan Irigasi Wanam: Konstruksi 72% — target 120 Juta m³',
        '• Trans-Papua Merauke-Boven Digoel: 68% — 420 km',
        '• Pabrik Gula Merauke I: 45% — 12.000 TCD',
        '• PLTU Merauke 2x25MW: Operasional',
      ],
    }),
    sentimen_analisis: () => ({
      title: 'Analisis Sentimen NLP',
      stats: [
        { label: 'Positif', value: sentimentSummary.positif, unit: 'artikel' },
        { label: 'Negatif', value: sentimentSummary.negatif, unit: 'artikel' },
        { label: 'Skor Rata-rata', value: sentimentSummary.avgScore.toFixed(2), unit: '' },
      ],
      body: `Engine NLP Cross-DSS memproses ${sentimentSummary.total} artikel berita. Sentimen rata-rata ${sentimentSummary.avgScore.toFixed(2)} menunjukkan dominasi pemberitaan negatif terkait konflik lahan dan sengketa masyarakat adat.`,
      details: [
        '• Keyword dominan: food estate (45x), kelapa sawit (42x), tumpang tindih (38x)',
        '• Suku paling banyak disebut: Suku Marind (35x), Suku Awyu (14x)',
        '• Sentimen negatif tertinggi: konflik agraria, sengketa ulayat',
        '• Sentimen positif: progres food estate, kebijakan moratorium',
      ],
    }),
    peta_konflik: () => ({
      title: 'Peta Konflik Sosial',
      stats: [
        { label: 'Titik Konflik', value: '7', unit: 'lokasi' },
        { label: 'Suku Terdampak', value: psnSummary.sukuTerdampak.length, unit: 'suku' },
      ],
      body: `Peta konflik sosial menampilkan 7 titik konflik aktif di ${regionLabel}. ${psnSummary.sukuTerdampak.length} suku terdampak langsung: ${psnSummary.sukuTerdampak.join(', ')}. Konflik tertinggi di Kabupaten Merauke dan Boven Digoel.`,
      details: psnSummary.sukuTerdampak.map(s => `• Suku ${s}: Wilayah ulayat terdampak konsesi`),
    }),
    entity_suku: () => ({
      title: 'Entity Extraction — Suku & Masyarakat Adat',
      stats: [
        { label: 'Wilayah Adat', value: psnSummary.totalWilayahAdat, unit: 'wilayah' },
        { label: 'Suku Teridentifikasi', value: psnSummary.sukuTerdampak.length, unit: 'suku' },
      ],
      body: `NLP Entity Extraction mengidentifikasi ${psnSummary.sukuTerdampak.length} suku adat yang terdampak aktivitas PSN dan konsesi di ${regionLabel}. Total ${psnSummary.totalWilayahAdat} wilayah adat terverifikasi.`,
      details: [
        '• Suku Marind — Wilayah: Merauke (Diakui BPN) — 45.000 ha',
        '• Suku Yei — Wilayah: Merauke (Dalam Proses) — 28.000 ha',
        '• Suku Awyu — Wilayah: Boven Digoel (Sengketa) — 52.000 ha',
        '• Suku Muyu — Wilayah: Boven Digoel (Diakui) — 38.000 ha',
      ],
    }),
    rekomendasi: () => ({
      title: 'Rekomendasi Kebijakan',
      stats: [
        { label: 'Rekomendasi', value: '6', unit: 'butir' },
        { label: 'Prioritas Tinggi', value: '3', unit: 'butir' },
      ],
      body: 'Berdasarkan analisis komprehensif Cross-DSS, dirumuskan rekomendasi kebijakan untuk penyelesaian konflik sektoral:',
      details: [
        '1. Percepat mediasi HGU vs IUP di Distrik Wanam melalui Tim Terpadu Kementerian',
        '2. Cabut IUP PT. Digoel Mining Corp yang melanggar hak ulayat Suku Awyu',
        '3. Perluas buffer zone 2km antara konsesi dan kawasan rawa sagu komunal',
        '4. Sertifikasi ISPO wajib bagi seluruh HGU di Papua Selatan',
        '5. Perkuat sistem monitoring satelit real-time untuk change detection',
        '6. Libatkan BRIDA Papua Selatan dalam setiap evaluasi zonasi PSN',
      ],
    }),
    overview_nasional: () => ({
      title: 'Overview Nasional',
      stats: [
        { label: 'Total HGU', value: hguSummary.totalNasional.toLocaleString(), unit: 'unit' },
        { label: 'Total IUP', value: iupSummary.totalNasional.toLocaleString(), unit: 'unit' },
        { label: 'Overlap', value: pittiSummary.totalOverlapNasional.toLocaleString(), unit: 'kasus' },
      ],
      body: `Indonesia memiliki ${hguSummary.totalNasional.toLocaleString()} HGU kelapa sawit dengan luas total ${(hguSummary.totalLuasNasional / 1e6).toFixed(1)} juta ha dan ${iupSummary.totalNasional.toLocaleString()} IUP tambang seluas ${(iupSummary.totalLuasNasional / 1e6).toFixed(1)} juta ha. Produksi CPO nasional ${(hguSummary.totalProduksiCPO / 1e6).toFixed(1)} juta ton.`,
      details: hguSummary.perProvinsi.slice(0, 5).map(p => `• ${p.name}: ${p.count} HGU — ${p.luasHa.toLocaleString()} ha — CPO: ${p.cpoTon.toLocaleString()} ton`),
    }),
    focus_papua: () => ({
      title: 'Fokus Papua Selatan',
      stats: [
        { label: 'HGU Sawit', value: hguSummary.totalPapuaSelatan, unit: 'unit' },
        { label: 'IUP Tambang', value: iupSummary.totalPapuaSelatan, unit: 'unit' },
        { label: 'Luas HGU', value: hguSummary.totalLuasPapuaSelatan.toLocaleString(), unit: 'ha' },
      ],
      body: `Papua Selatan memiliki ${hguSummary.totalPapuaSelatan} HGU kelapa sawit (${hguSummary.totalLuasPapuaSelatan.toLocaleString()} ha) dan ${iupSummary.totalPapuaSelatan} IUP tambang (${iupSummary.totalLuasPapuaSelatan.toLocaleString()} ha). Wilayah ini menjadi fokus evaluasi Cross-DSS karena kompleksitas konflik multi-sektoral.`,
      details: [
        `• HGU: ${hguSummary.totalPapuaSelatan} unit — ${hguSummary.totalLuasPapuaSelatan.toLocaleString()} ha`,
        `• IUP: ${iupSummary.totalPapuaSelatan} unit — ${iupSummary.totalLuasPapuaSelatan.toLocaleString()} ha`,
        `• PSN: ${psnSummary.totalKlaster} klaster — ${psnSummary.targetLuasTotal.toLocaleString()} ha target`,
        `• Overlap PITTI: ${pittiSummary.totalOverlapPapuaSelatan} kasus — ${pittiSummary.totalLuasOverlapPapua.toLocaleString()} ha`,
      ],
    }),
    dss_scoring: () => ({
      title: 'DSS Scoring AHP',
      stats: [
        { label: 'Zona Evaluasi', value: '5', unit: 'zona' },
        { label: 'Avg Sustainability', value: '0.47', unit: '' },
      ],
      body: 'Analytical Hierarchy Process (AHP) Cross-DSS mengevaluasi 5 zona berdasarkan 4 kriteria: Dampak Ekologis (35%), Hak Ulayat Adat (25%), Hasil Ekonomi (25%), Indeks Tumpang Tindih (15%).',
      details: [
        '• Klaster Kurik (Sapi): Score 0.78 — LANJUTKAN ✅',
        '• Klaster Ilwayab (Tebu): Score 0.55 — MITIGASI ⚠️',
        '• Mappi (IUP Nikel): Score 0.42 — REVISI ZONASI 🔄',
        '• Klaster Wanam (HGU vs PSN): Score 0.38 — REVISI ZONASI 🔄',
        '• Boven Digoel (IUP Kuarsa): Score 0.22 — HENTIKAN 🛑',
      ],
    }),
    rekomendasi_kebijakan: () => ({
      title: 'Rekomendasi Kebijakan Strategis',
      stats: [
        { label: 'Total', value: '5', unit: 'butir' },
        { label: 'Prioritas', value: '3', unit: 'butir' },
      ],
      body: 'Cross-DSS merumuskan 5 rekomendasi kebijakan strategis berbasis analisis data lintas sektor untuk pengambilan keputusan di tingkat kementerian:',
      details: [
        '1. [URGENT] Moratorium IUP baru di kawasan hutan primer Papua Selatan',
        '2. [URGENT] Revisi batas HGU yang tumpang tindih dengan wilayah adat',
        '3. [URGENT] Percepat mediasi PSN vs IUP di Distrik Wanam',
        '4. Kembangkan agroforestri sebagai buffer antara konsesi dan kampung adat',
        '5. Perkuat kapasitas BRIDA Papua Selatan untuk monitoring partisipatif',
      ],
    }),
  };

  const generator = contents[sectionId];
  return generator ? generator() : {
    title: sectionMeta[sectionId]?.label || sectionId,
    stats: [],
    body: 'Data sedang diproses oleh Cross-DSS Engine.',
    details: [],
  };
}

// Format date helper
function formatDateTime(date) {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(date);
}

function formatDateShort(date) {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(date);
}

export default function ReportBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState(reportTemplates[0].id);
  const [enabledSections, setEnabledSections] = useState(() => {
    const initial = {};
    reportTemplates.forEach(t => {
      t.sections.forEach(s => { initial[s] = true; });
    });
    return initial;
  });
  const [timeRange, setTimeRange] = useState('30d');
  const [region, setRegion] = useState('papua_selatan');
  const [customNotes, setCustomNotes] = useState('');
  const [reportHistory, setReportHistory] = useState([
    { id: 'RPT-001', template: 'executive_summary', title: 'Ringkasan Eksekutif Cross-Sectoral', date: new Date(2026, 4, 24, 14, 30), region: 'papua_selatan', pages: 12, status: 'completed' },
    { id: 'RPT-002', template: 'audit_overlap', title: 'Laporan Audit Tumpang Tindih Lahan', date: new Date(2026, 4, 22, 10, 15), region: 'nasional', pages: 8, status: 'completed' },
    { id: 'RPT-003', template: 'progress_psn', title: 'Laporan Progres PSN Food Estate', date: new Date(2026, 4, 20, 9, 0), region: 'papua_selatan', pages: 15, status: 'completed' },
  ]);
  const [isExporting, setIsExporting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const previewRef = useRef(null);

  const activeTemplate = reportTemplates.find(t => t.id === selectedTemplate) || reportTemplates[0];
  const activeSections = activeTemplate.sections.filter(s => enabledSections[s]);

  const toggleSection = useCallback((sectionId) => {
    setEnabledSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  }, []);

  const handleExportPDF = useCallback(async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: '#03060C',
        useCORS: true,
        logging: false,
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF('p', 'mm', 'a4');

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = -(pageHeight * Math.ceil((imgHeight - heightLeft) / pageHeight));
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = `CrossDSS_${activeTemplate.id}_${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(filename);

      setReportHistory(prev => [{
        id: `RPT-${String(prev.length + 1).padStart(3, '0')}`,
        template: selectedTemplate,
        title: activeTemplate.name,
        date: new Date(),
        region,
        pages: Math.ceil(imgHeight / pageHeight),
        status: 'completed',
      }, ...prev]);
    } catch (err) {
      console.error('PDF export error:', err);
    }
    setIsExporting(false);
  }, [activeTemplate, selectedTemplate, region]);

  const regionLabel = region === 'papua_selatan' ? 'Papua Selatan' : 'Nasional';
  const timeLabel = timeRanges.find(t => t.id === timeRange)?.label || '30 Hari Terakhir';
  const now = new Date();

  return (
    <div className="page-container rb-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">📄 Report Builder — Generator Laporan Eksekutif</h1>
        <p className="page-subtitle">Buat laporan lintas sektor dengan data real-time dari Cross-DSS Engine</p>
      </div>

      <div className="rb-layout">
        {/* ── LEFT: Template Sidebar ── */}
        <div className="rb-sidebar">
          <div className="rb-sidebar-header">
            <span className="rb-sidebar-icon">📑</span>
            <span className="rb-sidebar-title">Template Laporan</span>
          </div>
          <div className="rb-template-list">
            {reportTemplates.map(t => (
              <button
                key={t.id}
                className={`rb-template-btn ${selectedTemplate === t.id ? 'active' : ''}`}
                onClick={() => setSelectedTemplate(t.id)}
              >
                <span className="rb-tpl-icon">{t.icon}</span>
                <div className="rb-tpl-info">
                  <span className="rb-tpl-name">{t.name}</span>
                  <span className="rb-tpl-sections">{t.sections.length} bagian</span>
                </div>
                {selectedTemplate === t.id && <span className="rb-tpl-active-dot" />}
              </button>
            ))}
          </div>

          {/* History toggle */}
          <div className="rb-sidebar-divider" />
          <button className="rb-history-toggle" onClick={() => setShowHistory(!showHistory)}>
            <span>🕒</span>
            <span>Riwayat Laporan ({reportHistory.length})</span>
            <span className={`rb-chevron ${showHistory ? 'open' : ''}`}>▾</span>
          </button>
          {showHistory && (
            <div className="rb-history-list">
              {reportHistory.map(h => (
                <div key={h.id} className="rb-history-item">
                  <div className="rb-hist-top">
                    <span className="rb-hist-id">{h.id}</span>
                    <span className={`rb-hist-status ${h.status}`}>
                      {h.status === 'completed' ? '✅' : '⏳'}
                    </span>
                  </div>
                  <div className="rb-hist-title">{h.title}</div>
                  <div className="rb-hist-meta">
                    <span>{formatDateShort(h.date)}</span>
                    <span>{h.pages} hal</span>
                    <span>{h.region === 'papua_selatan' ? 'Papua Sel.' : 'Nasional'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── CENTER: Configuration ── */}
        <div className="rb-config">
          <div className="rb-config-section">
            <h3 className="rb-config-title">
              <span className="rb-cfg-icon">📋</span> Bagian Laporan
            </h3>
            <div className="rb-section-checklist">
              {activeTemplate.sections.map(s => (
                <label key={s} className={`rb-check-item ${enabledSections[s] ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={!!enabledSections[s]}
                    onChange={() => toggleSection(s)}
                  />
                  <span className="rb-check-icon">{sectionMeta[s]?.icon || '📄'}</span>
                  <span className="rb-check-label">{sectionMeta[s]?.label || s}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rb-config-section">
            <h3 className="rb-config-title">
              <span className="rb-cfg-icon">📅</span> Periode Waktu
            </h3>
            <div className="rb-time-grid">
              {timeRanges.map(t => (
                <button
                  key={t.id}
                  className={`rb-time-btn ${timeRange === t.id ? 'active' : ''}`}
                  onClick={() => setTimeRange(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rb-config-section">
            <h3 className="rb-config-title">
              <span className="rb-cfg-icon">📍</span> Wilayah
            </h3>
            <div className="rb-region-btns">
              {regions.map(r => (
                <button
                  key={r.id}
                  className={`rb-region-btn ${region === r.id ? 'active' : ''}`}
                  onClick={() => setRegion(r.id)}
                >
                  {r.id === 'papua_selatan' ? '📍' : '🇮🇩'} {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rb-config-section">
            <h3 className="rb-config-title">
              <span className="rb-cfg-icon">✏️</span> Catatan Tambahan
            </h3>
            <textarea
              className="rb-notes-textarea"
              value={customNotes}
              onChange={e => setCustomNotes(e.target.value)}
              placeholder="Tambahkan catatan atau instruksi khusus untuk laporan ini..."
              rows={4}
            />
          </div>

          <div className="rb-config-actions">
            <button
              className={`rb-export-btn ${isExporting ? 'loading' : ''}`}
              onClick={handleExportPDF}
              disabled={isExporting || activeSections.length === 0}
            >
              {isExporting ? (
                <>
                  <span className="rb-spinner" />
                  <span>Mengekspor PDF...</span>
                </>
              ) : (
                <>
                  <span>📥</span>
                  <span>Export PDF</span>
                </>
              )}
            </button>
            <div className="rb-export-info">
              <span>{activeSections.length} bagian dipilih</span>
              <span>•</span>
              <span>{regionLabel}</span>
              <span>•</span>
              <span>{timeLabel}</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Live Preview ── */}
        <div className="rb-preview-wrapper">
          <div className="rb-preview-toolbar">
            <span className="rb-preview-label">🔍 Live Preview</span>
            <span className="rb-preview-badge">{activeSections.length} bagian</span>
          </div>
          <div className="rb-preview-scroll">
            <div className="rb-preview" ref={previewRef}>
              {/* Watermark */}
              <div className="rb-watermark">Cross-DSS | PT. NUSATEK</div>

              {/* Report Header */}
              <div className="rb-report-header">
                <div className="rb-report-logo">
                  <span className="rb-logo-icon">🛡️</span>
                  <div className="rb-logo-text">
                    <span className="rb-logo-main">CROSS-DSS</span>
                    <span className="rb-logo-sub">Decision Support System</span>
                  </div>
                </div>
                <div className="rb-report-meta">
                  <span className="rb-report-badge">RAHASIA</span>
                  <span className="rb-report-date">{formatDateTime(now)}</span>
                </div>
              </div>

              <div className="rb-report-title-block">
                <h2 className="rb-report-title">{activeTemplate.icon} {activeTemplate.name}</h2>
                <div className="rb-report-subtitle-row">
                  <span className="rb-report-region">📍 {regionLabel}</span>
                  <span className="rb-report-period">📅 {timeLabel}</span>
                  <span className="rb-report-gen">🤖 Generated by Cross-DSS Engine v2.4</span>
                </div>
              </div>

              <div className="rb-report-divider" />

              {/* Table of Contents */}
              <div className="rb-toc">
                <h3 className="rb-toc-title">DAFTAR ISI</h3>
                {activeSections.map((s, i) => (
                  <div key={s} className="rb-toc-item">
                    <span className="rb-toc-num">{i + 1}.</span>
                    <span className="rb-toc-icon">{sectionMeta[s]?.icon || '📄'}</span>
                    <span className="rb-toc-label">{sectionMeta[s]?.label || s}</span>
                    <span className="rb-toc-dots" />
                    <span className="rb-toc-page">{i + 2}</span>
                  </div>
                ))}
              </div>

              <div className="rb-report-divider" />

              {/* Section Contents */}
              {activeSections.map((s, i) => {
                const content = generateSectionContent(s, region);
                return (
                  <div key={s} className="rb-section">
                    <div className="rb-section-header">
                      <span className="rb-section-num">{i + 1}</span>
                      <span className="rb-section-icon">{sectionMeta[s]?.icon || '📄'}</span>
                      <h3 className="rb-section-title">{content.title}</h3>
                    </div>

                    {content.stats.length > 0 && (
                      <div className="rb-section-stats">
                        {content.stats.map((st, j) => (
                          <div key={j} className="rb-stat-card">
                            <span className="rb-stat-value">{st.value}</span>
                            <span className="rb-stat-unit">{st.unit}</span>
                            <span className="rb-stat-label">{st.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="rb-section-body">{content.body}</p>

                    {content.details.length > 0 && (
                      <div className="rb-section-details">
                        {content.details.map((d, j) => (
                          <div key={j} className="rb-detail-line">{d}</div>
                        ))}
                      </div>
                    )}

                    {i < activeSections.length - 1 && <div className="rb-section-divider" />}
                  </div>
                );
              })}

              {/* Custom Notes */}
              {customNotes && (
                <div className="rb-section rb-custom-notes-section">
                  <div className="rb-section-header">
                    <span className="rb-section-num">✏️</span>
                    <h3 className="rb-section-title">Catatan Tambahan</h3>
                  </div>
                  <p className="rb-section-body rb-notes-content">{customNotes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="rb-report-footer">
                <div className="rb-footer-left">
                  <span>Cross-DSS v2.4 | PT. NUSATEK</span>
                  <span>Dokumen ini bersifat RAHASIA dan hanya untuk kalangan terbatas</span>
                </div>
                <div className="rb-footer-right">
                  <span>Dicetak: {formatDateTime(now)}</span>
                  <span>Halaman 1 / ~{activeSections.length + 1}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
