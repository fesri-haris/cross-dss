// ═══════════════════════════════════════════════════════════════
// Korelasi Data Operasional & Alokasi Anggaran Kemhan
// Budget Data Layer — 17 RS TNI
// ═══════════════════════════════════════════════════════════════

import { hospitals } from './hospitalData';

// ═══ STEP 1: KONSUMSI HARIAN BMHP ═══
// Data penggunaan Bahan Medis Habis Pakai real-time per sumber pembayaran
// Shift 09:00 - 21:00

const bmhpCategories = [
  { key: 'disposable', label: 'Disposable (Spuit, Infus Set, dll)', icon: '💉' },
  { key: 'obatHabis', label: 'Obat Habis Pakai', icon: '💊' },
  { key: 'reagenLab', label: 'Reagen Laboratorium', icon: '🧪' },
  { key: 'gasmedis', label: 'Gas Medis (O2, N2O)', icon: '🫁' },
  { key: 'implant', label: 'Implant & Prosthesis', icon: '🦴' },
  { key: 'apd', label: 'APD (Alat Pelindung Diri)', icon: '🧤' },
  { key: 'linen', label: 'Linen & Sterilisasi', icon: '🧹' },
];

const paymentSources = [
  { key: 'bpjs', label: 'BPJS Kesehatan', icon: '🟢', color: '#10b981' },
  { key: 'asuransi', label: 'Asuransi Swasta', icon: '🔵', color: '#3b82f6' },
  { key: 'mandiri', label: 'Mandiri / Umum', icon: '🟡', color: '#f59e0b' },
];

// Shift schedule
const shiftSchedule = [
  { key: 'pagi', label: 'Shift Pagi', time: '09:00 - 13:00', icon: '🌅' },
  { key: 'siang', label: 'Shift Siang', time: '13:00 - 17:00', icon: '☀️' },
  { key: 'sore', label: 'Shift Sore', time: '17:00 - 21:00', icon: '🌆' },
];

// Generate realistic daily BMHP usage per hospital based on size
function generateDailyBMHP(hospital) {
  const sizeFactor = hospital.beds / 100; // Scale by bed count
  const baseCosts = {
    disposable: { bpjs: 4200, asuransi: 1800, mandiri: 1200 },
    obatHabis: { bpjs: 8500, asuransi: 3200, mandiri: 2400 },
    reagenLab: { bpjs: 3100, asuransi: 1400, mandiri: 900 },
    gasmedis:  { bpjs: 2800, asuransi: 800,  mandiri: 600 },
    implant:   { bpjs: 5200, asuransi: 3500, mandiri: 2800 },
    apd:       { bpjs: 1500, asuransi: 600,  mandiri: 400 },
    linen:     { bpjs: 900,  asuransi: 350,  mandiri: 250 },
  };

  const items = {};
  bmhpCategories.forEach(cat => {
    const base = baseCosts[cat.key];
    items[cat.key] = {
      bpjs: Math.round(base.bpjs * sizeFactor * (0.85 + Math.random() * 0.3)),
      asuransi: Math.round(base.asuransi * sizeFactor * (0.85 + Math.random() * 0.3)),
      mandiri: Math.round(base.mandiri * sizeFactor * (0.85 + Math.random() * 0.3)),
    };
  });

  // Per-shift breakdown (roughly 35% pagi, 40% siang, 25% sore)
  const shiftRatios = { pagi: 0.35, siang: 0.40, sore: 0.25 };
  const shifts = {};
  shiftSchedule.forEach(s => {
    const ratio = shiftRatios[s.key];
    shifts[s.key] = {
      bpjs: Math.round(Object.values(items).reduce((sum, c) => sum + c.bpjs, 0) * ratio),
      asuransi: Math.round(Object.values(items).reduce((sum, c) => sum + c.asuransi, 0) * ratio),
      mandiri: Math.round(Object.values(items).reduce((sum, c) => sum + c.mandiri, 0) * ratio),
    };
  });

  const totalBPJS = Object.values(items).reduce((s, c) => s + c.bpjs, 0);
  const totalAsuransi = Object.values(items).reduce((s, c) => s + c.asuransi, 0);
  const totalMandiri = Object.values(items).reduce((s, c) => s + c.mandiri, 0);

  return {
    rsId: hospital.id,
    rsName: hospital.name,
    items,
    shifts,
    totals: {
      bpjs: totalBPJS,
      asuransi: totalAsuransi,
      mandiri: totalMandiri,
      grand: totalBPJS + totalAsuransi + totalMandiri,
    },
  };
}

// ═══ STEP 2: AKUMULASI BULANAN ═══
// Pengeluaran murni BMHP bulanan — 12 bulan data

const monthLabels = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

// Base monthly expenditure (in juta Rp) per hospital, scaled by size
function generateMonthlyAccumulation(hospital) {
  const sizeFactor = hospital.beds / 100;
  const baseMonthly = 820; // base in juta for 100-bed hospital

  const monthly = monthLabels.map((_, i) => {
    // Seasonal variation: higher in Mar-May (musim hujan tail) and Sep-Nov
    const seasonal = [0.92, 0.95, 1.05, 1.08, 1.02, 0.94, 0.90, 0.93, 1.04, 1.06, 1.03, 0.98];
    return Math.round(baseMonthly * sizeFactor * seasonal[i] * (0.95 + Math.random() * 0.1));
  });

  const breakdown = {
    bpjs: monthly.map(v => Math.round(v * 0.58)),
    asuransi: monthly.map(v => Math.round(v * 0.24)),
    mandiri: monthly.map(v => Math.round(v * 0.18)),
  };

  return {
    rsId: hospital.id,
    rsName: hospital.name,
    monthly,
    breakdown,
    totalYear: monthly.reduce((a, b) => a + b, 0),
    avgMonthly: Math.round(monthly.reduce((a, b) => a + b, 0) / 12),
  };
}

// ═══ STEP 3: PERHITUNGAN BLU ═══
// Kalkulasi otomatis 30% dari total pendapatan RS untuk anggaran operasional BLU

function generateBLUData(hospital, monthlyData) {
  const sizeFactor = hospital.beds / 100;
  const basePendapatan = 2800; // base pendapatan in juta per bulan per 100 beds

  const pendapatanBulanan = monthLabels.map((_, i) => {
    const seasonal = [0.94, 0.96, 1.04, 1.06, 1.03, 0.95, 0.92, 0.96, 1.05, 1.07, 1.04, 0.98];
    return Math.round(basePendapatan * sizeFactor * seasonal[i] * (0.95 + Math.random() * 0.1));
  });

  const totalPendapatan = pendapatanBulanan.reduce((a, b) => a + b, 0);
  const alokasBLU = Math.round(totalPendapatan * 0.30);
  const realisasiBLU = Math.round(alokasBLU * (0.88 + Math.random() * 0.10));
  const sisaBLU = alokasBLU - realisasiBLU;

  // Breakdown BLU allocation categories
  const bluBreakdown = {
    gajiHonor: Math.round(alokasBLU * 0.35),
    operasional: Math.round(alokasBLU * 0.25),
    pemeliharaan: Math.round(alokasBLU * 0.18),
    pengadaan: Math.round(alokasBLU * 0.12),
    pelatihan: Math.round(alokasBLU * 0.10),
  };

  return {
    rsId: hospital.id,
    rsName: hospital.name,
    pendapatanBulanan,
    totalPendapatan,
    alokasBLU,
    realisasiBLU,
    sisaBLU,
    pctRealisasi: ((realisasiBLU / alokasBLU) * 100).toFixed(1),
    bluBreakdown,
    pengeluaranBMHP: monthlyData.totalYear,
    rasioEfisiensi: ((monthlyData.totalYear / totalPendapatan) * 100).toFixed(1),
  };
}

// ═══ STEP 4: PENGAJUAN ANGGARAN PUSAT ═══
// Proyeksi kebutuhan absolut + 5% surplus

function generateBudgetProjection(hospital, monthlyData, bluData) {
  const realisasiTahunIni = monthlyData.totalYear;
  const kebutuhanAbsolut = Math.round(realisasiTahunIni * 1.03); // 3% inflation adjustment
  const surplus5Pct = Math.round(kebutuhanAbsolut * 0.05);
  const totalPengajuan = kebutuhanAbsolut + surplus5Pct;

  // Category breakdown for projection
  const proyeksiKategori = {
    bmhp: Math.round(totalPengajuan * 0.42),
    sdm: Math.round(totalPengajuan * 0.28),
    infrastruktur: Math.round(totalPengajuan * 0.15),
    teknologi: Math.round(totalPengajuan * 0.08),
    cadangan: Math.round(totalPengajuan * 0.07),
  };

  // Historical comparison (simulated last 3 years)
  const historis = {
    2024: Math.round(realisasiTahunIni * 0.85),
    2025: Math.round(realisasiTahunIni * 0.93),
    2026: realisasiTahunIni,
    2027: totalPengajuan,
  };

  return {
    rsId: hospital.id,
    rsName: hospital.name,
    realisasiTahunIni,
    kebutuhanAbsolut,
    surplus5Pct,
    totalPengajuan,
    proyeksiKategori,
    historis,
    pertumbuhanYoY: (((totalPengajuan - realisasiTahunIni) / realisasiTahunIni) * 100).toFixed(1),
    statusPengajuan: totalPengajuan > 8000 ? 'review' : 'approved',
  };
}

// ═══ VALIDITAS DATA SIMRS ═══
// Skor validitas per RS — menentukan validitas anggaran

function generateValidityScore(hospital) {
  const typeBonus = { 'Type A': 12, 'Type B': 6, 'Type C': 0, 'Type D': -5 };
  const accredBonus = { 'Paripurna': 10, 'Utama': 5, 'Madya': 0 };
  const base = 65 + (typeBonus[hospital.type] || 0) + (accredBonus[hospital.accreditation] || 0);
  const score = Math.min(100, Math.max(50, base + Math.round(Math.random() * 15)));

  const dimensions = {
    kelengkapanData: Math.min(100, score + Math.round(Math.random() * 8 - 4)),
    konsistensiData: Math.min(100, score + Math.round(Math.random() * 6 - 3)),
    keterkinian: Math.min(100, score + Math.round(Math.random() * 10 - 3)),
    akurasiKeuangan: Math.min(100, score + Math.round(Math.random() * 8 - 4)),
    integritasRekamMedis: Math.min(100, score + Math.round(Math.random() * 6 - 2)),
  };

  const avgDimension = Object.values(dimensions).reduce((a, b) => a + b, 0) / Object.keys(dimensions).length;

  return {
    rsId: hospital.id,
    rsName: hospital.name,
    overallScore: Math.round(avgDimension),
    dimensions,
    status: avgDimension >= 85 ? 'valid' : avgDimension >= 70 ? 'conditional' : 'review',
    statusLabel: avgDimension >= 85 ? 'Tervalidasi' : avgDimension >= 70 ? 'Bersyarat' : 'Perlu Review',
    lastSync: `2026-04-${String(15 + Math.floor(Math.random() * 6)).padStart(2, '0')}T${String(7 + Math.floor(Math.random() * 10)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00+07:00`,
  };
}

// ═══ GENERATE ALL DATA FOR 17 RS ═══

export const dailyBMHP = {};
export const monthlyAccumulation = {};
export const bluCalculations = {};
export const budgetProjections = {};
export const validityScores = {};

hospitals.forEach(h => {
  dailyBMHP[h.id] = generateDailyBMHP(h);

  const monthly = generateMonthlyAccumulation(h);
  monthlyAccumulation[h.id] = monthly;

  const blu = generateBLUData(h, monthly);
  bluCalculations[h.id] = blu;

  budgetProjections[h.id] = generateBudgetProjection(h, monthly, blu);

  validityScores[h.id] = generateValidityScore(h);
});

// ═══ AGGREGATED NATIONAL TOTALS ═══

export function getNationalTotals() {
  const rsIds = hospitals.map(h => h.id);

  const totalBMHPHarian = rsIds.reduce((sum, id) => sum + dailyBMHP[id].totals.grand, 0);
  const totalBMHPHarianBPJS = rsIds.reduce((sum, id) => sum + dailyBMHP[id].totals.bpjs, 0);
  const totalBMHPHarianAsuransi = rsIds.reduce((sum, id) => sum + dailyBMHP[id].totals.asuransi, 0);
  const totalBMHPHarianMandiri = rsIds.reduce((sum, id) => sum + dailyBMHP[id].totals.mandiri, 0);

  const totalAkumulasiTahunan = rsIds.reduce((sum, id) => sum + monthlyAccumulation[id].totalYear, 0);

  const totalPendapatan = rsIds.reduce((sum, id) => sum + bluCalculations[id].totalPendapatan, 0);
  const totalBLU = rsIds.reduce((sum, id) => sum + bluCalculations[id].alokasBLU, 0);
  const totalRealisasiBLU = rsIds.reduce((sum, id) => sum + bluCalculations[id].realisasiBLU, 0);

  const totalPengajuan2027 = rsIds.reduce((sum, id) => sum + budgetProjections[id].totalPengajuan, 0);
  const totalRealisasi2026 = rsIds.reduce((sum, id) => sum + budgetProjections[id].realisasiTahunIni, 0);

  const avgValiditas = Math.round(rsIds.reduce((sum, id) => sum + validityScores[id].overallScore, 0) / rsIds.length);
  const rsValidCount = rsIds.filter(id => validityScores[id].status === 'valid').length;
  const rsConditionalCount = rsIds.filter(id => validityScores[id].status === 'conditional').length;
  const rsReviewCount = rsIds.filter(id => validityScores[id].status === 'review').length;

  // Monthly aggregation across all RS
  const monthlyNasional = monthLabels.map((_, i) =>
    rsIds.reduce((sum, id) => sum + monthlyAccumulation[id].monthly[i], 0)
  );

  return {
    totalBMHPHarian,
    totalBMHPHarianBPJS,
    totalBMHPHarianAsuransi,
    totalBMHPHarianMandiri,
    totalAkumulasiTahunan,
    totalPendapatan,
    totalBLU,
    totalRealisasiBLU,
    pctRealisasiBLU: ((totalRealisasiBLU / totalBLU) * 100).toFixed(1),
    totalPengajuan2027,
    totalRealisasi2026,
    pertumbuhanNasional: (((totalPengajuan2027 - totalRealisasi2026) / totalRealisasi2026) * 100).toFixed(1),
    avgValiditas,
    rsValidCount,
    rsConditionalCount,
    rsReviewCount,
    monthlyNasional,
  };
}

// ═══ EXPORTS ═══
export { bmhpCategories, paymentSources, shiftSchedule, monthLabels as budgetMonthLabels };

// BLU breakdown category labels
export const bluCategoryLabels = {
  gajiHonor: { label: 'Gaji & Honorarium', icon: '👥', color: '#3b82f6' },
  operasional: { label: 'Operasional', icon: '⚙️', color: '#10b981' },
  pemeliharaan: { label: 'Pemeliharaan', icon: '🔧', color: '#f59e0b' },
  pengadaan: { label: 'Pengadaan', icon: '📦', color: '#8b5cf6' },
  pelatihan: { label: 'Pelatihan', icon: '🎓', color: '#06b6d4' },
};

// Projection category labels
export const projectionCategoryLabels = {
  bmhp: { label: 'BMHP & Farmasi', icon: '💊', color: '#10b981' },
  sdm: { label: 'SDM & Nakes', icon: '👨‍⚕️', color: '#3b82f6' },
  infrastruktur: { label: 'Infrastruktur', icon: '🏗️', color: '#f59e0b' },
  teknologi: { label: 'Teknologi & IT', icon: '💻', color: '#8b5cf6' },
  cadangan: { label: 'Dana Cadangan', icon: '🛡️', color: '#64748b' },
};

// Validity dimension labels
export const validityDimensionLabels = {
  kelengkapanData: { label: 'Kelengkapan Data', icon: '📋' },
  konsistensiData: { label: 'Konsistensi Data', icon: '🔗' },
  keterkinian: { label: 'Keterkinian (Up-to-date)', icon: '🕐' },
  akurasiKeuangan: { label: 'Akurasi Keuangan', icon: '💰' },
  integritasRekamMedis: { label: 'Integritas Rekam Medis', icon: '📝' },
};
