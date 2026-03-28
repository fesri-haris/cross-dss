// ═══════════════════════════════════════════════════
// IKHI — RFID Tracking Data (Per-RS Buildings, Entities, E-Medical Record)
// ═══════════════════════════════════════════════════

import { rsppnBuildingData } from './rsppnData';

// Building polygons for map overlay (simplified GeoJSON-style coordinates)
export const buildingPolygons = {
  1: [ // RSPPN Panglima Besar Soedirman (KML/SHP Vector Mapping Update)
    { id: 'bld-utama', name: 'Gedung Utama (28 Lantai)', coords: [
        [-6.2680, 106.7660], [-6.2680, 106.7666], [-6.2686, 106.7666], [-6.2686, 106.7660]
      ], color: '#3b82f6' },
    { id: 'bld-asrama', name: 'Gedung Asrama Perawat', coords: [
        [-6.2687, 106.7666], [-6.2687, 106.7671], [-6.2691, 106.7671], [-6.2691, 106.7666]
      ], color: '#10b981' },
    { id: 'bld-lama', name: 'Gedung Lama (4 Lantai)', coords: [
        [-6.2675, 106.7668], [-6.2675, 106.7672], [-6.2679, 106.7672], [-6.2679, 106.7668]
      ], color: '#f59e0b' },
  ],
  2: [ // RSPAD Gatot Soebroto
    { id: 'bld-2a', name: 'Gedung Utama', coords: [[-6.1758, 106.8374], [-6.1758, 106.8381], [-6.1764, 106.8381], [-6.1764, 106.8374]], color: '#3b82f6' },
    { id: 'bld-2b', name: 'Gedung Pavilyun', coords: [[-6.1762, 106.8370], [-6.1762, 106.8374], [-6.1766, 106.8374], [-6.1766, 106.8370]], color: '#8b5cf6' },
  ],
  9: [ // RSAL Mintohardjo
    { id: 'bld-9a', name: 'Gedung Utama', coords: [[-6.2106, 106.8117], [-6.2106, 106.8124], [-6.2113, 106.8124], [-6.2113, 106.8117]], color: '#3b82f6' },
    { id: 'bld-9b', name: 'Gedung Hiperbarik', coords: [[-6.2110, 106.8125], [-6.2110, 106.8129], [-6.2114, 106.8129], [-6.2114, 106.8125]], color: '#06b6d4' },
  ],
  12: [ // RSAU Esnawan Antariksa
    { id: 'bld-12a', name: 'Gedung Utama', coords: [[-6.2567, 106.8914], [-6.2567, 106.8921], [-6.2574, 106.8921], [-6.2574, 106.8914]], color: '#3b82f6' },
    { id: 'bld-12b', name: 'Gedung Aviation Medicine', coords: [[-6.2571, 106.8908], [-6.2571, 106.8913], [-6.2576, 106.8913], [-6.2576, 106.8908]], color: '#f97316' },
  ],
};

// Per-RS Building & Floor Layouts
export const rsBuildingData = {
  // ═══ RSPPN Soedirman (Ultra-Detailed 4 Buildings) ═══
  1: rsppnBuildingData,

  // ═══ RSPAD Gatot Soebroto ═══
  2: {
    buildings: [{
      id: 'bld-2a', name: 'Gedung Utama',
      geoBounds: { minLat: -6.1764, maxLat: -6.1758, minLng: 106.8374, maxLng: 106.8381 },
      floors: [
        {
          floor: 1, name: 'Lantai 1 — IGD & Poliklinik', rooms: [
            { id: 'g2-r1-1', name: 'IGD', type: 'emergency', x: 3, y: 3, w: 45, h: 42, capacity: 30, occupied: 22, equipment: ['Defib x4', 'Monitor x8', 'Ventilator x4'] },
            { id: 'g2-r1-2', name: 'Poliklinik', type: 'outpatient', x: 52, y: 3, w: 45, h: 42, capacity: 15, occupied: 10, equipment: ['USG x2', 'EKG x3'] },
            { id: 'g2-r1-3', name: 'Radiologi', type: 'diagnostic', x: 3, y: 52, w: 45, h: 42, capacity: 6, occupied: 4, equipment: ['MRI x1', 'CT-Scan x2', 'X-Ray x3'] },
            { id: 'g2-r1-4', name: 'Farmasi', type: 'pharmacy', x: 52, y: 52, w: 45, h: 42, capacity: null, occupied: null, equipment: ['Dispenser x2'] },
          ]
        },
        {
          floor: 2, name: 'Lantai 2 — ICU & Bedah', rooms: [
            { id: 'g2-r2-1', name: 'ICU', type: 'icu', x: 3, y: 3, w: 45, h: 42, capacity: 20, occupied: 16, equipment: ['Ventilator x16', 'Monitor x20', 'ECMO x1'] },
            { id: 'g2-r2-2', name: 'Kamar Operasi', type: 'operating', x: 52, y: 3, w: 45, h: 42, capacity: 8, occupied: 3, equipment: ['Mesin Anestesi x8', 'Robot Surgery x1'] },
            { id: 'g2-r2-3', name: 'Bangsal Prajurit', type: 'ward', x: 3, y: 52, w: 45, h: 42, capacity: 50, occupied: 38, equipment: ['Monitor x10', 'Infusion Pump x20'] },
            { id: 'g2-r2-4', name: 'Recovery', type: 'recovery', x: 52, y: 52, w: 45, h: 42, capacity: 12, occupied: 8, equipment: ['Monitor x12'] },
          ]
        },
      ]
    }],
    entities: [
      { id: 'GP-2001', type: 'patient', name: 'Koptu Joko Sudibyo', location: 'ICU', status: 'critical', floor: 2, x: 22, y: 22, rfidTag: 'RFID-GP-2001', detail: '29th, Prajurit — Luka Tembak Latihan', room: 'g2-r2-1', lastScan: '07:42 WIB', vstatus: '🔴' },
      { id: 'GP-2002', type: 'patient', name: 'Tn. Ridwan Khair', location: 'Bangsal', status: 'active', floor: 2, x: 22, y: 68, rfidTag: 'RFID-GP-2002', detail: '45th, Veteran — Recovery Bedah Lutut', room: 'g2-r2-3', lastScan: '07:38 WIB', vstatus: '🟢' },
      { id: 'GN-2001', type: 'nakes', name: 'Dr. Maya Putri, Sp.BS', location: 'OK', status: 'active', floor: 2, x: 72, y: 22, rfidTag: 'RFID-GN-2001', detail: 'Sp. Bedah Saraf, Shift Pagi', room: 'g2-r2-2', lastScan: '07:44 WIB', vstatus: '🟢' },
      { id: 'GV-2001', type: 'equipment', name: 'Robot Surgery Da Vinci', location: 'OK', status: 'active', floor: 2, x: 78, y: 18, rfidTag: 'RFID-GV-2001', detail: 'SN: DAV-2025-001', room: 'g2-r2-2', lastScan: '07:40 WIB', vstatus: '🟢' },
    ],
  },

  // ═══ RSAL Mintohardjo ═══
  9: {
    buildings: [{
      id: 'bld-9a', name: 'Gedung Utama',
      geoBounds: { minLat: -6.2113, maxLat: -6.2106, minLng: 106.8117, maxLng: 106.8124 },
      floors: [
        {
          floor: 1, name: 'Lantai 1 — IGD & Hiperbarik', rooms: [
            { id: 'm9-r1-1', name: 'IGD', type: 'emergency', x: 3, y: 3, w: 45, h: 42, capacity: 18, occupied: 12, equipment: ['Defib x2', 'Monitor x6'] },
            { id: 'm9-r1-2', name: 'Chamber Hiperbarik', type: 'specialist', x: 52, y: 3, w: 45, h: 42, capacity: 6, occupied: 3, equipment: ['HBO Chamber x2', 'O2 System x1'] },
            { id: 'm9-r1-3', name: 'Poliklinik', type: 'outpatient', x: 3, y: 52, w: 45, h: 42, capacity: 12, occupied: 8, equipment: ['USG x1', 'EKG x2'] },
            { id: 'm9-r1-4', name: 'Farmasi', type: 'pharmacy', x: 52, y: 52, w: 45, h: 42, capacity: null, occupied: null, equipment: ['Dispenser x1'] },
          ]
        },
        {
          floor: 2, name: 'Lantai 2 — ICU & Rawat Inap', rooms: [
            { id: 'm9-r2-1', name: 'ICU', type: 'icu', x: 3, y: 3, w: 45, h: 42, capacity: 10, occupied: 7, equipment: ['Ventilator x6', 'Monitor x10'] },
            { id: 'm9-r2-2', name: 'Bangsal Maritim', type: 'ward', x: 52, y: 3, w: 45, h: 42, capacity: 35, occupied: 25, equipment: ['Monitor x8', 'Infusion Pump x12'] },
            { id: 'm9-r2-3', name: 'VIP Laksamana', type: 'vip', x: 3, y: 52, w: 45, h: 42, capacity: 8, occupied: 4, equipment: ['Monitor x8', 'TV x8'] },
            { id: 'm9-r2-4', name: 'Kamar Operasi', type: 'operating', x: 52, y: 52, w: 45, h: 42, capacity: 3, occupied: 1, equipment: ['Mesin Anestesi x3'] },
          ]
        },
      ]
    }],
    entities: [
      { id: 'MP-9001', type: 'patient', name: 'Klk. Arief Budiman', location: 'HBO', status: 'active', floor: 1, x: 72, y: 22, rfidTag: 'RFID-MP-9001', detail: '35th, Penyelam — Decompression Sickness', room: 'm9-r1-2', lastScan: '07:40 WIB', vstatus: '🟢' },
      { id: 'MN-9001', type: 'nakes', name: 'Dr. Hasan, Sp.KL', location: 'ICU', status: 'active', floor: 2, x: 22, y: 22, rfidTag: 'RFID-MN-9001', detail: 'Sp. Kedokteran Kelautan, Shift Pagi', room: 'm9-r2-1', lastScan: '07:42 WIB', vstatus: '🟢' },
    ],
  },

  // ═══ RSAU Esnawan Antariksa ═══
  12: {
    buildings: [{
      id: 'bld-12a', name: 'Gedung Utama',
      geoBounds: { minLat: -6.2574, maxLat: -6.2567, minLng: 106.8914, maxLng: 106.8921 },
      floors: [
        {
          floor: 1, name: 'Lantai 1 — IGD & Aviation Med', rooms: [
            { id: 'a12-r1-1', name: 'IGD', type: 'emergency', x: 3, y: 3, w: 45, h: 42, capacity: 16, occupied: 10, equipment: ['Defib x2', 'Monitor x5'] },
            { id: 'a12-r1-2', name: 'Aviation Medicine', type: 'specialist', x: 52, y: 3, w: 45, h: 42, capacity: 8, occupied: 5, equipment: ['Altitude Chamber x1', 'Spatial Disorientation Trainer x1'] },
            { id: 'a12-r1-3', name: 'Poliklinik', type: 'outpatient', x: 3, y: 52, w: 45, h: 42, capacity: 10, occupied: 7, equipment: ['USG x1', 'EKG x2'] },
            { id: 'a12-r1-4', name: 'Farmasi', type: 'pharmacy', x: 52, y: 52, w: 45, h: 42, capacity: null, occupied: null, equipment: ['Dispenser x1'] },
          ]
        },
        {
          floor: 2, name: 'Lantai 2 — ICU & Rawat Inap', rooms: [
            { id: 'a12-r2-1', name: 'ICU', type: 'icu', x: 3, y: 3, w: 45, h: 42, capacity: 10, occupied: 6, equipment: ['Ventilator x6', 'Monitor x10'] },
            { id: 'a12-r2-2', name: 'Bangsal Penerbang', type: 'ward', x: 52, y: 3, w: 45, h: 42, capacity: 30, occupied: 18, equipment: ['Monitor x8', 'Infusion Pump x10'] },
            { id: 'a12-r2-3', name: 'VIP Pilot', type: 'vip', x: 3, y: 52, w: 45, h: 42, capacity: 6, occupied: 3, equipment: ['Monitor x6', 'TV x6'] },
            { id: 'a12-r2-4', name: 'Kamar Operasi', type: 'operating', x: 52, y: 52, w: 45, h: 42, capacity: 3, occupied: 1, equipment: ['Mesin Anestesi x3'] },
          ]
        },
      ]
    }],
    entities: [
      { id: 'AP-12001', type: 'patient', name: 'Kpt. Andi Pilot', location: 'AviMed', status: 'active', floor: 1, x: 72, y: 22, rfidTag: 'RFID-AP-12001', detail: '33th, Pilot F-16 — Medical Check-Up Tahunan', room: 'a12-r1-2', lastScan: '07:38 WIB', vstatus: '🟢' },
      { id: 'AN-12001', type: 'nakes', name: 'Dr. Wibowo, Sp.KP', location: 'AviMed', status: 'active', floor: 1, x: 68, y: 28, rfidTag: 'RFID-AN-12001', detail: 'Sp. Kedokteran Penerbangan, Shift Pagi', room: 'a12-r1-2', lastScan: '07:40 WIB', vstatus: '🟢' },
    ],
  },
};

// ═══ AUTO-GENERATE BUILDING POLYGONS FOR ALL RS ═══
// Generate realistic building polygon outlines for hospitals that don't have explicit data
(function generateMissingPolygons() {
  const allHospitalsList = [
    { id:1, lat:-6.2686875, lng:106.7660625 },
    { id:2, lat:-6.1761199, lng:106.8377488 },
    { id:3, lat:-6.885751, lng:107.5349183 },
    { id:4, lat:-8.6634619, lng:115.2194491 },
    { id:5, lat:-7.4678148, lng:110.2260799 },
    { id:6, lat:-1.2736922, lng:116.8289218 },
    { id:7, lat:-7.989864, lng:112.6204795 },
    { id:8, lat:-0.9510264, lng:100.3720251 },
    { id:9, lat:-6.21092, lng:106.81201 },
    { id:10, lat:-7.3093214, lng:112.7380654 },
    { id:11, lat:-6.9838093, lng:110.4099893 },
    { id:12, lat:-6.2570286, lng:106.8917371 },
    { id:13, lat:-6.863781, lng:107.605075 },
    { id:14, lat:-6.9942118, lng:110.4074897 },
    { id:15, lat:-6.9835647, lng:107.5639775 },
    { id:16, lat:0.5070677, lng:101.4477793 },
    { id:17, lat:-5.0718942, lng:119.5350017 },
  ];
  const forceColors = { AD: '#3b82f6', AL: '#06b6d4', AU: '#f97316' };
  const hospitalForces = { 1:'AD',2:'AD',3:'AD',4:'AD',5:'AD',6:'AD',7:'AD',8:'AD',9:'AL',10:'AL',11:'AL',12:'AU',13:'AU',14:'AU',15:'AU',16:'AU',17:'AU' };
  const hospitalSizes = { 1:0.0003,2:0.00035,3:0.00025,4:0.00022,5:0.0002,6:0.00018,7:0.00025,8:0.0002,9:0.00032,10:0.00025,11:0.00016,12:0.0003,13:0.00022,14:0.00016,15:0.00015,16:0.00012,17:0.00016 };

  allHospitalsList.forEach(h => {
    if (buildingPolygons[h.id]) return; // Skip if already defined
    const s = hospitalSizes[h.id] || 0.0002;
    const color = forceColors[hospitalForces[h.id]] || '#3b82f6';
    buildingPolygons[h.id] = [
      {
        id: `bld-${h.id}a`, name: 'Gedung Utama',
        coords: [
          [h.lat - s, h.lng - s * 1.2],
          [h.lat - s, h.lng + s * 1.2],
          [h.lat + s, h.lng + s * 1.2],
          [h.lat + s, h.lng - s * 1.2],
        ],
        color
      },
      {
        id: `bld-${h.id}b`, name: 'Gedung Penunjang',
        coords: [
          [h.lat + s * 1.1, h.lng - s * 0.5],
          [h.lat + s * 1.1, h.lng + s * 0.8],
          [h.lat + s * 1.5, h.lng + s * 0.8],
          [h.lat + s * 1.5, h.lng - s * 0.5],
        ],
        color: '#10b981'
      }
    ];
  });
})();

// Auto-fill remaining RS IDs with data from allHospitalRfidData
// (imported by RFIDTracking.jsx — this keeps rsBuildingData as a legacy lookup)
[3, 4, 5, 6, 7, 8, 10, 11, 13, 14, 15, 16, 17].forEach(id => {
  if (!rsBuildingData[id]) {
    rsBuildingData[id] = { buildings: [], entities: [] };
  }
});

// E-Medical Record mock data (linked to RFID entities)
export const eMedicalRecords = {
  'ENT-1000': { mrNo: 'MR-2026-1000', name: 'Pratu Dimas Prabowo', age: 24, rank: 'Prajurit Satu', unit: 'Yonif 315/Garuda', bloodType: 'O+', allergies: ['Penisilin'], diagnosis: 'Luka Tembak Latihan Tempur — Hemoragik Aktif', vitals: { bp: '85/55', hr: 128, temp: 37.4, spo2: 89 }, admDate: '26 Mar 2026', doctor: 'Dr. Ahmad Rizal, Sp.B', notes: 'CRITICAL: Perdarahan aktif abdomen. Laparotomi emergensi. Transfusi PRC 4 unit ongoing.' },
  'ENT-1001': { mrNo: 'MR-2026-1001', name: 'Kopda Rizki Setiawan', age: 28, rank: 'Kopral Dua', unit: 'Yonkav 2/Kostrad', bloodType: 'A+', allergies: [], diagnosis: 'Kecelakaan Kendaraan Taktis — Fraktur Multiple', vitals: { bp: '95/65', hr: 112, temp: 37.0, spo2: 92 }, admDate: '26 Mar 2026', doctor: 'Dr. Ahmad Rizal, Sp.B', notes: 'GCS 11. Fr. Tibia bilateral + Fr. Costa 5-7. CT-Scan: SDH minimal. Observasi ICU.' },
  'ENT-1002': { mrNo: 'MR-2026-1002', name: 'Ny. Siti Rahmawati', age: 42, rank: 'Istri Perwira', unit: '-', bloodType: 'B-', allergies: ['Sulfa','NSAID'], diagnosis: 'Suspek Emboli Paru — Sesak Napas Akut', vitals: { bp: '100/70', hr: 108, temp: 36.9, spo2: 91 }, admDate: '26 Mar 2026', doctor: 'Dr. Sari Wulandari, Sp.EM', notes: 'D-dimer elevated (4200). CT-PA scheduled URGENT. Antikoagulan started.' },
  'ENT-1004': { mrNo: 'MR-2026-1004', name: 'Tn. Abdul Malik', age: 58, rank: 'PNS Kemhan', unit: 'Ditjen Strahan', bloodType: 'AB+', allergies: [], diagnosis: 'STEMI Anterior — ST-Elevasi V1-V4', vitals: { bp: '90/60', hr: 98, temp: 36.5, spo2: 95 }, admDate: '26 Mar 2026', doctor: 'Dr. Rini Anggraeni, Sp.JP', notes: 'DOOR-TO-BALLOON target <90min. Cath Lab standby. Aspirin+Clopidogrel loaded.' },
  'ENT-1030': { mrNo: 'MR-2026-1030', name: 'Kolonel Romli Setiabudi', age: 52, rank: 'Kolonel', unit: 'Kodam Jaya', bloodType: 'A+', allergies: [], diagnosis: 'Post-CABG x3 Graft H+1', vitals: { bp: '105/68', hr: 88, temp: 37.2, spo2: 96 }, admDate: '25 Mar 2026', doctor: 'Dr. Irfan Hakim, Sp.An-KIC', notes: 'Hemodinamik labil, vasopressor titrasi turun. Chest tube drain 150cc/6jam.' },
  'ENT-1031': { mrNo: 'MR-2026-1031', name: 'Serda Budi Prasetyo', age: 32, rank: 'Sersan Dua', unit: 'Yonkav 1/Kostrad', bloodType: 'B+', allergies: ['Sulfa'], diagnosis: 'Trauma Multiple — Fraktur Femur + Contusio Pulmo', vitals: { bp: '90/60', hr: 115, temp: 37.1, spo2: 93 }, admDate: '24 Mar 2026', doctor: 'Dr. Ahmad Rizal, Sp.B', notes: 'On ventilator SIMV PS12/PEEP8. Rencana ORIF femur jika hemodinamik stabil.' },
  'ENT-1032': { mrNo: 'MR-2026-1032', name: 'Tn. Ahmad Fauzi', age: 45, rank: 'Prajurit Dua', unit: 'Yonif 315/Garuda', bloodType: 'A+', allergies: ['Penisilin'], diagnosis: 'Demam Berdarah Dengue (Grade III)', vitals: { bp: '100/65', hr: 104, temp: 38.8, spo2: 96 }, admDate: '23 Mar 2026', doctor: 'Dr. Sari Dewi, Sp.PD', notes: 'Trombosit 18.000 (↓). Hematokrit 46%. Transfusi TC ke-3 ongoing. Warning sign (+).' },
  'ENT-1033': { mrNo: 'MR-2026-1033', name: 'Ny. Ratna Megawati', age: 38, rank: 'Keluarga Prajurit', unit: '-', bloodType: 'O+', allergies: [], diagnosis: 'Post-Op Appendektomi — Stabil', vitals: { bp: '110/70', hr: 78, temp: 36.8, spo2: 99 }, admDate: '24 Mar 2026', doctor: 'Dr. Irfan Hakim, Sp.An', notes: 'Post-op H+2. Mobilisasi aktif. Rencana pulang besok jika flatus (+).' },
  'ENT-1034': { mrNo: 'MR-2026-1034', name: 'Letda Surya Dharma', age: 29, rank: 'Letnan Dua', unit: 'Yonif Raider 400', bloodType: 'O+', allergies: ['Kodein'], diagnosis: 'Luka Bakar Derajat II-III, 40% BSA', vitals: { bp: '88/55', hr: 122, temp: 38.5, spo2: 94 }, admDate: '25 Mar 2026', doctor: 'Dr. Jaka Taruna, Sp.B-KBD', notes: 'CRITICAL: Debridement ke-2 scheduled. Resusitasi cairan Parkland formula. Gram (-) sepsis surveillance.' },
  'ENT-1036': { mrNo: 'MR-2026-1036', name: 'Tn. Hendra Kusnadi', age: 52, rank: 'PNS Kemhan', unit: 'Ditjen Kuathan', bloodType: 'AB+', allergies: [], diagnosis: 'Stroke Iskemik H+5 — Rehabilitasi', vitals: { bp: '130/85', hr: 72, temp: 36.5, spo2: 98 }, admDate: '20 Mar 2026', doctor: 'Dr. Yoga Pratama, Sp.KFR', notes: 'Motorik kanan membaik (4/5). Fisioterapi aktif. Target mobilisasi mandiri H+10.' },
  'ENT-1037': { mrNo: 'MR-2026-1037', name: 'Brigjen (Purn) Soetaryo', age: 68, rank: 'Brigadir Jenderal (Purn)', unit: 'TNI AD', bloodType: 'A-', allergies: ['ACE Inhibitor'], diagnosis: 'CHF Eksaserbasi Akut — NYHA III', vitals: { bp: '145/92', hr: 98, temp: 36.7, spo2: 93 }, admDate: '25 Mar 2026', doctor: 'Dr. Rini Anggraeni, Sp.JP', notes: 'Dobutamin 5mcg/kg/min. Furosemide drip. Echo: EF 28%. Rencana CRT-D evaluation.' },
  'ENT-1045': { mrNo: 'MR-2026-1045', name: 'Tn. Sudirman Hasan', age: 55, rank: 'Serma (Purn)', unit: 'TNI AD', bloodType: 'B+', allergies: [], diagnosis: 'CKD Stage V on HD — Nefropati Diabetik', vitals: { bp: '150/95', hr: 82, temp: 36.6, spo2: 97 }, admDate: '23 Mar 2026 (Reguler)', doctor: 'Dr. Nurul Hidayah, Sp.PD-KGH', notes: 'HD reguler Selasa-Kamis-Sabtu. Dry weight 68kg. Interdialytic weight gain 2.5kg. Kt/V target >1.2.' },
  'ENT-1050': { mrNo: 'MR-2026-1050', name: 'Ny. Endang Supriyati', age: 49, rank: 'Istri Perwira', unit: '-', bloodType: 'O+', allergies: ['Metoclopramide'], diagnosis: 'Ca Mammae St.IIIB — Kemoterapi Siklus 4/6', vitals: { bp: '115/75', hr: 82, temp: 36.9, spo2: 98 }, admDate: '26 Mar 2026 (Day Care)', doctor: 'Dr. Hesti Paramita, Sp.PD-KHOM', notes: 'Regimen AC (Doxorubicin + Cyclophosphamide). Pre-medikasi Ondansetron OK. Leukosit pre: 4200.' },
  'ENT-1019': { mrNo: 'MR-2026-1019', name: 'Mayor (Purn) Sutejo', age: 62, rank: 'Mayor (Purn)', unit: 'TNI AD', bloodType: 'A+', allergies: [], diagnosis: 'Rehabilitasi Post-Amputasi Below Knee Sinistra', vitals: { bp: '125/80', hr: 76, temp: 36.5, spo2: 99 }, admDate: '15 Mar 2026', doctor: 'Dr. Yoga Pratama, Sp.KFR', notes: 'Sesi fisioterapi ke-12. Prosthesis fitting scheduled minggu depan. Stump healed baik.' },
  'ENT-1020': { mrNo: 'MR-2026-1020', name: 'Koptu Arman Maulana', age: 35, rank: 'Kopral Satu', unit: 'Denpal 1 Kostrad', bloodType: 'B+', allergies: ['Kodein'], diagnosis: 'Post-Stroke Iskemik — Rehabilitasi Motorik', vitals: { bp: '128/82', hr: 74, temp: 36.4, spo2: 98 }, admDate: '18 Mar 2026', doctor: 'Dr. Yoga Pratama, Sp.KFR', notes: 'Motorik kanan perbaikan 60%. Bicara membaik. Target mobilisasi mandiri H+14. Exoskeleton rehab sesi ke-5.' },
};

// Room type colors & icons
export const roomTypeConfig = {
  emergency: { color: '#ef4444', icon: '🚨', label: 'IGD' },
  icu: { color: '#f59e0b', icon: '🫀', label: 'ICU' },
  ward: { color: '#3b82f6', icon: '🛏️', label: 'Bangsal' },
  vip: { color: '#8b5cf6', icon: '👑', label: 'VIP' },
  operating: { color: '#ec4899', icon: '🔪', label: 'OK' },
  recovery: { color: '#06b6d4', icon: '💊', label: 'Recovery' },
  outpatient: { color: '#10b981', icon: '🏥', label: 'Poliklinik' },
  diagnostic: { color: '#6366f1', icon: '🔬', label: 'Diagnostik' },
  pharmacy: { color: '#14b8a6', icon: '💊', label: 'Farmasi' },
  lab: { color: '#a855f7', icon: '🧪', label: 'Lab' },
  admin: { color: '#64748b', icon: '📋', label: 'Admin' },
  specialist: { color: '#e879f9', icon: '⚕️', label: 'Spesialis' },
  consultation: { color: '#0ea5e9', icon: '🗣️', label: 'Konsultasi' },
  meeting: { color: '#78716c', icon: '📊', label: 'Rapat' },
  rehab: { color: '#34d399', icon: '🦿', label: 'Rehabilitasi' },
};

// Entity type config
export const entityTypeConfig = {
  patient: { color: '#3b82f6', icon: '🏥', label: 'Pasien', dotColor: '#3b82f6' },
  nakes: { color: '#10b981', icon: '👨‍⚕️', label: 'Tenaga Medis', dotColor: '#10b981' },
  equipment: { color: '#f59e0b', icon: '⚙️', label: 'Peralatan', dotColor: '#f59e0b' },
  logistic: { color: '#8b5cf6', icon: '📦', label: 'Logistik', dotColor: '#8b5cf6' },
};
