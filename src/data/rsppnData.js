// ═══════════════════════════════════════════════════
// IKHI — RSPPN Panglima Besar Soedirman Realism Data (28 Floors)
// Realistic hospital operations based on RS kelas A militer (~1000 bed)
// ═══════════════════════════════════════════════════

const generateMainBuildingFloors = () => {
  const floors = [];

  // Lantai 1: Lobi, IGD, Radiologi
  floors.push({
    floor: 1, name: 'Lantai 1 — Lobi, IGD & Radiologi',
    rooms: [
      { id: 'u-r1-1', name: 'IGD (55 Bed)', type: 'emergency', x: 2, y: 2, w: 46, h: 46, capacity: 55, occupied: 45, equipment: ['Defibrillator x8', 'Ventilator x15', 'Monitor Tanda Vital x55', 'Troli Darurat x12'] },
      { id: 'u-r1-2', name: 'Radiologi (MRI 3 Tesla, CT, DSA)', type: 'diagnostic', x: 50, y: 2, w: 48, h: 46, capacity: 15, occupied: 10, equipment: ['MRI 3 Tesla x1', 'CT Scan 128 Slice x2', 'USG 4D x3', 'DSA Biplane x1', 'X-Ray Digital x4'] },
      { id: 'u-r1-3', name: 'Rehabilitasi Disabilitas & Robotik', type: 'rehab', x: 2, y: 50, w: 46, h: 48, capacity: 20, occupied: 12, equipment: ['Laser Rehab x2', 'Robotik Ekstremitas x3', 'Treadmill Terapi x4', 'Parallel Bar x6'] },
      { id: 'u-r1-4', name: 'Lobi Utama & Farmasi', type: 'pharmacy', x: 50, y: 50, w: 48, h: 48, capacity: 100, occupied: 35, equipment: ['Kios Pendaftaran Mandiri x8', 'Dispenser Obat Otomatis x4', 'Cold Storage Vaksin x2'] }
    ]
  });

  // Lantai 2: ICU & Bedah
  floors.push({
    floor: 2, name: 'Lantai 2 — ICU Terpadu & Ruang Operasi',
    rooms: [
      { id: 'u-r2-1', name: 'ICU / ICCU / PICU / NICU (90 Bed)', type: 'icu', x: 2, y: 2, w: 60, h: 46, capacity: 90, occupied: 82, equipment: ['Ventilator Hamilton x90', 'Monitor Philips x90', 'Infusion Pump x180', 'ECMO x3', 'IABP x2'] },
      { id: 'u-r2-2', name: 'Ruang Operasi (11 Ruang)', type: 'operating', x: 64, y: 2, w: 34, h: 96, capacity: 11, occupied: 6, equipment: ['Mesin Anestesi Dräger x11', 'Cath Lab x2', 'Robot Bedah Da Vinci x1', 'C-Arm x4', 'Electrosurgery x11'] },
      { id: 'u-r2-3', name: 'Recovery Room', type: 'recovery', x: 2, y: 50, w: 60, h: 48, capacity: 30, occupied: 18, equipment: ['Monitor Pasca-Bedah x30', 'Suction Portable x10'] }
    ]
  });

  // Lantai 3: Hemodialisis & Kemoterapi
  floors.push({
    floor: 3, name: 'Lantai 3 — Hemodialisis & Kemoterapi',
    rooms: [
      { id: 'u-r3-1', name: 'Unit Hemodialisis (30 Mesin)', type: 'specialist', x: 2, y: 2, w: 46, h: 96, capacity: 30, occupied: 28, equipment: ['Mesin Hemodialisis Fresenius x30', 'Water Treatment RO x2'] },
      { id: 'u-r3-2', name: 'Pusat Kanker & Kemoterapi', type: 'specialist', x: 50, y: 2, w: 48, h: 46, capacity: 40, occupied: 25, equipment: ['Kursi Kemoterapi x40', 'Infusion Pump Kemo x40', 'BSC Class II x4'] },
      { id: 'u-r3-3', name: 'Poliklinik Spesialis Terpadu', type: 'outpatient', x: 50, y: 50, w: 48, h: 48, capacity: 60, occupied: 40, equipment: ['Alat Diagnostik USG x6', 'EKG x8', 'Spirometer x4', 'Audiometer x2'] }
    ]
  });

  // Lantai 4: Pusat Komando
  floors.push({
    floor: 4, name: 'Lantai 4 — Command Center IKHI',
    rooms: [
      { id: 'u-r4-1', name: 'RSPPN Command Center', type: 'admin', x: 2, y: 2, w: 96, h: 46, capacity: 50, occupied: 15, equipment: ['Server EMR Cluster x4', 'Video Wall 3x4 Samsung x1', 'Workstation i9 x12', 'CCTV Hub 200ch x1'] },
      { id: 'u-r4-2', name: 'Ruang Rapat Strategis & Briefing', type: 'meeting', x: 2, y: 50, w: 46, h: 48, capacity: 30, occupied: 8, equipment: ['Proyektor 4K x2', 'Video Conference Poly x1', 'Smartboard x2'] },
      { id: 'u-r4-3', name: 'Data Center & Server Room', type: 'admin', x: 50, y: 50, w: 48, h: 48, capacity: 5, occupied: 2, equipment: ['Rack Server 42U x8', 'UPS 100kVA x2', 'Precision AC x4', 'Firewall x2'] }
    ]
  });

  // Lantai 5-27: Rawat Inap
  const wardNames = [
    'Bangsal Prajurit Kelas III', 'Bangsal Bintara', 'Bangsal Perwira',
    'Bangsal Umum A', 'Bangsal Umum B', 'Rawat Inap Anak',
    'Rawat Inap Kebidanan', 'Bangsal Bedah Ortopedi', 'Bangsal Penyakit Dalam',
    'Bangsal Neurologi', 'Bangsal Jantung', 'Bangsal Paru',
    'Rawat Inap Mata & THT', 'Bangsal Dermatologi', 'Rawat Inap Urologi',
    'Bangsal Onkologi', 'Bangsal Geriatri', 'Bangsal Psikiatri',
    'VIP Jenderal A', 'VIP Jenderal B', 'Super VIP Eksekutif',
    'Rawat Inap Rehabilitasi', 'Bangsal Isolasi & Infeksi'
  ];

  for (let i = 5; i <= 27; i++) {
    const idx = i - 5;
    const wardName = wardNames[idx] || `Bangsal Perawatan Lt.${i}`;
    const occA = Math.floor(Math.random() * 12) + 8;
    const occB = Math.floor(Math.random() * 12) + 8;
    const occVip = Math.floor(Math.random() * 6) + 2;

    floors.push({
      floor: i, name: `Lantai ${i} — ${wardName}`,
      rooms: [
        { id: `u-r${i}-1`, name: `${wardName} - Sayap Barat`, type: 'ward', x: 2, y: 2, w: 46, h: 46, capacity: 20, occupied: occA, equipment: ['Bed Elektrik x20', 'Monitor Vital x8', 'Nurse Call x20'] },
        { id: `u-r${i}-2`, name: `${wardName} - Sayap Timur`, type: 'ward', x: 50, y: 2, w: 48, h: 46, capacity: 20, occupied: occB, equipment: ['Bed Elektrik x20', 'Monitor Vital x8', 'Infusion Pump x10'] },
        { id: `u-r${i}-3`, name: `Kamar VIP / Suite Lt.${i}`, type: 'vip', x: 2, y: 50, w: 46, h: 48, capacity: 10, occupied: occVip, equipment: ['Bed Premium x10', 'Monitor HD x10', 'TV 55" x10', 'Sofa Keluarga x10'] },
        { id: `u-r${i}-4`, name: 'Nurse Station & Pantry', type: 'admin', x: 50, y: 50, w: 48, h: 48, capacity: 8, occupied: 4, equipment: ['PC EMR x4', 'Troli Obat x6', 'Dispenser Obat x2'] }
      ]
    });
  }

  // Lantai 28: Helipad
  floors.push({
    floor: 28, name: 'Lantai 28 — Helipad & Evakuasi Udara',
    rooms: [
      { id: 'u-r28-1', name: 'Helipad Darurat (2 Landing Pad)', type: 'emergency', x: 10, y: 10, w: 80, h: 50, capacity: 5, occupied: 0, equipment: ['Troli Tandu Evakuasi x4', 'Windsock x2', 'Landing Light x8'] },
      { id: 'u-r28-2', name: 'Triage & Stabilisasi Darurat', type: 'emergency', x: 10, y: 65, w: 80, h: 30, capacity: 8, occupied: 1, equipment: ['Kit Trauma Lapangan x4', 'Stretcher Lipat x8', 'Oksigen Portable x6'] }
    ]
  });

  return floors;
};

const generateAsramaFloors = () => {
  const floors = [];
  for (let i = 1; i <= 6; i++) {
    floors.push({
      floor: i, name: `Lantai ${i} — Asrama Perawat`,
      rooms: [
        { id: `a-r${i}-1`, name: `Kamar Asrama Barat Lt.${i}`, type: 'admin', x: 2, y: 2, w: 46, h: 96, capacity: 50, occupied: 35 + Math.floor(Math.random() * 10), equipment: ['Ranjang Susun x25', 'Loker x50'] },
        { id: `a-r${i}-2`, name: `Kamar Asrama Timur Lt.${i}`, type: 'admin', x: 50, y: 2, w: 48, h: 96, capacity: 50, occupied: 30 + Math.floor(Math.random() * 15), equipment: ['Ranjang Susun x25', 'Loker x50'] }
      ]
    });
  }
  return floors;
};

const generateGedungLamaFloors = () => {
  const floors = [];
  const lamaRooms = [
    ['Gudang Logistik Obat & Alkes', 'Dapur Sentral & Gizi Pasien'],
    ['Gudang Farmasi & Cold Storage', 'Binatu & Sterilisasi Linen'],
    ['Bengkel Biomedik & Kalibrasi Alat', 'CSSD (Sterilisasi Instrumen)'],
    ['Gudang APD & Logistik Darurat', 'Ruang Genset & Utilitas']
  ];
  for (let i = 1; i <= 4; i++) {
    floors.push({
      floor: i, name: `Lantai ${i} — ${lamaRooms[i-1][0].split(' & ')[0]}`,
      rooms: [
        { id: `l-r${i}-1`, name: lamaRooms[i-1][0], type: 'pharmacy', x: 2, y: 2, w: 96, h: 46, capacity: null, occupied: null, equipment: i === 1 ? ['Pendingin Darah x4', 'Rak Vaksin x8', 'Cold Room -20°C x2'] : i === 2 ? ['Cold Storage Farmasi x3', 'Rak Obat LASA x12'] : i === 3 ? ['Oscilloscope x2', 'Alat Kalibrasi x6', 'Toolkit Biomedik x8'] : ['Rak APD x20', 'Box Darurat x50'] },
        { id: `l-r${i}-2`, name: lamaRooms[i-1][1], type: 'admin', x: 2, y: 50, w: 96, h: 48, capacity: null, occupied: null, equipment: i === 1 ? ['Oven Industri x3', 'Blast Chiller x2', 'Troli Saji x40'] : i === 2 ? ['Mesin Cuci Industri x6', 'Dryer x4', 'Meja Lipat x8'] : i === 3 ? ['Autoclave x4', 'ETO Sterilizer x1', 'Ultrasonic Cleaner x3'] : ['Genset 2000 kVA x2', 'ATS Panel x2'] }
      ]
    });
  }
  return floors;
};

// ═══ CURATED REALISTIC RSPPN ENTITIES ═══
const generateDynamicEntities = () => {
  const entities = [];
  let counter = 1000;

  const makeEntity = (name, type, status, room, floor, loc, detail, vstatus) => {
    const id = `ENT-${counter++}`;
    entities.push({
      id, name, type, status, room, floor, location: loc,
      rfidTag: `RFID-${type.substring(0,3).toUpperCase()}-${String(counter).padStart(4, '0')}`,
      lastScan: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} WIB`,
      detail: detail || '',
      vstatus: vstatus || '🟢',
      x: Math.floor(Math.random() * 80) + 10,
      y: Math.floor(Math.random() * 80) + 10
    });
  };

  // ════════════════════════════════════════
  // LANTAI 1 — IGD, RADIOLOGI, REHAB, LOBI
  // ════════════════════════════════════════

  // IGD Patients
  makeEntity('Pratu Dimas Prabowo', 'patient', 'critical', 'u-r1-1', 1, 'IGD', 'Luka tembak latihan tempur, hemoragik aktif. Urgensi transfusi.', '🔴');
  makeEntity('Kopda Rizki Setiawan', 'patient', 'critical', 'u-r1-1', 1, 'IGD', 'Kecelakaan kendaraan taktis, fraktur multiple. GCS 11.', '🔴');
  makeEntity('Ny. Siti Rahmawati', 'patient', 'active', 'u-r1-1', 1, 'IGD', 'Sesak napas akut, suspek emboli paru. SpO2 91%.', '🟡');
  makeEntity('Sertu Wahyu Firmansyah', 'patient', 'active', 'u-r1-1', 1, 'IGD', 'Cedera kepala ringan latihan parasut. CT-scan pending.', '🟢');
  makeEntity('Tn. Abdul Malik', 'patient', 'active', 'u-r1-1', 1, 'IGD', 'Nyeri dada akut, EKG ST-elevasi. PCI emergensi pending.', '🟡');
  makeEntity('Praka Fadli Nugraha', 'patient', 'active', 'u-r1-1', 1, 'IGD', 'Keracunan makanan latihan lapangan. Dehidrasi sedang.', '🟢');
  makeEntity('Ny. Dewi Kartika', 'patient', 'active', 'u-r1-1', 1, 'IGD', 'Partus spontan kala II. Rujukan dari RS Tk.III.', '🟡');
  makeEntity('Koptu Ardiansyah', 'patient', 'active', 'u-r1-1', 1, 'IGD', 'Luka bakar derajat II 25% BSA. Perawatan luka intensif.', '🟡');

  // IGD Nakes
  makeEntity('Dr. Ahmad Rizal, Sp.B', 'nakes', 'active', 'u-r1-1', 1, 'IGD', 'Chief Surgeon IGD, Shift Pagi 07:00-14:00', '🟢');
  makeEntity('Dr. Sari Wulandari, Sp.EM', 'nakes', 'active', 'u-r1-1', 1, 'IGD', 'Dokter Emergensi, Shift Pagi', '🟢');
  makeEntity('Ns. Ratna Dewi, S.Kep', 'nakes', 'active', 'u-r1-1', 1, 'IGD', 'Kepala Perawat IGD, Shift Pagi', '🟢');
  makeEntity('Ns. Eko Purnomo, S.Kep', 'nakes', 'active', 'u-r1-1', 1, 'IGD', 'Perawat Triage, Shift Pagi', '🟢');
  makeEntity('Dr. Rina Susanti', 'nakes', 'active', 'u-r1-1', 1, 'IGD', 'Dokter Jaga IGD, Shift Pagi', '🟢');

  // IGD Equipment
  makeEntity('Defibrillator Zoll R-Series #IGD-01', 'equipment', 'active', 'u-r1-1', 1, 'IGD', 'SN: ZR-2024-0145. Kalibrasi: 15 Feb 2026. Status: READY.', '🟢');
  makeEntity('Ventilator Hamilton C6 #IGD-03', 'equipment', 'active', 'u-r1-1', 1, 'IGD', 'SN: HC6-2025-0089. Mode: SIMV. Pasien: Pratu Dimas.', '🟢');
  makeEntity('Monitor Philips MX800 #IGD-05', 'equipment', 'active', 'u-r1-1', 1, 'IGD', 'SN: PMX-2024-0234. Multi-param. Connected.', '🟢');

  // IGD Logistik
  makeEntity('Box Obat Emergensi IGD-A', 'logistic', 'active', 'u-r1-1', 1, 'IGD', 'Epinefrin, Atropin, Amiodaron. Stock: 85%. Exp check OK.', '🟢');
  makeEntity('Tabung Oksigen O2 50L #IGD-O2-12', 'logistic', 'active', 'u-r1-1', 1, 'IGD', 'Tekanan: 150 bar. Estimasi 8 jam pemakaian.', '🟢');
  makeEntity('Set Kantong Darah Gol.O- #IGD-BD-01', 'logistic', 'critical', 'u-r1-1', 1, 'IGD', 'KRITIS: Stok Gol.O- hanya 4 unit. Butuh resupply segera.', '🔴');

  // Radiologi
  makeEntity('Letkol Bambang Hartono', 'patient', 'active', 'u-r1-2', 1, 'Radiologi MRI/CT', 'MRI Lumbal scheduled. Suspek HNP L4-L5.', '🟢');
  makeEntity('Serma Agus Prasetyo', 'patient', 'active', 'u-r1-2', 1, 'Radiologi MRI/CT', 'CT-Scan kepala. Post cedera latihan.', '🟢');
  makeEntity('Dr. Faisal Hakim, Sp.Rad', 'nakes', 'active', 'u-r1-2', 1, 'Radiologi MRI', 'Radiolog Senior. Shift Pagi. Reading 24 studi.', '🟢');
  makeEntity('Dr. Nurlia Sari, Sp.Rad', 'nakes', 'active', 'u-r1-2', 1, 'Radiologi MRI', 'Radiolog Junior. CT-guided biopsy scheduled.', '🟢');
  makeEntity('Radiografer Hendri Yanto', 'nakes', 'active', 'u-r1-2', 1, 'Radiologi MRI', 'Operator MRI 3T Shift Pagi.', '🟢');
  makeEntity('MRI Siemens MAGNETOM Vida 3T', 'equipment', 'active', 'u-r1-2', 1, 'Radiologi', 'SN: SMV-2025-001. Uptime: 99.2%. Coil OK.', '🟢');
  makeEntity('CT Scan GE Revolution Apex 128S', 'equipment', 'active', 'u-r1-2', 1, 'Radiologi', 'SN: GER-2025-003. Tube hours: 12,400/50,000.', '🟢');

  // Rehab
  makeEntity('Mayor (Purn) Sutejo', 'patient', 'active', 'u-r1-3', 1, 'Rehabilitasi', 'Rehabilitasi pasca-amputasi BK kiri. Sesi fisioterapi ke-12.', '🟢');
  makeEntity('Koptu Arman Maulana', 'patient', 'active', 'u-r1-3', 1, 'Rehabilitasi', 'Rehab pasca-stroke iskemik. Motorik membaik 60%.', '🟢');
  makeEntity('Dr. Yoga Pratama, Sp.KFR', 'nakes', 'active', 'u-r1-3', 1, 'Rehabilitasi', 'Spesialis Kedokteran Fisik & Rehabilitasi.', '🟢');
  makeEntity('Fisioterapis Dina Oktaviani', 'nakes', 'active', 'u-r1-3', 1, 'Rehabilitasi', 'Fisioterapis Senior. Sesi pagi 6 pasien.', '🟢');
  makeEntity('Exoskeleton Rehab Robot HAL-03', 'equipment', 'active', 'u-r1-3', 1, 'Rehabilitasi', 'SN: HAL-2025-003. Battery: 78%. Mode: Gait Training.', '🟢');

  // Lobi & Farmasi
  makeEntity('Apoteker Irma Sulistyowati', 'nakes', 'active', 'u-r1-4', 1, 'Lobi/Farmasi', 'Kepala Instalasi Farmasi. Verifikasi resep 142 item.', '🟢');
  makeEntity('Apoteker Budi Santosa', 'nakes', 'active', 'u-r1-4', 1, 'Lobi/Farmasi', 'Farmasi Klinis. Konseling obat pasien rawat jalan.', '🟢');
  makeEntity('Box Distribusi Obat Rawat Inap Lt.5-10', 'logistic', 'active', 'u-r1-4', 1, 'Farmasi', 'Cefotaxime, Omeprazole, Ketorolac. Batch: 26-MAR-A.', '🟢');
  makeEntity('Box Distribusi Obat Rawat Inap Lt.11-20', 'logistic', 'active', 'u-r1-4', 1, 'Farmasi', 'Antibiotik, Analgesik, Cairan Infus. Batch: 26-MAR-B.', '🟢');
  makeEntity('Box Narkotika & Psikotropika Terkunci', 'logistic', 'active', 'u-r1-4', 1, 'Farmasi', 'Morfin, Fentanyl, Midazolam. Double-lock verified 06:00.', '🟢');

  // ════════════════════════════════════════
  // LANTAI 2 — ICU, OK, RECOVERY
  // ════════════════════════════════════════

  // ICU Patients
  makeEntity('Kolonel Romli Setiabudi', 'patient', 'critical', 'u-r2-1', 2, 'ICU', 'Pasca-bedah jantung CABG x3. On ventilator, hemodinamik labil.', '🔴');
  makeEntity('Serda Budi Prasetyo', 'patient', 'critical', 'u-r2-1', 2, 'ICU', 'Trauma multiple — fraktur femur + contusio pulmo. On ventilator.', '🔴');
  makeEntity('Tn. Ahmad Fauzi', 'patient', 'critical', 'u-r2-1', 2, 'ICU', 'DBD Grade III, trombosit 18.000. Transfusi TC ke-3.', '🔴');
  makeEntity('Ny. Ratna Megawati', 'patient', 'active', 'u-r2-1', 2, 'ICU', 'Post-Op Appendektomi H+1. Stabil, rencana pindah bangsal.', '🟢');
  makeEntity('Letda Surya Dharma', 'patient', 'critical', 'u-r2-1', 2, 'ICU', 'Luka bakar 40% BSA. Debridement ke-2 scheduled.', '🔴');
  makeEntity('Pratu Yono Widodo', 'patient', 'active', 'u-r2-1', 2, 'ICU', 'Post-op kraniotomi H+3. GCS 14. Rencana weaning ventilator.', '🟡');
  makeEntity('Tn. Hendra Kusnadi', 'patient', 'active', 'u-r2-1', 2, 'ICU', 'Stroke iskemik H+5. Motorik membaik. Fisioterapi dimulai.', '🟡');
  makeEntity('Brigjen (Purn) Soetaryo', 'patient', 'active', 'u-r2-1', 2, 'ICU', 'Gagal jantung kongestif eksaserbasi. Dobutamin drip.', '🟡');

  // ICU Nakes
  makeEntity('Dr. Irfan Hakim, Sp.An-KIC', 'nakes', 'active', 'u-r2-1', 2, 'ICU', 'Konsultan Intensivist. Chief ICU. Shift Pagi.', '🟢');
  makeEntity('Dr. Rini Anggraeni, Sp.JP', 'nakes', 'active', 'u-r2-1', 2, 'ICU', 'Kardiolog Intervensi. Monitoring post-CABG.', '🟢');
  makeEntity('Ns. Siti Nurhaliza, S.Kep-ICU', 'nakes', 'active', 'u-r2-1', 2, 'ICU', 'Kepala Perawat ICU. Rasio 1:2. Shift Pagi.', '🟢');
  makeEntity('Ns. Heru Prasetyo, S.Kep', 'nakes', 'active', 'u-r2-1', 2, 'ICU', 'Perawat ICU Senior. Bay A1-A6.', '🟢');
  makeEntity('Ns. Dwi Cahyani, S.Kep', 'nakes', 'active', 'u-r2-1', 2, 'ICU', 'Perawat ICU. Bay B1-B6.', '🟢');
  makeEntity('Ns. Andi Pratama, S.Kep', 'nakes', 'active', 'u-r2-1', 2, 'ICU', 'Perawat NICU. Neonatus 4 pasien.', '🟢');

  // ICU Equipment
  makeEntity('Ventilator Hamilton C6 #ICU-V-01', 'equipment', 'active', 'u-r2-1', 2, 'ICU', 'SN: HC6-2025-0012. Mode: SIMV-PS. Patient: Kolonel Romli.', '🟢');
  makeEntity('ECMO Maquet Cardiohelp #ICU-E-01', 'equipment', 'active', 'u-r2-1', 2, 'ICU', 'SN: MCH-2025-001. VA-ECMO. Flow: 4.2L/min. Runtime: 72h.', '🟢');
  makeEntity('Monitor Philips Efficia CM150 #ICU-M-14', 'equipment', 'active', 'u-r2-1', 2, 'ICU', 'SN: PEC-2024-0014. 8-param. Central Station linked.', '🟢');
  makeEntity('Infusion Pump Braun Space #ICU-IP-22', 'equipment', 'active', 'u-r2-1', 2, 'ICU', 'SN: BSP-2025-0022. 3-channel. Drug: Norepinefrin 0.1mcg.', '🟢');

  // ICU Logistik
  makeEntity('Box Obat High Alert ICU-A', 'logistic', 'active', 'u-r2-1', 2, 'ICU', 'KCl, Insulin, Heparin, Norepinefrin. Double-check: OK.', '🟢');
  makeEntity('Set Kantong Darah PRC Gol.B+ #ICU-BD', 'logistic', 'active', 'u-r2-1', 2, 'ICU', '6 unit PRC B+ reserved. Cross-match verified.', '🟢');
  makeEntity('Tabung Oksigen O2 Sentral ICU', 'logistic', 'active', 'u-r2-1', 2, 'ICU', 'Manifold O2 sentral. Tekanan: 4.5 bar. Supply: NORMAL.', '🟢');

  // OK (Operating Room)
  makeEntity('Dr. Jaka Taruna, Sp.B-KBD', 'nakes', 'active', 'u-r2-2', 2, 'Ruang Operasi', 'Bedah Digestif. Laparoskopi kolesistektomi di OK-3.', '🟢');
  makeEntity('Dr. Winda Kusuma, Sp.OG', 'nakes', 'active', 'u-r2-2', 2, 'Ruang Operasi', 'Obstetri-Ginekologi. Seksio sesarea di OK-7.', '🟢');
  makeEntity('Dr. Farid Rahman, Sp.An', 'nakes', 'active', 'u-r2-2', 2, 'Ruang Operasi', 'Anestesiolog. OK-3 & OK-5 hari ini.', '🟢');
  makeEntity('Ns. Instrumentasi Tuti Herlina', 'nakes', 'active', 'u-r2-2', 2, 'Ruang Operasi', 'Perawat Instrumen. Scrub OK-3.', '🟢');
  makeEntity('Robot Bedah Da Vinci Xi #OK-RB-01', 'equipment', 'active', 'u-r2-2', 2, 'OK', 'SN: DVX-2025-001. Kalibrasi OK. Operasi: Prostatektomi scheduled 10:00.', '🟢');
  makeEntity('Mesin Anestesi Dräger Perseus A500 #OK-3', 'equipment', 'active', 'u-r2-2', 2, 'OK', 'SN: DPA-2025-003. Gas check OK. Vaporizer: Sevoflurane.', '🟢');
  makeEntity('C-Arm Siemens Cios Alpha #OK-CA-01', 'equipment', 'active', 'u-r2-2', 2, 'OK', 'SN: SCA-2025-001. Fluoro mode. DLP: 12 mGy.', '🟢');
  makeEntity('Set Instrumen Bedah Mayor #OK-SIB-01', 'logistic', 'active', 'u-r2-2', 2, 'OK', 'Set laparotomi steril. Autoclave verified 05:30.', '🟢');

  // Recovery Room
  makeEntity('Sertu Dwi Handayani', 'patient', 'active', 'u-r2-3', 2, 'Recovery', 'Post-op appendektomi. Aldrete score 8. Monitoring.', '🟢');
  makeEntity('Tn. Suroto', 'patient', 'active', 'u-r2-3', 2, 'Recovery', 'Post-op hernia inguinalis. Nyeri terkontrol VAS 3.', '🟢');
  makeEntity('Ns. Recovery Fitriani', 'nakes', 'active', 'u-r2-3', 2, 'Recovery', 'Perawat Recovery Room. Monitoring 6 pasien post-op.', '🟢');

  // ════════════════════════════════════════
  // LANTAI 3 — HEMODIALISIS, KEMO, POLIKLINIK
  // ════════════════════════════════════════
  makeEntity('Tn. Sudirman Hasan', 'patient', 'active', 'u-r3-1', 3, 'Unit HD', 'HD reguler Selasa-Kamis-Sabtu. Dialisis 4 jam. Akses: AV Fistula.', '🟢');
  makeEntity('Ny. Mariam Lubis', 'patient', 'active', 'u-r3-1', 3, 'Unit HD', 'HD rutin. CKD stage V. Dry weight: 52 kg.', '🟢');
  makeEntity('Serma (Purn) Kasman', 'patient', 'active', 'u-r3-1', 3, 'Unit HD', 'HD reguler. Nefropati diabetik. Akses: CDL.', '🟢');
  makeEntity('Dr. Nurul Hidayah, Sp.PD-KGH', 'nakes', 'active', 'u-r3-1', 3, 'Unit HD', 'Nefrolog. Supervisi 28 pasien HD hari ini.', '🟢');
  makeEntity('Ns. HD Rina Marlina', 'nakes', 'active', 'u-r3-1', 3, 'Unit HD', 'Perawat HD. Inisiasi dan monitoring mesin.', '🟢');
  makeEntity('Mesin HD Fresenius 5008S #HD-15', 'equipment', 'active', 'u-r3-1', 3, 'Unit HD', 'SN: F5S-2024-0015. UF target: 2.5L. TMP: 180mmHg.', '🟢');
  makeEntity('Mesin HD Fresenius 5008S #HD-22', 'equipment', 'idle', 'u-r3-1', 3, 'Unit HD', 'SN: F5S-2024-0022. Status: DISINFEKSI. Sesi berikutnya 13:00.', '🟡');

  // Kemoterapi
  makeEntity('Ny. Endang Supriyati', 'patient', 'active', 'u-r3-2', 3, 'Kemoterapi', 'Ca Mammae St.IIIB. Siklus AC ke-4/6. Pre-medikasi OK.', '🟢');
  makeEntity('Tn. Ruslan Effendi', 'patient', 'active', 'u-r3-2', 3, 'Kemoterapi', 'Ca Paru St.IV. Pembrolizumab siklus 8. Response: SD.', '🟢');
  makeEntity('Dr. Hesti Paramita, Sp.PD-KHOM', 'nakes', 'active', 'u-r3-2', 3, 'Kemoterapi', 'Onkolog Medik. Supervisi 15 pasien kemo hari ini.', '🟢');
  makeEntity('Infusion Pump Kemo Braun #KM-08', 'equipment', 'active', 'u-r3-2', 3, 'Kemoterapi', 'SN: BSK-2025-008. Drug: Docetaxel 75mg/m². Rate: 250ml/h.', '🟢');
  makeEntity('Box Obat Kemoterapi Siklus Harian', 'logistic', 'active', 'u-r3-2', 3, 'Kemoterapi', 'Docetaxel, Cisplatin, 5-FU, Ondansetron. Cold chain OK.', '🟢');

  // Poliklinik
  makeEntity('Dr. Sari Dewi, Sp.PD', 'nakes', 'active', 'u-r3-3', 3, 'Poliklinik', 'Internist. Jadwal poli: 60 pasien hari ini.', '🟢');
  makeEntity('Dr. Muhammad Iqbal, Sp.OT', 'nakes', 'active', 'u-r3-3', 3, 'Poliklinik', 'Ortopedi. Poli sore 15 pasien.', '🟢');
  makeEntity('Dr. Lina Hartati, Sp.A', 'nakes', 'active', 'u-r3-3', 3, 'Poliklinik', 'Pediatri. Imunisasi + kontrol anak 20 pasien.', '🟢');

  // ════════════════════════════════════════
  // LANTAI 4 — COMMAND CENTER
  // ════════════════════════════════════════
  makeEntity('Kolonel Kes. Dr. Surya Atmaja', 'nakes', 'active', 'u-r4-1', 4, 'Command Center', 'Komandan RSPPN. Briefing pagi 07:30.', '🟢');
  makeEntity('Letkol Kes. Dr. Fitri Andini', 'nakes', 'active', 'u-r4-1', 4, 'Command Center', 'Wakil Komandan. Koordinasi operasional.', '🟢');
  makeEntity('Mayor Kes. Agus Mulyadi', 'nakes', 'active', 'u-r4-1', 4, 'Command Center', 'Kepala Instalasi IT. Monitoring SIMRS.', '🟢');
  makeEntity('Teknisi IT Rendra Saputra', 'nakes', 'active', 'u-r4-3', 4, 'Data Center', 'SysAdmin. Server uptime monitoring 24/7.', '🟢');
  makeEntity('Server Rack EMR Cluster #DC-01', 'equipment', 'active', 'u-r4-3', 4, 'Data Center', 'Dell PowerEdge R760. CPU: 12%, RAM: 67%, Storage: 45%.', '🟢');
  makeEntity('Firewall FortiGate 3700F #DC-FW', 'equipment', 'active', 'u-r4-3', 4, 'Data Center', 'SN: FG3-2025-001. Throughput: 1.2 Gbps. Threats blocked: 847.', '🟢');

  // ════════════════════════════════════════
  // LANTAI 28 — HELIPAD
  // ════════════════════════════════════════
  makeEntity('Paramedis Evakuasi Kapten Rian', 'nakes', 'active', 'u-r28-1', 28, 'Helipad', 'Tim Evakuasi Udara. Standby MedEvac. Radio: Freq. 123.45.', '🟢');
  makeEntity('Kit Trauma Lapangan #HLP-01', 'logistic', 'active', 'u-r28-2', 28, 'Helipad Triage', 'Tourniquet, Chest Seal, Hemostatic Agent. Stock FULL.', '🟢');
  makeEntity('Stretcher Lipat Ferno #HLP-S-01', 'equipment', 'active', 'u-r28-2', 28, 'Helipad Triage', 'SN: FNS-2024-001. Weight cap: 250kg. Status: READY.', '🟢');

  // ════════════════════════════════════════
  // GENERATE BULK ENTITIES FOR LANTAI 5-27 (RAWAT INAP)
  // ════════════════════════════════════════
  const patientNames = [
    'Kopda Budi Setiawan', 'Letda Surya P.', 'Prajurit Yono S.', 'Serma Agus Santoso',
    'Pratu Rian Hidayat', 'Sertu Dwi Wibowo', 'Mayor Haryo P.', 'Purn. Sutejo Hadi',
    'Klg. Anisa Putri', 'PNS Wati Suryani', 'Kolonel Bambang W.', 'Letkol Dedy K.',
    'Mayor Rudi Hartono', 'PNS Jaka Supriyadi', 'Pratu Anton Cahyo', 'Tn. Eka Nugraha',
    'Ny. Lastri Handayani', 'Serka Bagus Firmansyah', 'Koptu Wahid Abdullah', 'Tn. Suherman',
    'Ny. Kusuma Wardani', 'Pratu Fandi Akbar', 'Sertu Galih Pramono', 'Lettu Rangga A.',
    'Tn. Parman Siswanto', 'Ny. Sri Mulyani', 'PNS Darto Suparno', 'Klg. Melati Sari',
    'Kopda Ridwan Kamil', 'Serma Teguh Prakoso', 'Praka Ilham Fauzi', 'Tn. Subagyo',
    'Ny. Hartini Rahayu', 'Koptu Zulkifli', 'Letda Bayu Segara', 'PNS Warsito',
    'Klg. Putri Ayu', 'Sertu Hendro W.', 'Mayor Purn. Sumarno', 'Tn. Karno Utomo'
  ];

  const nakesNames = [
    'Dr. Siti Aminah, Sp.A', 'Perawat Dina Rahayu', 'Dr. Rudi Hermawan, Sp.PD',
    'Dr. Jaka Nugroho, Sp.B', 'Ns. Rina Kartika, S.Kep', 'Perawat Eko Cahyono',
    'Bidan Sari Mulyani', 'Dr. Ahmad Syafiq, Sp.M', 'Dr. Yuni Astuti, Sp.S',
    'Perawat Budi Setiawan', 'Dr. Andi Permana, Sp.OT', 'Dr. Faris Akmal, Sp.An',
    'Ns. Fitri Handayani', 'Dr. Dewi Sulistyo, Sp.KJ', 'Perawat Agung Purnomo',
    'Ns. Lestari Wulan', 'Dr. Bagus Triawan, Sp.U', 'Bidan Anisa Rahmawati',
    'Dr. Fikri Ramadhan, Sp.P', 'Ns. Wahyu Hidayatullah'
  ];

  const equipNames = [
    'Bed Elektrik Hill-Rom', 'Monitor Vital Nihon Kohden', 'Infusion Pump Braun',
    'ECG Portable Fukuda', 'USG Mobile Mindray', 'Suction Portable Yuwell',
    'Nebulizer Omron', 'Syringe Pump Terumo', 'Pulse Oximeter Masimo',
    'Kursi Roda Wheelchair', 'Troli Obat Stainless', 'Defib AED Philips'
  ];

  const logisNames = [
    'Box Obat Rawat Inap', 'Set Infus RL 500ml', 'Tabung O2 Portable',
    'Alkes Steril Set', 'Box APD Level-3', 'Larutan NaCl 0.9%',
    'Box Kantong Darah PRC', 'Set Dressing Luka', 'Box Spuit & Needle',
    'Cairan Dextrose 5%', 'Box Sarung Tangan'
  ];

  const diagnoses = [
    'Demam Berdarah Dengue Grade II', 'Post-op Fraktur Femur', 'Pneumonia Komunitas',
    'Gastritis Erosiva', 'Diabetes Melitus Tipe 2', 'Hipertensi Grade II',
    'Appendisitis Akut Post-Op', 'Cedera Kepala Ringan', 'ISPA dengan Bronkitis',
    'CHF Eksaserbasi Akut', 'Stroke Iskemik', 'CKD Stage III',
    'Luka Bakar Grade II', 'Fraktur Radius Distal', 'Asma Bronkial Eksaserbasi',
    'Kolesistitis Akut Post-Op', 'Tumor Mammae Post-Biopsi', 'Vertigo Sentral',
    'Deep Vein Thrombosis', 'Selulitis Ekstremitas'
  ];

  const nakesDetails = [
    'Shift Pagi 07:00-14:00', 'Shift Siang 14:00-21:00', 'Shift Malam 21:00-07:00',
    'Visite pagi. 8 pasien.', 'Dinas jaga 24 jam', 'Pengawas bangsal',
    'Koordinator shift', 'Asuhan keperawatan 6 pasien'
  ];

  // Generate ~500 patients across ward floors
  for (let i = 0; i < 500; i++) {
    const floor = Math.floor(Math.random() * 23) + 5; // floors 5-27
    const roomNum = Math.floor(Math.random() * 3) + 1; // rooms 1-3
    const room = `u-r${floor}-${roomNum}`;
    const name = patientNames[Math.floor(Math.random() * patientNames.length)] + ` #${String(i + 1).padStart(3, '0')}`;
    const diag = diagnoses[Math.floor(Math.random() * diagnoses.length)];
    const statusRoll = Math.random();
    const status = statusRoll > 0.92 ? 'critical' : statusRoll > 0.8 ? 'idle' : 'active';
    const vs = status === 'critical' ? '🔴' : status === 'idle' ? '🟡' : '🟢';
    makeEntity(name, 'patient', status, room, floor, `Bangsal Lt.${floor}`, diag + `. Rawat hari ke-${Math.floor(Math.random() * 14) + 1}.`, vs);
  }

  // Generate ~350 nakes across all ward floors
  for (let i = 0; i < 350; i++) {
    const floor = Math.floor(Math.random() * 23) + 5;
    const roomNum = (Math.random() > 0.3) ? (Math.floor(Math.random() * 3) + 1) : 4; // some at nurse station
    const room = `u-r${floor}-${roomNum}`;
    const name = nakesNames[Math.floor(Math.random() * nakesNames.length)] + ` #${String(i + 1).padStart(3, '0')}`;
    const det = nakesDetails[Math.floor(Math.random() * nakesDetails.length)];
    const status = Math.random() > 0.9 ? 'idle' : 'active';
    makeEntity(name, 'nakes', status, room, floor, `Bangsal Lt.${floor}`, det, status === 'idle' ? '🟡' : '🟢');
  }

  // Generate ~200 equipment across ward floors
  for (let i = 0; i < 200; i++) {
    const floor = Math.floor(Math.random() * 23) + 5;
    const roomNum = Math.floor(Math.random() * 4) + 1;
    const room = `u-r${floor}-${roomNum}`;
    const name = equipNames[Math.floor(Math.random() * equipNames.length)] + ` #${String(i + 1).padStart(3, '0')}`;
    const statusRoll = Math.random();
    const status = statusRoll > 0.85 ? 'idle' : statusRoll > 0.95 ? 'critical' : 'active';
    const sn = `SN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    makeEntity(name, 'equipment', status, room, floor, `Lt.${floor}`, `${sn}. Kalibrasi terakhir: ${Math.floor(Math.random() * 28) + 1} Feb 2026.`, status === 'idle' ? '🟡' : '🟢');
  }

  // Generate ~100 logistic across ward floors & gedung lama
  for (let i = 0; i < 100; i++) {
    const isLama = Math.random() > 0.7;
    let floor, room;
    if (isLama) {
      floor = Math.floor(Math.random() * 4) + 1;
      room = `l-r${floor}-1`;
    } else {
      floor = Math.floor(Math.random() * 23) + 5;
      const roomNum = Math.floor(Math.random() * 4) + 1;
      room = `u-r${floor}-${roomNum}`;
    }
    const name = logisNames[Math.floor(Math.random() * logisNames.length)] + ` #${String(i + 1).padStart(3, '0')}`;
    const stock = Math.floor(Math.random() * 100);
    const status = stock < 15 ? 'critical' : stock < 30 ? 'idle' : 'active';
    const vs = status === 'critical' ? '🔴' : status === 'idle' ? '🟡' : '🟢';
    makeEntity(name, 'logistic', status, room, floor, isLama ? `Gudang Lt.${floor}` : `Bangsal Lt.${floor}`, `Stock: ${stock}%. Exp. check: ${status === 'critical' ? 'PERLU RESUPPLY' : 'OK'}.`, vs);
  }

  // Generate ~50 entities for Asrama Perawat
  for (let i = 0; i < 50; i++) {
    const floor = Math.floor(Math.random() * 6) + 1;
    const roomNum = Math.random() > 0.5 ? 1 : 2;
    const room = `a-r${floor}-${roomNum}`;
    const name = nakesNames[Math.floor(Math.random() * nakesNames.length)] + ` (Asrama) #${String(i + 1).padStart(2, '0')}`;
    makeEntity(name, 'nakes', Math.random() > 0.3 ? 'idle' : 'active', room, floor, `Asrama Lt.${floor}`, 'Off-duty / Istirahat. Shift berikutnya malam.', '🟡');
  }

  return entities;
};

export const rsppnBuildingData = {
  buildings: [
    {
      id: 'bld-utama', name: 'Gedung Utama (28 Lantai)',
      geoBounds: { minLat: -6.2686, maxLat: -6.2680, minLng: 106.7660, maxLng: 106.7666 },
      floors: generateMainBuildingFloors()
    },
    {
      id: 'bld-asrama', name: 'Gedung Asrama Perawat',
      geoBounds: { minLat: -6.2691, maxLat: -6.2687, minLng: 106.7666, maxLng: 106.7671 },
      floors: generateAsramaFloors()
    },
    {
      id: 'bld-lama', name: 'Gedung Lama (4 Lantai)',
      geoBounds: { minLat: -6.2679, maxLat: -6.2675, minLng: 106.7668, maxLng: 106.7672 },
      floors: generateGedungLamaFloors()
    }
  ],
  entities: generateDynamicEntities()
};
