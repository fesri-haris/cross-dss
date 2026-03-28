// ═══════════════════════════════════════════════════════════════════
// ALL HOSPITAL RFID DATA — Complete Data for 17 RS Kemhan
// Setiap RS memiliki floor plan, rooms, equipment & entities realistis
// ═══════════════════════════════════════════════════════════════════

import { hospitals } from './hospitalData';

// ═══ ROOM TYPE CONFIG ═══
const roomTypes = ['emergency','icu','operating','diagnostic','pharmacy','inpatient','outpatient','specialist','admin','meeting','rehab','recovery','laboratory','radiology','nursery'];

// ═══ REALISTIC INDONESIAN NAMES ═══
const maleFirst = ['Agus','Budi','Cahyo','Dimas','Eko','Fajar','Galih','Hendra','Irfan','Joko','Krisna','Lutfi','Maulana','Nugroho','Oki','Purnomo','Qori','Rizal','Suryo','Taufik','Umar','Vino','Wahyu','Yanuar','Zaki','Adi','Bayu','Candra','Dwi','Ferdi','Gunawan','Hadi','Imam','Jaya','Kurnia','Lukman','Mansur','Nanda','Okta','Panji','Rendra','Sigit','Teguh','Ujang','Viktor','Wawan','Yusuf','Zainal','Arief','Bambang'];
const femaleFirst = ['Ani','Bunga','Citra','Dewi','Eka','Fitri','Gita','Hani','Ika','Jelita','Kartini','Laras','Mega','Nina','Oktavia','Putri','Rani','Sari','Tia','Utami','Vera','Wati','Yuni','Zahra','Ayu','Bella','Clara','Dina','Endah','Febi','Gina','Hesti','Indah','Julia','Kamila','Lina','Mawar','Nisa','Olla','Pipit','Rini','Susi','Tari','Ulfa','Vira','Winda','Yanti','Zara','Amelia','Bintang'];
const lastNames = ['Setiawan','Prabowo','Santoso','Wibowo','Saputra','Nugraha','Firmansyah','Gunawan','Suryadi','Hermawan','Kurniawan','Maharani','Widodo','Arifin','Budiman','Cahyono','Darmawan','Effendi','Fauzi','Hakim','Iskandar','Junaidi','Kartika','Lesmana','Maulana','Nasution','Oesman','Putra','Qureshi','Rahman','Sudirman','Tarigan','Utomo','Pratama','Suharto','Wijaya','Handoko','Wardoyo','Supriadi','Damayanti'];

const ranks = ['Pratu','Praka','Kopda','Koptu','Serda','Sertu','Serka','Serma','Peltu','Pelda','Letda','Lettu','Kapten','Mayor','Letkol','Kolonel'];
const civilRanks = ['PNS','Tn.','Ny.','An.','Istri Perwira','Keluarga Prajurit'];
const bloodTypes = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const units = ['Kodam Jaya','Kostrad','Yonif 315','Yonkav 2','Brigif 1','Denma Mabes','Paspampres','Korem 052','Kodim 0505','Diskes AD','Diskes AL','Diskes AU','PNS Kemhan','Koarmatim','Koarmabar','Lanud Halim','Lanud Husein','Kopassus','Marinir','Angkasa'];

// ═══ HOSPITAL SPECIALTY PROFILES ═══
const hospitalProfiles = {
  // RSPPN - already has its own data in rsppnData.js, skip generation
  1: null,
  // RSPAD Gatot Soebroto - Type A, AD, largest AD hospital
  2: { floors: 18, prefix: 'gat', specialRooms: ['Trauma Center','Bedah Jantung','Bedah Saraf','Onkologi','Kedokteran Nuklir','Bank Darah','Cath Lab','MRI 3T','CT 128-Slice','Rehabilitasi Militer'], entityScale: 1.8 },
  // RSAD Dustira - Type B, AD
  3: { floors: 10, prefix: 'dst', specialRooms: ['Bedah Umum','Orthopedi','Rehabilitasi Medik','Penyakit Dalam','Hemodialisis','Rawat Intensif'], entityScale: 1.2 },
  // RSAD Udayana - Type B, AD
  4: { floors: 8, prefix: 'udy', specialRooms: ['Bedah Plastik','Rehabilitasi','Penyakit Tropis','Orthopedi','Hemodialisis','Poliklinik Gigi'], entityScale: 1.0 },
  // RSAD dr. Soedjono - Type C, AD
  5: { floors: 6, prefix: 'sdj', specialRooms: ['Penyakit Dalam','Bedah Umum','Anak','THT','Radiologi Dasar'], entityScale: 0.75 },
  // RSAD dr. R. Hardjanto - Type C, AD
  6: { floors: 5, prefix: 'hdj', specialRooms: ['Bedah Umum','Penyakit Dalam','Kebidanan','IGD Terpadu'], entityScale: 0.6 },
  // RSAD dr. Soepraoen - Type B, AD
  7: { floors: 10, prefix: 'spr', specialRooms: ['Bedah Saraf','Onkologi','Kardiologi','Penyakit Tropis','Rehabilitasi','Laboratorium Patologi'], entityScale: 1.15 },
  // RSAD dr. Reksodiwiryo - Type C, AD
  8: { floors: 6, prefix: 'rkd', specialRooms: ['Penyakit Dalam','Bedah Umum','Anak','Obstetri & Ginekologi'], entityScale: 0.7 },
  // RSAL dr. Mintohardjo - Type A, AL
  9: { floors: 14, prefix: 'mnt', specialRooms: ['Hiperbarik Chamber','Kedokteran Penyelaman','Trauma Center','Bedah Jantung','ICU Laut','Decompression Unit','Underwater Medicine Lab'], entityScale: 1.6 },
  // RSAL dr. Ramelan - Type B, AL
  10: { floors: 10, prefix: 'ram', specialRooms: ['Hiperbarik','Kedokteran Penyelaman','Bedah Umum','Kardiologi','Rehabilitasi Penyelam'], entityScale: 1.15 },
  // RSAL dr. Oepomo - Type C, AL
  11: { floors: 5, prefix: 'oep', specialRooms: ['Hiperbarik Dasar','Penyakit Dalam','Bedah Umum','Gigi & Mulut'], entityScale: 0.55 },
  // RSAU dr. Esnawan Antariksa - Type A, AU
  12: { floors: 14, prefix: 'esn', specialRooms: ['Aviation Medicine Center','Altitude Chamber','Spatial Disorientation Lab','Night Vision Lab','Bedah Jantung','Trauma Center','Aeromedical Evacuation'], entityScale: 1.5 },
  // RSAU dr. M. Salamun - Type B, AU
  13: { floors: 8, prefix: 'slm', specialRooms: ['Aviation Medicine','THT Penerbangan','Mata Penerbangan','Audiometri','Penyakit Dalam'], entityScale: 0.85 },
  // RSAU dr. Sutoyo - Type C, AU
  14: { floors: 5, prefix: 'sty', specialRooms: ['Kedokteran Penerbangan','Penyakit Dalam','Bedah Minor','Gigi Penerbangan'], entityScale: 0.55 },
  // RSAU dr. Norman T. Lubis - Type C, AU
  15: { floors: 4, prefix: 'nor', specialRooms: ['Kedokteran Penerbangan','Anestesi','Bedah Umum','Poliklinik'], entityScale: 0.45 },
  // RSAU dr. Djamil - Type D, AU
  16: { floors: 3, prefix: 'djm', specialRooms: ['Penerbangan Dasar','Umum','Gigi'], entityScale: 0.3 },
  // RSAU dr. Suryadi - Type C, AU
  17: { floors: 5, prefix: 'sry', specialRooms: ['Kedokteran Penerbangan','Bedah Umum','Penyakit Dalam','Poliklinik Penerbangan'], entityScale: 0.55 },
};

// ═══ ROOM TEMPLATES PER FLOOR TYPE ═══
function generateFloorRooms(floorNum, totalFloors, prefix, specialRooms, hospitalId) {
  const rooms = [];
  const fId = `${prefix}-r${floorNum}`;

  if (floorNum === 1) {
    // Lantai 1: IGD, Radiologi, Lobi
    rooms.push({ id: `${fId}-1`, name: 'IGD (Unit Gawat Darurat)', type: 'emergency', x: 2, y: 2, w: 46, h: 46, capacity: 30 + Math.floor(Math.random()*25), occupied: 0, equipment: ['Defibrillator x4','Ventilator x8','Monitor Vital x20','Troli Darurat x6'] });
    rooms.push({ id: `${fId}-2`, name: 'Radiologi & Diagnostik', type: 'diagnostic', x: 50, y: 2, w: 48, h: 46, capacity: 10 + Math.floor(Math.random()*8), occupied: 0, equipment: ['CT Scan x1','X-Ray Digital x3','USG x2'] });
    rooms.push({ id: `${fId}-3`, name: 'Lobi & Pendaftaran', type: 'pharmacy', x: 2, y: 50, w: 46, h: 48, capacity: 80, occupied: 0, equipment: ['Kios Mandiri x4','Apotek x1'] });
    rooms.push({ id: `${fId}-4`, name: 'Farmasi & Distribusi', type: 'pharmacy', x: 50, y: 50, w: 48, h: 48, capacity: 20, occupied: 0, equipment: ['Dispenser Otomatis x2','Cold Storage x1'] });
  } else if (floorNum === 2) {
    // Lantai 2: ICU & Bedah
    rooms.push({ id: `${fId}-1`, name: 'ICU / ICCU Terpadu', type: 'icu', x: 2, y: 2, w: 60, h: 46, capacity: 15 + Math.floor(Math.random()*20), occupied: 0, equipment: ['Ventilator Hamilton x15','Monitor Philips x15','Infusion Pump x30','ECMO x1'] });
    rooms.push({ id: `${fId}-2`, name: 'Ruang Operasi Terpadu', type: 'operating', x: 64, y: 2, w: 34, h: 96, capacity: 4 + Math.floor(Math.random()*6), occupied: 0, equipment: ['Mesin Anestesi x4','C-Arm x2','Electrosurgery x4'] });
    rooms.push({ id: `${fId}-3`, name: 'Recovery Room', type: 'recovery', x: 2, y: 50, w: 60, h: 48, capacity: 15 + Math.floor(Math.random()*10), occupied: 0, equipment: ['Monitor Pasca-Bedah x15'] });
  } else if (floorNum === 3 && specialRooms.length > 0) {
    // Lantai 3: Spesialis RS-specific
    const sp = specialRooms.slice(0, Math.min(3, specialRooms.length));
    rooms.push({ id: `${fId}-1`, name: sp[0] || 'Unit Spesialis A', type: 'specialist', x: 2, y: 2, w: 46, h: 96, capacity: 20 + Math.floor(Math.random()*15), occupied: 0, equipment: ['Alat Spesialis x8','Monitor x10'] });
    rooms.push({ id: `${fId}-2`, name: sp[1] || 'Poliklinik Spesialis', type: 'outpatient', x: 50, y: 2, w: 48, h: 46, capacity: 30 + Math.floor(Math.random()*20), occupied: 0, equipment: ['USG x3','EKG x4','Spirometer x2'] });
    rooms.push({ id: `${fId}-3`, name: sp[2] || 'Laboratorium', type: 'laboratory', x: 50, y: 50, w: 48, h: 48, capacity: 10, occupied: 0, equipment: ['Analyzer Hematologi x2','Chemistry Analyzer x1'] });
  } else if (floorNum === 4) {
    // Lantai 4: Command / Admin
    rooms.push({ id: `${fId}-1`, name: 'Command Center RS', type: 'admin', x: 2, y: 2, w: 96, h: 46, capacity: 30, occupied: 0, equipment: ['Workstation x8','Video Wall x1','CCTV Hub x1'] });
    rooms.push({ id: `${fId}-2`, name: 'Ruang Rapat Pimpinan', type: 'meeting', x: 2, y: 50, w: 46, h: 48, capacity: 20, occupied: 0, equipment: ['Proyektor 4K x1','Video Conf x1'] });
    rooms.push({ id: `${fId}-3`, name: 'Data Center', type: 'admin', x: 50, y: 50, w: 48, h: 48, capacity: 5, occupied: 0, equipment: ['Server Rack x4','UPS x1'] });
  } else {
    // Lantai 5+: Rawat Inap (floor-specific ward names)
    const wardNames = [
      'Bangsal Penyakit Dalam','Bangsal Bedah','Bangsal Anak & Neonatal','Bangsal Kebidanan',
      'Bangsal Neurologi','Bangsal Kardiologi','Bangsal Orthopedi','Bangsal Onkologi',
      'Rawat Inap VIP','Rawat Inap Kelas I','Rawat Inap Kelas II','Rawat Inap Kelas III',
      'Bangsal Dermatologi','Bangsal Urologi','Bangsal Pulmonologi','Bangsal Geriatri',
      'Rawat Inap Perwira','Rawat Inap Bintara','Super VIP / Paviliun','Bangsal Isolasi',
      'Rawat Inap Mata & THT','Bangsal Rehabilitasi','Bangsal Paru','Bangsal Jiwa'
    ];
    const wIdx = (floorNum - 5) % wardNames.length;
    const wardName = wardNames[wIdx];
    const bedCount = 20 + Math.floor(Math.random() * 30);
    rooms.push({ id: `${fId}-1`, name: `${wardName} (${bedCount} Bed)`, type: 'inpatient', x: 2, y: 2, w: 48, h: 96, capacity: bedCount, occupied: 0, equipment: [`Bed Elektrik x${bedCount}`,`Monitor Vital x${Math.floor(bedCount/3)}`,`Infusion Pump x${Math.floor(bedCount/2)}`] });
    rooms.push({ id: `${fId}-2`, name: 'Nurse Station & Pantry', type: 'admin', x: 52, y: 2, w: 46, h: 46, capacity: 8, occupied: 0, equipment: ['Workstation Perawat x4','Kulkas Obat x1'] });
    rooms.push({ id: `${fId}-3`, name: 'Ruang Tindakan & Konsul', type: 'outpatient', x: 52, y: 50, w: 46, h: 48, capacity: 5, occupied: 0, equipment: ['Bed Tindakan x2','Monitor Portable x1'] });
  }

  // Set random occupancy
  rooms.forEach(r => {
    if (r.capacity && r.capacity > 0) {
      r.occupied = Math.floor(r.capacity * (0.45 + Math.random() * 0.45));
    }
  });

  return rooms;
}

// ═══ ENTITY GENERATOR ═══
function generateEntitiesForHospital(hospitalId, floors, entityScale) {
  const entities = [];
  let counter = hospitalId * 10000;
  const hospital = hospitals.find(h => h.id === hospitalId);
  if (!hospital) return entities;

  const totalTarget = Math.round((300 + Math.random() * 150) * entityScale);

  // Distribute entities to rooms across floors
  const allRooms = [];
  floors.forEach(f => {
    f.rooms.forEach(r => {
      allRooms.push({ room: r, floor: f.floor });
    });
  });

  if (allRooms.length === 0) return entities;

  for (let i = 0; i < totalTarget; i++) {
    counter++;
    const roomData = allRooms[Math.floor(Math.random() * allRooms.length)];
    const room = roomData.room;
    const floor = roomData.floor;

    // Determine entity type based on room type
    let type, status, name, detail, vstatus;
    const roll = Math.random();

    if (roll < 0.4) {
      // Patient
      type = 'patient';
      const isMale = Math.random() > 0.45;
      const isMilitary = Math.random() > 0.35;
      const firstName = isMale ? maleFirst[Math.floor(Math.random()*maleFirst.length)] : femaleFirst[Math.floor(Math.random()*femaleFirst.length)];
      const lastName = lastNames[Math.floor(Math.random()*lastNames.length)];

      if (isMilitary) {
        const rank = ranks[Math.floor(Math.random()*ranks.length)];
        name = `${rank} ${firstName} ${lastName}`;
      } else {
        const cRank = civilRanks[Math.floor(Math.random()*civilRanks.length)];
        name = `${cRank} ${firstName} ${lastName}`;
      }

      const statusRoll = Math.random();
      if (statusRoll < 0.08) { status = 'critical'; vstatus = '🔴'; }
      else if (statusRoll < 0.15) { status = 'idle'; vstatus = '🟡'; }
      else { status = 'active'; vstatus = '🟢'; }

      const diagnoses = ['Observation post-op','Rawat inap reguler','Kontrol rutin','Rehabilitasi','Pemulihan luka','Terapi intensif','Observasi berkala','Follow-up operasi','Perawatan paliatif','Rawat jalan'];
      detail = diagnoses[Math.floor(Math.random()*diagnoses.length)];

    } else if (roll < 0.7) {
      // Nakes
      type = 'nakes';
      const isMale = Math.random() > 0.5;
      const firstName = isMale ? maleFirst[Math.floor(Math.random()*maleFirst.length)] : femaleFirst[Math.floor(Math.random()*femaleFirst.length)];
      const lastName = lastNames[Math.floor(Math.random()*lastNames.length)];
      const roles = ['Dr.','Ns.','dr.','Apt.','SKM'];
      const specs = ['Sp.B','Sp.PD','Sp.An','Sp.JP','Sp.OG','Sp.A','Sp.THT','Sp.M','Sp.KJ','S.Kep','S.Farm'];
      const rolePick = roles[Math.floor(Math.random()*roles.length)];
      const specPick = specs[Math.floor(Math.random()*specs.length)];
      name = `${rolePick} ${firstName} ${lastName}, ${specPick}`;
      status = Math.random() < 0.15 ? 'idle' : 'active';
      vstatus = status === 'idle' ? '🟡' : '🟢';
      const shifts = ['Shift Pagi','Shift Siang','Shift Malam','On Call','Jaga ICU','Operator OK','Koordinator IGD'];
      detail = shifts[Math.floor(Math.random()*shifts.length)];

    } else if (roll < 0.88) {
      // Equipment
      type = 'equipment';
      const eqList = ['Ventilator Hamilton','Monitor Philips','Infusion Pump Braun','Defibrillator Zoll','USG Portable GE','ECG 12-Lead','Syringe Pump','Pulse Oximeter','Suction Portable','Nebulizer Omron','Blood Gas Analyzer','Bed Elektrik','Kursi Roda Elektrik','Stretcher Ambulance','Pompa ASI Medela','Inkubator Neonatal','Phototherapy Unit'];
      const eqName = eqList[Math.floor(Math.random()*eqList.length)];
      const serial = `${room.id.toUpperCase()}-${String(counter).slice(-4)}`;
      name = `${eqName} #${serial}`;
      const eqStatus = Math.random();
      if (eqStatus < 0.05) { status = 'critical'; vstatus = '🔴'; detail = 'Maintenance required — anomali terdeteksi'; }
      else if (eqStatus < 0.12) { status = 'idle'; vstatus = '🟡'; detail = 'Standby — tidak sedang digunakan'; }
      else { status = 'active'; vstatus = '🟢'; detail = 'Operasional normal'; }

    } else {
      // Logistic
      type = 'logistic';
      const logList = ['Supply Kit Darurat','Kontainer Obat Narkotika','Paket PRC Gol.O+','Paket TC Gol.B+','Kit Bedah Steril','Troli Distribusi Obat','Tabung O2 Medis','Linen Steril Pack','Kit Infus IV Set','APD Level 3 Box','Reagent Lab Pack','Vaksin Cold Box'];
      const logName = logList[Math.floor(Math.random()*logList.length)];
      const batch = `BATCH-${String(Math.floor(Math.random()*9999)).padStart(4,'0')}`;
      name = `${logName} ${batch}`;
      status = Math.random() < 0.08 ? 'critical' : 'active';
      vstatus = status === 'critical' ? '🔴' : '🟢';
      detail = status === 'critical' ? 'Stok kritis — perlu resupply' : 'Stok tersedia — distribusi normal';
    }

    entities.push({
      id: `ENT-${counter}`,
      name,
      type,
      status,
      room: room.id,
      floor,
      location: room.name.split('(')[0].trim(),
      rfidTag: `RFID-${type.substring(0,3).toUpperCase()}-${String(counter).padStart(5,'0')}`,
      lastScan: `${String(Math.floor(Math.random()*12)+1).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')} WIB`,
      detail: detail || '',
      vstatus: vstatus || '🟢',
      x: Math.floor(Math.random()*80)+10,
      y: Math.floor(Math.random()*80)+10,
    });
  }

  return entities;
}

// ═══ MAIN RS DATA GENERATOR ═══
function generateAllHospitalData() {
  const allData = {};

  for (const h of hospitals) {
    if (h.id === 1) continue; // RSPPN uses its own rsppnData.js
    const profile = hospitalProfiles[h.id];
    if (!profile) continue;

    const { floors: numFloors, prefix, specialRooms, entityScale } = profile;

    // Generate geo-bounds from hospital coordinates
    const sizeMultiplier = numFloors >= 10 ? 0.0025 : numFloors >= 6 ? 0.0018 : 0.0012;
    const geoBounds = {
      minLat: h.lat - sizeMultiplier,
      maxLat: h.lat + sizeMultiplier,
      minLng: h.lng - sizeMultiplier * 1.2,
      maxLng: h.lng + sizeMultiplier * 1.2,
    };

    // Generate floors
    const floorData = [];
    for (let f = 1; f <= numFloors; f++) {
      const floorNames = {
        1: `Lantai 1 — IGD, Radiologi & Lobi`,
        2: `Lantai 2 — ICU Terpadu & Kamar Operasi`,
        3: `Lantai 3 — ${specialRooms[0] || 'Unit Spesialis'}`,
        4: `Lantai 4 — Command Center & Administrasi`,
      };
      const wardNames = [
        'Bangsal Penyakit Dalam','Bangsal Bedah','Bangsal Anak','Bangsal Kebidanan',
        'Rawat Inap VIP','Rawat Inap Kelas I','Rawat Inap Kelas II','Rawat Inap Kelas III',
        'Bangsal Neurologi','Bangsal Kardiologi','Bangsal Orthopedi','Bangsal Onkologi',
        'Bangsal Dermatologi','Bangsal Urologi','Bangsal Geriatri','Bangsal Isolasi',
        'Rawat Inap Perwira','Bangsal Rehabilitasi','Bangsal Paru','Super VIP Paviliun'
      ];

      const floorName = floorNames[f] || `Lantai ${f} — ${wardNames[(f-5) % wardNames.length]}`;
      const rooms = generateFloorRooms(f, numFloors, prefix, specialRooms, h.id);
      floorData.push({ floor: f, name: floorName, rooms });
    }

    // Generate entities
    const entityList = generateEntitiesForHospital(h.id, floorData, entityScale);

    // Generate secondary building for Type A and Type B hospitals
    const isTypeAB = numFloors >= 8;
    const buildings = [{
      id: `bld-${prefix}`,
      name: `Gedung Utama ${h.name.replace(/^RS[A-Z]{1,3}\s+/,'')}`,
      geoBounds,
      floors: floorData,
    }];

    if (isTypeAB) {
      const secondaryFloors = Math.min(4, Math.floor(numFloors / 3));
      const secFloorData = [];
      for (let f = 1; f <= secondaryFloors; f++) {
        const secRooms = generateFloorRooms(f, secondaryFloors, `${prefix}2`, specialRooms.slice(Math.min(3, specialRooms.length)), h.id);
        const floorName = f === 1 ? 'Lantai 1 — Poliklinik & Farmasi' : f === 2 ? 'Lantai 2 — Rehabilitasi & Fisioterapi' : `Lantai ${f} — Rawat Inap Annex`;
        secFloorData.push({ floor: f, name: floorName, rooms: secRooms });
      }
      const secOffset = sizeMultiplier * 1.3;
      buildings.push({
        id: `bld-${prefix}2`,
        name: `Gedung Penunjang ${h.name.replace(/^RS[A-Z]{1,3}\s+/,'')}`,
        geoBounds: {
          minLat: h.lat - sizeMultiplier + secOffset,
          maxLat: h.lat + sizeMultiplier + secOffset,
          minLng: h.lng - sizeMultiplier * 0.8,
          maxLng: h.lng + sizeMultiplier * 0.8,
        },
        floors: secFloorData,
      });
      // Generate additional entities for secondary building
      const secEntities = generateEntitiesForHospital(h.id + 100, secFloorData, entityScale * 0.3);
      entityList.push(...secEntities.map(e => ({ ...e, id: `S${e.id}` })));
    }

    allData[h.id] = {
      hospitalId: h.id,
      name: h.name,
      buildings,
      entities: entityList,
    };
  }

  return allData;
}

// Generate once and export
export const allHospitalRfidData = generateAllHospitalData();

// Helper to get data for a specific hospital
export function getHospitalRfidData(hospitalId) {
  if (hospitalId === 1) return null; // Use rsppnData for RSPPN
  return allHospitalRfidData[hospitalId] || null;
}

// Get entity count summary for a hospital
export function getHospitalEntitySummary(hospitalId) {
  const data = hospitalId === 1 ? null : allHospitalRfidData[hospitalId];
  if (!data) return { total: 0, patient: 0, nakes: 0, equipment: 0, logistic: 0 };
  const ents = data.entities;
  return {
    total: ents.length,
    patient: ents.filter(e => e.type === 'patient').length,
    nakes: ents.filter(e => e.type === 'nakes').length,
    equipment: ents.filter(e => e.type === 'equipment').length,
    logistic: ents.filter(e => e.type === 'logistic').length,
  };
}
