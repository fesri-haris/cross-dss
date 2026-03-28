// ═══════════════════════════════════════════════════
// Hospital Image Mappings for GIS Popup Photo Slider
// ═══════════════════════════════════════════════════
// Each RS gets 3 images: exterior, aerial/garden, interior/ward
// Images are categorized by hospital type and force

const typeAImages = [
  '/rs-images/rs_type_a_front.png',
  '/rs-images/rs_type_a_aerial.png',
  '/rs-images/rs_type_a_lobby.png',
];

const typeBImages = [
  '/rs-images/rs_type_b_front.png',
  '/rs-images/rs_type_b_garden.png',
  '/rs-images/rs_type_b_ward.png',
];

const typeCImages = [
  '/rs-images/rs_type_c_front.png',
  '/rs-images/rs_type_b_garden.png',
  '/rs-images/rs_type_b_ward.png',
];

const navalImages = [
  '/rs-images/rs_naval_front.png',
  '/rs-images/rs_type_a_aerial.png',
  '/rs-images/rs_type_a_lobby.png',
];

const airforceImages = [
  '/rs-images/rs_airforce_front.png',
  '/rs-images/rs_type_b_garden.png',
  '/rs-images/rs_type_a_lobby.png',
];

// Map hospital id → [img1, img2, img3] with captions
export const hospitalImages = {
  // RSPPN - Type A, AD
  1: { images: typeAImages, captions: ['Gedung Utama RSPPN PB Soedirman', 'Kompleks RSPPN dari Udara', 'Lobby Utama RSPPN'] },
  // RSPAD Gatot Soebroto - Type A, AD
  2: { images: typeAImages, captions: ['Gedung Utama RSPAD Gatot Soebroto', 'Aerial View Kompleks RSPAD', 'Lobby & Reception RSPAD'] },
  // RSAD Dustira - Type B, AD
  3: { images: typeBImages, captions: ['Gedung Utama RSAD Dustira', 'Taman & Area Rehabilitasi', 'Ruang Perawatan Modern'] },
  // RSAD Udayana - Type B, AD
  4: { images: typeBImages, captions: ['Gedung Utama RSAD Udayana', 'Taman Tropis RSAD Udayana', 'Bangsal Rawat Inap'] },
  // RSAD dr. Soedjono - Type C, AD
  5: { images: typeCImages, captions: ['Gedung RSAD dr. Soedjono', 'Area Taman RS', 'Ruang Perawatan'] },
  // RSAD dr. R. Hardjanto - Type C, AD
  6: { images: typeCImages, captions: ['Gedung RSAD dr. R. Hardjanto', 'Lingkungan RS Hardjanto', 'Fasilitas Perawatan'] },
  // RSAD dr. Soepraoen - Type B, AD
  7: { images: typeBImages, captions: ['Gedung Utama RSAD dr. Soepraoen', 'Area Taman & Rehabilitasi', 'Ruang Rawat Inap'] },
  // RSAD dr. Reksodiwiryo - Type C, AD
  8: { images: typeCImages, captions: ['Gedung RSAD dr. Reksodiwiryo', 'Lingkungan RS', 'Fasilitas Medis'] },
  // RSAL dr. Mintohardjo - Type A, AL
  9: { images: navalImages, captions: ['Gedung Utama RSAL Mintohardjo', 'Kompleks RSAL dari Udara', 'Lobby Utama RSAL'] },
  // RSAL dr. Ramelan - Type B, AL
  10: { images: [...navalImages.slice(0,1), ...typeBImages.slice(1)], captions: ['Gedung RSAL dr. Ramelan', 'Taman RS Ramelan', 'Fasilitas Perawatan'] },
  // RSAL dr. Oepomo - Type C, AL
  11: { images: [...navalImages.slice(0,1), ...typeCImages.slice(1)], captions: ['Gedung RSAL dr. Oepomo', 'Area Lingkungan RS', 'Ruang Perawatan'] },
  // RSAU dr. Esnawan Antariksa - Type A, AU
  12: { images: airforceImages, captions: ['Gedung Utama RSAU Esnawan Antariksa', 'Area Taman RSAU', 'Lobby & Aviation Medicine Center'] },
  // RSAU dr. M. Salamun - Type B, AU
  13: { images: [...airforceImages.slice(0,1), ...typeBImages.slice(1)], captions: ['Gedung RSAU M. Salamun', 'Taman RS Salamun', 'Ruang Perawatan'] },
  // RSAU dr. Sutoyo - Type C, AU
  14: { images: [...airforceImages.slice(0,1), ...typeCImages.slice(1)], captions: ['Gedung RSAU dr. Sutoyo', 'Lingkungan RS', 'Fasilitas Medis'] },
  // RSAU dr. Norman T. Lubis - Type C, AU
  15: { images: [...airforceImages.slice(0,1), ...typeCImages.slice(1)], captions: ['Gedung RSAU Norman T. Lubis', 'Area RS', 'Ruang Rawat'] },
  // RSAU dr. Djamil - Type D, AU
  16: { images: [...airforceImages.slice(0,1), ...typeCImages.slice(1)], captions: ['Gedung RSAU dr. Djamil', 'Lingkungan RS Djamil', 'Fasilitas'] },
  // RSAU dr. Suryadi - Type C, AU
  17: { images: [...airforceImages.slice(0,1), ...typeCImages.slice(1)], captions: ['Gedung RSAU dr. Suryadi', 'Area RS Suryadi', 'Ruang Perawatan'] },
};
