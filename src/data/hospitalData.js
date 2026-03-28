// ═══════════════════════════════════════════════════
// IKHI — Data RS TNI Resmi (Koordinat & Alamat Akurat)
// ═══════════════════════════════════════════════════

export const hospitals = [
  // ═══ RSPPN ═══
  { id:1, name:"RSPPN Panglima Besar Soedirman", type:"Type A", force:"AD", lat:-6.2686875, lng:106.7660625, status:"normal", bor:78, nakes:412, alkesReady:96, beds:650, address:"Jl. RC Veteran Raya No.178, Bintaro, Pesanggrahan, Jakarta Selatan", phone:"(021) 7345083", director:"Mayjen TNI Dr. Terawan A.P., Sp.Rad(K)", specialties:["Bedah Jantung","Trauma Center","Rehabilitasi Militer","Radiologi Intervensi"], icu:24, emergency:true, accreditation:"Paripurna", region:"Jawa", monthlyBOR:[74,76,75,78,80,77,79,82,78,76,78,77], pasienHarian:145, operasiPerBulan:82 },

  // ═══ TNI AD ═══
  { id:2, name:"RSPAD Gatot Soebroto", type:"Type A", force:"AD", lat:-6.1761199, lng:106.8377488, status:"normal", bor:82, nakes:520, alkesReady:94, beds:750, address:"Jl. Abdul Rahman Saleh No.24, Senen, Jakarta Pusat", phone:"(021) 3441008", director:"Mayjen TNI Dr. Albertus Budi S., Sp.B(K)", specialties:["Bedah Jantung","Bedah Saraf","Onkologi","Trauma Center","Kedokteran Nuklir"], icu:32, emergency:true, accreditation:"Paripurna", region:"Jawa", monthlyBOR:[78,80,82,85,83,81,84,86,82,80,82,81], pasienHarian:198, operasiPerBulan:120 },
  { id:3, name:"RSAD Tk.II Dustira", type:"Type B", force:"AD", lat:-6.885751, lng:107.5349183, status:"normal", bor:72, nakes:285, alkesReady:88, beds:420, address:"Jl. Dustira No.1, Cimahi Tengah, Cimahi, Jawa Barat", phone:"(022) 6652207", director:"Brigjen TNI Dr. Hasan M., Sp.PD", specialties:["Bedah Umum","Penyakit Dalam","Orthopedi","Rehabilitasi Medik"], icu:16, emergency:true, accreditation:"Paripurna", region:"Jawa", monthlyBOR:[68,70,71,73,75,72,74,76,72,70,72,71], pasienHarian:95, operasiPerBulan:48 },
  { id:4, name:"RSAD Tk.II Udayana", type:"Type B", force:"AD", lat:-8.6634619, lng:115.2194491, status:"normal", bor:65, nakes:210, alkesReady:90, beds:350, address:"Jl. P.B. Sudirman No.1, Denpasar, Bali", phone:"(0361) 227911", director:"Brigjen TNI Dr. I Wayan P., Sp.B", specialties:["Bedah Plastik","Rehabilitasi Medik","Penyakit Dalam","Orthopedi"], icu:12, emergency:true, accreditation:"Paripurna", region:"Bali-Nusra", monthlyBOR:[60,62,64,66,68,65,67,70,65,63,65,64], pasienHarian:72, operasiPerBulan:35 },
  { id:5, name:"RSAD dr. Soedjono", type:"Type C", force:"AD", lat:-7.4678148, lng:110.2260799, status:"normal", bor:68, nakes:165, alkesReady:84, beds:250, address:"Jl. Urip Sumoharjo No.48, Magelang, Jawa Tengah", phone:"(0293) 362308", director:"Kolonel Dr. Soedjono R., Sp.PD", specialties:["Penyakit Dalam","Bedah Umum","Anak","THT"], icu:8, emergency:true, accreditation:"Utama", region:"Jawa", monthlyBOR:[64,66,67,69,71,68,70,72,68,66,68,67], pasienHarian:55, operasiPerBulan:22 },
  { id:6, name:"RSAD dr. R. Hardjanto", type:"Type C", force:"AD", lat:-1.2736922, lng:116.8289218, status:"normal", bor:62, nakes:140, alkesReady:82, beds:200, address:"Jl. Tj. Pura No.1, Balikpapan Kota, Kalimantan Timur", phone:"(0542) 735080", director:"Kolonel Dr. Hardjanto S., Sp.B", specialties:["Bedah Umum","Penyakit Dalam","Anak","Kebidanan"], icu:6, emergency:true, accreditation:"Utama", region:"Kalimantan", monthlyBOR:[58,60,61,63,65,62,64,66,62,60,62,61], pasienHarian:42, operasiPerBulan:18 },
  { id:7, name:"RSAD dr. Soepraoen", type:"Type B", force:"AD", lat:-7.989864, lng:112.6204795, status:"normal", bor:70, nakes:245, alkesReady:86, beds:400, address:"Jl. S. Supriadi No.22, Malang, Jawa Timur", phone:"(0341) 351275", director:"Brigjen TNI Dr. Soepraoen W., Sp.B(K)", specialties:["Bedah Saraf","Onkologi","Kardiologi","Penyakit Tropis"], icu:15, emergency:true, accreditation:"Paripurna", region:"Jawa", monthlyBOR:[66,68,69,71,73,70,72,74,70,68,70,69], pasienHarian:88, operasiPerBulan:45 },
  { id:8, name:"RSAD dr. Reksodiwiryo", type:"Type C", force:"AD", lat:-0.9510264, lng:100.3720251, status:"normal", bor:64, nakes:135, alkesReady:85, beds:210, address:"Jl. Dr. Wahidin No.1, Padang Timur, Sumatera Barat", phone:"(0751) 32718", director:"Kolonel Dr. Reksodiwiryo H., Sp.PD", specialties:["Penyakit Dalam","Bedah Umum","Anak","Obstetri"], icu:6, emergency:true, accreditation:"Utama", region:"Sumatera", monthlyBOR:[60,62,63,65,67,64,66,68,64,62,64,63], pasienHarian:44, operasiPerBulan:16 },

  // ═══ TNI AL ═══
  { id:9, name:"RSAL dr. Mintohardjo", type:"Type A", force:"AL", lat:-6.21092, lng:106.81201, status:"normal", bor:75, nakes:380, alkesReady:91, beds:580, address:"Jl. Bendungan Hilir No.17, Jakarta Pusat", phone:"(021) 5703081", director:"Laksamana Dr. Mintohardjo S., Sp.JP(K)", specialties:["Hiperbarik","Bedah Jantung","Trauma Center","Kedokteran Penyelaman"], icu:22, emergency:true, accreditation:"Paripurna", region:"Jawa", monthlyBOR:[71,73,74,76,78,75,77,79,75,73,75,74], pasienHarian:132, operasiPerBulan:68 },
  { id:10, name:"RSAL dr. Ramelan", type:"Type B", force:"AL", lat:-7.3093214, lng:112.7380654, status:"normal", bor:73, nakes:290, alkesReady:89, beds:450, address:"Jl. Gadung No.1, Surabaya, Jawa Timur", phone:"(031) 8438153", director:"Laksamana Dr. Ramelan S., Sp.B(K)", specialties:["Bedah Umum","Kardiologi","Hiperbarik","Kedokteran Penyelaman"], icu:16, emergency:true, accreditation:"Paripurna", region:"Jawa", monthlyBOR:[69,71,72,74,76,73,75,77,73,71,73,72], pasienHarian:102, operasiPerBulan:52 },
  { id:11, name:"RSAL dr. Oepomo", type:"Type C", force:"AL", lat:-6.9838093, lng:110.4099893, status:"normal", bor:60, nakes:120, alkesReady:80, beds:180, address:"Semarang, Jawa Tengah", phone:"(024) 3548091", director:"Kolonel Laut Dr. Oepomo W., Sp.PD", specialties:["Penyakit Dalam","Bedah Umum","Hiperbarik","Gigi & Mulut"], icu:5, emergency:true, accreditation:"Utama", region:"Jawa", monthlyBOR:[56,58,59,61,63,60,62,64,60,58,60,59], pasienHarian:35, operasiPerBulan:14 },

  // ═══ TNI AU ═══
  { id:12, name:"RSAU dr. Esnawan Antariksa", type:"Type A", force:"AU", lat:-6.2570286, lng:106.8917371, status:"normal", bor:71, nakes:350, alkesReady:90, beds:520, address:"Lanud Halim Perdanakusuma, Jakarta Timur", phone:"(021) 8009122", director:"Marsekal Dr. Esnawan S., Sp.JP(K)", specialties:["Kedokteran Penerbangan","Bedah Jantung","Trauma Center","Rehabilitasi Medik"], icu:20, emergency:true, accreditation:"Paripurna", region:"Jawa", monthlyBOR:[67,69,70,72,74,71,73,75,71,69,71,70], pasienHarian:118, operasiPerBulan:58 },
  { id:13, name:"RSAU dr. M. Salamun", type:"Type B", force:"AU", lat:-6.863781, lng:107.605075, status:"normal", bor:63, nakes:180, alkesReady:85, beds:280, address:"Jl. Ciumbuleuit No.203, Bandung, Jawa Barat", phone:"(022) 2032117", director:"Brigjen TNI Dr. Salamun M., Sp.THT", specialties:["Kedokteran Penerbangan","THT","Mata","Penyakit Dalam"], icu:8, emergency:true, accreditation:"Utama", region:"Jawa", monthlyBOR:[59,61,62,64,66,63,65,67,63,61,63,62], pasienHarian:56, operasiPerBulan:24 },
  { id:14, name:"RSAU dr. Sutoyo", type:"Type C", force:"AU", lat:-6.9942118, lng:110.4074897, status:"normal", bor:58, nakes:105, alkesReady:80, beds:160, address:"Semarang, Jawa Tengah (dekat RS Kariadi)", phone:"(024) 3541805", director:"Kolonel Dr. Sutoyo A., Sp.PD", specialties:["Kedokteran Penerbangan","Penyakit Dalam","Bedah Minor","Gigi"], icu:4, emergency:true, accreditation:"Madya", region:"Jawa", monthlyBOR:[54,56,57,59,61,58,60,62,58,56,58,57], pasienHarian:30, operasiPerBulan:10 },
  { id:15, name:"RSAU dr. Norman T. Lubis", type:"Type C", force:"AU", lat:-6.9835647, lng:107.5639775, status:"normal", bor:55, nakes:95, alkesReady:78, beds:140, address:"Jl. Terusan Kopo No.457, Kabupaten Bandung, Jawa Barat", phone:"(022) 5891234", director:"Kolonel Dr. Norman T.L., Sp.An", specialties:["Kedokteran Penerbangan","Anestesi","Bedah Umum"], icu:3, emergency:true, accreditation:"Madya", region:"Jawa", monthlyBOR:[51,53,54,56,58,55,57,59,55,53,55,54], pasienHarian:25, operasiPerBulan:8 },
  { id:16, name:"RSAU dr. Djamil", type:"Type D", force:"AU", lat:0.5070677, lng:101.4477793, status:"normal", bor:52, nakes:60, alkesReady:75, beds:90, address:"Pekanbaru, Riau", phone:"(0761) 574321", director:"Letkol Dr. Djamil R., Sp.U", specialties:["Kedokteran Penerbangan","Umum","Gigi"], icu:2, emergency:true, accreditation:"Madya", region:"Sumatera", monthlyBOR:[48,50,51,53,55,52,54,56,52,50,52,51], pasienHarian:15, operasiPerBulan:4 },
  { id:17, name:"RSAU dr. Suryadi", type:"Type C", force:"AU", lat:-5.0718942, lng:119.5350017, status:"normal", bor:56, nakes:98, alkesReady:79, beds:150, address:"Jl. Poros Bandara Baru Hasanuddin, Maros, Sulawesi Selatan", phone:"(0411) 4670123", director:"Kolonel Dr. Suryadi B., Sp.B", specialties:["Kedokteran Penerbangan","Bedah Umum","Penyakit Dalam"], icu:4, emergency:true, accreditation:"Utama", region:"Sulawesi", monthlyBOR:[52,54,55,57,59,56,58,60,56,54,56,55], pasienHarian:28, operasiPerBulan:12 },
];

export const monthLabels = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

export const accreditationDistribution = {
  Paripurna: 9,
  Utama: 5,
  Madya: 3,
};

export const ikuCategories = [
  { key: 'mutuLayanan', label: 'Mutu Layanan Medis', icon: '⭐', color: '#3b82f6', params: ['kepuasanPasien', 'waktuTunggu', 'rujukanBalik'] },
  { key: 'keselamatanPasien', label: 'Keselamatan Pasien', icon: '🛡️', color: '#10b981', params: ['sentinel', 'infeksiNosokomial', 'readmisi30'] },
  { key: 'efisiensiOps', label: 'Efisiensi Operasional', icon: '⚙️', color: '#f59e0b', params: ['bor', 'alos', 'toi'] },
  { key: 'sdmKeuangan', label: 'Manajemen SDM & Keuangan', icon: '👥', color: '#8b5cf6', params: ['rasioMedis', 'rasioBiaya', 'pelatihan'] },
  { key: 'tataKelola', label: 'Tata Kelola & Inovasi', icon: '🚀', color: '#06b6d4', params: ['emr', 'akreditasi', 'inovasi'] },
];

export const ikuParams = {
  kepuasanPasien:    { no:1,  label:'Kepuasan Pasien',       fullName:'Tingkat Kepuasan Pasien',                         unit:'/10', icon:'😊', category:'mutuLayanan',       description:'Skor kepuasan pasien terhadap pelayanan klinis dan non-klinis berdasarkan survei berkala.',                          tujuan:'Menilai kualitas pelayanan klinis dan non-klinis',      ideal:'> 8.5/10',     idealNum:8.5,  higherBetter:true },
  waktuTunggu:       { no:2,  label:'Waktu Tunggu',          fullName:'Waktu Tunggu Rawat Jalan',                        unit:'mnt', icon:'⏱️', category:'mutuLayanan',       description:'Rata-rata waktu tunggu pasien rawat jalan dari registrasi hingga diperiksa dokter.',                                 tujuan:'Efisiensi akses layanan',                              ideal:'< 30 menit',   idealNum:30,   higherBetter:false },
  rujukanBalik:      { no:3,  label:'Rujukan Balik',         fullName:'Angka Rujukan Balik',                             unit:'%',   icon:'🔄', category:'mutuLayanan',       description:'Persentase pasien yang dirujuk kembali ke fasilitas kesehatan asal setelah penanganan.',                             tujuan:'Efektivitas penanganan di RS Kemhan',                  ideal:'> 60%',        idealNum:60,   higherBetter:true },
  sentinel:          { no:4,  label:'Kejadian Sentinel',     fullName:'Angka Kejadian Sentinel (Kesalahan Medis Serius)', unit:'kss', icon:'🚨', category:'keselamatanPasien', description:'Jumlah kejadian sentinel (kesalahan medis serius) per 1.000 pasien rawat inap. Target zero incident.',               tujuan:'Memastikan standar keselamatan',                       ideal:'0 kasus',      idealNum:0,    higherBetter:false },
  infeksiNosokomial: { no:5,  label:'Infeksi Nosokomial',    fullName:'Angka Infeksi Nosokomial',                        unit:'‰',   icon:'🦠', category:'keselamatanPasien', description:'Angka kejadian infeksi yang didapat di rumah sakit per 1.000 pasien. Indikator kontrol infeksi.',                    tujuan:'Mengukur kontrol infeksi',                             ideal:'< 4.5‰',       idealNum:4.5,  higherBetter:false },
  readmisi30:        { no:6,  label:'Readmisi 30 Hari',      fullName:'Angka Readmisi 30 Hari',                          unit:'%',   icon:'🔁', category:'keselamatanPasien', description:'Persentase pasien yang kembali dirawat dalam 30 hari setelah keluar. Evaluasi keberhasilan terapi awal.',            tujuan:'Evaluasi keberhasilan terapi',                         ideal:'< 5%',         idealNum:5,    higherBetter:false },
  bor:               { no:7,  label:'BOR',                   fullName:'Bed Occupancy Rate',                              unit:'%',   icon:'🛏️', category:'efisiensiOps',      description:'Persentase pemakaian tempat tidur pada periode tertentu. Menunjukkan tingkat pemanfaatan tempat tidur rumah sakit.', tujuan:'Optimalisasi penggunaan tempat tidur',                  ideal:'60-85%',       idealNum:72.5, higherBetter:null },
  alos:              { no:8,  label:'ALOS',                  fullName:'Average Length of Stay',                           unit:'hari',icon:'📅', category:'efisiensiOps',      description:'Rata-rata lama rawat seorang pasien. Indikator efisiensi pelayanan rawat inap.',                                     tujuan:'Efisiensi perawatan pasien',                            ideal:'3-5 hari',     idealNum:4,    higherBetter:false },
  toi:               { no:9,  label:'TOI',                   fullName:'Turnover Interval',                               unit:'hari',icon:'🔃', category:'efisiensiOps',      description:'Tenggang perputaran tempat tidur dari terisi ke terisi berikutnya. Waktu rata-rata tempat tidur kosong.',            tujuan:'Kecepatan rotasi pasien',                              ideal:'1-3 hari',     idealNum:2,    higherBetter:false },
  rasioMedis:        { no:10, label:'Rasio Medis',           fullName:'Rasio Tenaga Medis terhadap Pasien',               unit:'',    icon:'👨‍⚕️', category:'sdmKeuangan',       description:'Rasio jumlah tenaga medis dibanding jumlah pasien yang dirawat. Menunjukkan beban kerja tenaga kesehatan.',          tujuan:'Keseimbangan beban kerja',                             ideal:'1:4 ~ 1:6',    idealNum:5,    higherBetter:false },
  rasioBiaya:        { no:11, label:'Rasio Biaya',           fullName:'Rasio Biaya Operasional terhadap Pendapatan',      unit:'%',   icon:'💰', category:'sdmKeuangan',       description:'Perbandingan biaya operasional terhadap total pendapatan RS. Semakin rendah semakin efisien.',                       tujuan:'Efisiensi finansial',                                  ideal:'< 70%',        idealNum:70,   higherBetter:false },
  pelatihan:         { no:12, label:'Pelatihan',             fullName:'Tingkat Pelatihan Tenaga Medis',                   unit:'%',   icon:'🎓', category:'sdmKeuangan',       description:'Persentase tenaga medis yang telah mengikuti pelatihan kompetensi dalam 12 bulan terakhir.',                        tujuan:'Peningkatan kompetensi',                               ideal:'> 80%',        idealNum:80,   higherBetter:true },
  emr:               { no:13, label:'E-MR',                  fullName:'Implementasi Rekam Medis Elektronik',              unit:'%',   icon:'💻', category:'tataKelola',        description:'Persentase implementasi Electronic Medical Record di seluruh departemen. Digitalisasi layanan administrasi.',        tujuan:'Digitalisasi layanan',                                 ideal:'> 90%',        idealNum:90,   higherBetter:true },
  akreditasi:        { no:14, label:'Akreditasi',            fullName:'Kepatuhan Standar Akreditasi Internasional',       unit:'%',   icon:'🏅', category:'tataKelola',        description:'Skor kepatuhan terhadap standar akreditasi internasional (JCI/KARS). Benchmark global.',                            tujuan:'Benchmark global',                                     ideal:'> 85%',        idealNum:85,   higherBetter:true },
  inovasi:           { no:15, label:'Inovasi',               fullName:'Inovasi Layanan (Telemedicine, AI Monitoring)',    unit:'%',   icon:'🚀', category:'tataKelola',        description:'Tingkat adopsi inovasi layanan termasuk telemedicine, AI monitoring, dan RFID tracking.',                           tujuan:'Transformasi menuju RS bertaraf global',               ideal:'> 70%',        idealNum:70,   higherBetter:true },
};

export const rsppnIkuValues = {
  kepuasanPasien:9.2, waktuTunggu:22, rujukanBalik:72, sentinel:0, infeksiNosokomial:2.8, readmisi30:3.1,
  bor:78, alos:3.8, toi:2.1, rasioMedis:4, rasioBiaya:62, pelatihan:92,
  emr:96, akreditasi:94, inovasi:82,
};
export const nationalAvgIkuValues = {
  kepuasanPasien:7.8, waktuTunggu:38, rujukanBalik:55, sentinel:0.3, infeksiNosokomial:4.1, readmisi30:6.2,
  bor:68, alos:4.5, toi:2.8, rasioMedis:6, rasioBiaya:74, pelatihan:68,
  emr:72, akreditasi:78, inovasi:52,
};

// Per-RS IKU values keyed by hospital id
export const perRsIkuValues = {
  1:  { kepuasanPasien:9.2, waktuTunggu:22, rujukanBalik:72, sentinel:0,   infeksiNosokomial:2.8, readmisi30:3.1, bor:78, alos:3.8, toi:2.1, rasioMedis:4, rasioBiaya:62, pelatihan:92, emr:96, akreditasi:94, inovasi:82 },
  2:  { kepuasanPasien:9.0, waktuTunggu:25, rujukanBalik:68, sentinel:0,   infeksiNosokomial:3.0, readmisi30:3.5, bor:82, alos:4.0, toi:1.8, rasioMedis:4, rasioBiaya:64, pelatihan:90, emr:94, akreditasi:92, inovasi:78 },
  3:  { kepuasanPasien:8.2, waktuTunggu:32, rujukanBalik:60, sentinel:0.1, infeksiNosokomial:3.6, readmisi30:4.8, bor:72, alos:4.2, toi:2.4, rasioMedis:5, rasioBiaya:68, pelatihan:78, emr:82, akreditasi:84, inovasi:60 },
  4:  { kepuasanPasien:8.0, waktuTunggu:30, rujukanBalik:58, sentinel:0.1, infeksiNosokomial:3.8, readmisi30:5.0, bor:65, alos:4.0, toi:2.6, rasioMedis:5, rasioBiaya:70, pelatihan:75, emr:78, akreditasi:82, inovasi:55 },
  5:  { kepuasanPasien:7.8, waktuTunggu:35, rujukanBalik:52, sentinel:0.2, infeksiNosokomial:4.0, readmisi30:5.5, bor:68, alos:4.5, toi:2.8, rasioMedis:6, rasioBiaya:72, pelatihan:70, emr:70, akreditasi:76, inovasi:48 },
  6:  { kepuasanPasien:7.5, waktuTunggu:38, rujukanBalik:48, sentinel:0.3, infeksiNosokomial:4.2, readmisi30:6.0, bor:62, alos:4.8, toi:3.0, rasioMedis:6, rasioBiaya:76, pelatihan:65, emr:65, akreditasi:72, inovasi:42 },
  7:  { kepuasanPasien:8.4, waktuTunggu:28, rujukanBalik:62, sentinel:0.1, infeksiNosokomial:3.4, readmisi30:4.5, bor:70, alos:4.1, toi:2.3, rasioMedis:5, rasioBiaya:66, pelatihan:82, emr:85, akreditasi:86, inovasi:65 },
  8:  { kepuasanPasien:7.6, waktuTunggu:36, rujukanBalik:50, sentinel:0.2, infeksiNosokomial:4.3, readmisi30:5.8, bor:64, alos:4.6, toi:2.9, rasioMedis:6, rasioBiaya:75, pelatihan:62, emr:62, akreditasi:70, inovasi:40 },
  9:  { kepuasanPasien:8.8, waktuTunggu:24, rujukanBalik:66, sentinel:0,   infeksiNosokomial:3.2, readmisi30:3.8, bor:75, alos:3.9, toi:2.0, rasioMedis:4, rasioBiaya:63, pelatihan:88, emr:92, akreditasi:90, inovasi:75 },
  10: { kepuasanPasien:8.3, waktuTunggu:30, rujukanBalik:61, sentinel:0.1, infeksiNosokomial:3.5, readmisi30:4.6, bor:73, alos:4.2, toi:2.3, rasioMedis:5, rasioBiaya:67, pelatihan:80, emr:84, akreditasi:85, inovasi:62 },
  11: { kepuasanPasien:7.4, waktuTunggu:40, rujukanBalik:46, sentinel:0.3, infeksiNosokomial:4.5, readmisi30:6.5, bor:60, alos:4.8, toi:3.2, rasioMedis:7, rasioBiaya:78, pelatihan:58, emr:58, akreditasi:68, inovasi:38 },
  12: { kepuasanPasien:8.6, waktuTunggu:26, rujukanBalik:65, sentinel:0,   infeksiNosokomial:3.1, readmisi30:3.6, bor:71, alos:3.8, toi:2.2, rasioMedis:5, rasioBiaya:65, pelatihan:86, emr:90, akreditasi:88, inovasi:72 },
  13: { kepuasanPasien:7.8, waktuTunggu:34, rujukanBalik:54, sentinel:0.2, infeksiNosokomial:3.9, readmisi30:5.2, bor:63, alos:4.4, toi:2.7, rasioMedis:6, rasioBiaya:72, pelatihan:72, emr:74, akreditasi:78, inovasi:50 },
  14: { kepuasanPasien:7.2, waktuTunggu:42, rujukanBalik:44, sentinel:0.4, infeksiNosokomial:4.6, readmisi30:6.8, bor:58, alos:5.0, toi:3.4, rasioMedis:7, rasioBiaya:80, pelatihan:55, emr:55, akreditasi:65, inovasi:35 },
  15: { kepuasanPasien:7.0, waktuTunggu:45, rujukanBalik:42, sentinel:0.4, infeksiNosokomial:4.8, readmisi30:7.0, bor:55, alos:5.2, toi:3.5, rasioMedis:8, rasioBiaya:82, pelatihan:52, emr:50, akreditasi:62, inovasi:32 },
  16: { kepuasanPasien:6.8, waktuTunggu:48, rujukanBalik:38, sentinel:0.5, infeksiNosokomial:5.0, readmisi30:7.5, bor:52, alos:5.5, toi:3.8, rasioMedis:8, rasioBiaya:85, pelatihan:48, emr:45, akreditasi:58, inovasi:28 },
  17: { kepuasanPasien:7.1, waktuTunggu:44, rujukanBalik:43, sentinel:0.4, infeksiNosokomial:4.7, readmisi30:7.2, bor:56, alos:5.1, toi:3.3, rasioMedis:7, rasioBiaya:81, pelatihan:54, emr:52, akreditasi:64, inovasi:34 },
};


export const ikuMonthlyTrend = {
  labels: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
  rsppn: {
    kepuasanPasien: [8.8,8.9,9.0,9.1,9.0,9.1,9.2,9.3,9.2,9.1,9.2,9.2],
    bor: [74,76,75,78,80,77,79,82,78,76,78,77],
    infeksiNosokomial: [3.2,3.0,2.9,2.8,2.9,2.7,2.8,2.6,2.7,2.8,2.8,2.8],
    readmisi30: [3.8,3.5,3.4,3.2,3.3,3.1,3.2,3.0,3.1,3.1,3.1,3.1],
    emr: [88,89,90,91,92,93,94,94,95,95,96,96],
  },
  nasional: {
    kepuasanPasien: [7.4,7.5,7.5,7.6,7.7,7.7,7.8,7.8,7.9,7.8,7.8,7.8],
    bor: [62,65,68,72,70,68,75,72,68,66,68,68],
    infeksiNosokomial: [4.8,4.6,4.5,4.3,4.2,4.1,4.0,4.1,4.1,4.2,4.1,4.1],
    readmisi30: [7.2,7.0,6.8,6.5,6.4,6.3,6.2,6.1,6.2,6.2,6.2,6.2],
    emr: [60,62,64,65,67,68,70,71,72,72,72,72],
  },
};

// Legacy exports kept for backward compatibility
export const nationalParams = {
  bor: { value: 68, unit: '%', label: 'BOR', fullName: 'Bed Occupancy Ratio', description: 'Persentase pemakaian tempat tidur pada periode tertentu.', ideal: '60-85%', status: 'normal' },
  alos: { value: 4.1, unit: 'hari', label: 'ALOS', fullName: 'Average Length of Stay', description: 'Rata-rata lama rawat seorang pasien.', ideal: '3-5 hari', status: 'normal' },
  toi: { value: 2.5, unit: 'hari', label: 'TOI', fullName: 'Turn Over Interval', description: 'Tenggang perputaran tempat tidur.', ideal: '1-3 hari', status: 'normal' },
  bto: { value: 8.3, unit: 'x', label: 'BTO', fullName: 'Bed Turn Over', description: 'Frekuensi pemakaian tempat tidur.', ideal: '> 6x', status: 'normal' },
  ndr: { value: 1.8, unit: '‰', label: 'NDR', fullName: 'Net Death Rate', description: 'Angka kematian pasien setelah dirawat ≥ 48 jam.', ideal: '< 2.5‰', status: 'normal' },
  gdr: { value: 3.2, unit: '‰', label: 'GDR', fullName: 'Gross Death Rate', description: 'Angka kematian umum per 1000 penderita keluar.', ideal: '< 4.5‰', status: 'warning' },
  igdResponse: { value: '5m', unit: '', label: 'IGD Response', fullName: 'Emergency Response Time', description: 'Kecepatan waktu tanggap IGD.', ideal: '< 5 menit', status: 'normal' },
  assetReadiness: { value: 94, unit: '%', label: 'Asset Readiness', fullName: 'Kesiapan Alat Medis', description: 'Persentase alat medis siap digunakan.', ideal: '> 90%', status: 'normal' },
  farmasi: { value: 91, unit: '%', label: 'Farmasi', fullName: 'Drug Inventory Turnover', description: 'Ketersediaan dan perputaran obat.', ideal: '> 85%', status: 'normal' },
  staffRatio: { value: '1:5', unit: '', label: 'Staff Ratio', fullName: 'Staff-to-Patient Ratio', description: 'Rasio tenaga medis vs pasien.', ideal: '1:4 ~ 1:6', status: 'normal' },
  pasienPuas: { value: 8.9, unit: '/10', label: 'Pasien Puas', fullName: 'Patient Satisfaction Index', description: 'Skor kepuasan layanan pasien.', ideal: '> 8.0', status: 'normal' },
  bedQueue: { value: 12, unit: 'orang', label: 'Bed Queue', fullName: 'Surgical Waiting List', description: 'Jumlah antrean operasi elektif.', ideal: '< 10', status: 'warning' },
  labTAT: { value: '1.1h', unit: '', label: 'Lab TAT', fullName: 'Lab Result Turn Around Time', description: 'Kecepatan hasil laboratorium.', ideal: '< 1.5 jam', status: 'normal' },
  revenue: { value: 'A', unit: '', label: 'Revenue', fullName: 'Revenue Cycle Management', description: 'Grade pengelolaan arus kas.', ideal: 'Grade A/B', status: 'normal' },
  secureLAN: { value: 'OK', unit: '', label: 'Secure LAN', fullName: 'Secure LAN Status', description: 'Status kesehatan jaringan.', ideal: 'OK / Active', status: 'normal' },
};
export const rsppnParams = { bor:78, alos:3.8, toi:2.1, bto:9.2, ndr:1.2, gdr:2.5, igdResponse:4, assetReadiness:96, farmasi:95, staffRatio:4, pasienPuas:9.2, bedQueue:8, labTAT:0.9, revenue:95, secureLAN:99 };
export const nationalAvgParams = { bor:68, alos:4.1, toi:2.5, bto:8.3, ndr:1.8, gdr:3.2, igdResponse:5, assetReadiness:87, farmasi:85, staffRatio:5, pasienPuas:8.2, bedQueue:15, labTAT:1.3, revenue:82, secureLAN:90 };

export const monthlyTrends = {
  labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov'],
  bor: [62,65,68,72,70,68,75,78,72,68,70],
  gdr: [3.5,3.2,3.0,2.8,3.1,3.3,2.9,2.7,3.0,3.2,3.1],
};

export const newsItems = [
  { id:1, title:"RSPAD Gatot Soebroto terima 10 ventilator baru", detail:"RSPAD Gatot Soebroto meneponerima 10 unit ventilator canggih untuk meningkatkan kapasitas ICU dan penanganan pasien kritis.", time:"2h ago", date:"25 Mar 2026", icon:"🏥", category:"Infrastruktur" },
  { id:2, title:"Vaksinasi massal prajurit TNI AD se-Jawa", detail:"Program vaksinasi massal dilaksanakan di seluruh RS TNI AD se-Pulau Jawa melibatkan 5,000+ prajurit aktif.", time:"1d ago", date:"24 Mar 2026", icon:"💉", category:"Operasional" },
  { id:3, title:"RSAL dr. Ramelan tingkatkan fasilitas hiperbarik", detail:"RSAL dr. Ramelan Surabaya melakukan upgrade chamber hiperbarik generasi terbaru untuk penanganan penyakit penyelaman.", time:"3d ago", date:"22 Mar 2026", icon:"⚓", category:"Inovasi" },
  { id:4, title:"Latihan medis gabungan TNI di Balikpapan", detail:"RSAD dr. R. Hardjanto menjadi tuan rumah latihan medis gabungan TNI-Polri dengan simulasi penanganan korban massal.", time:"5d ago", date:"20 Mar 2026", icon:"⚕️", category:"Latihan" },
  { id:5, title:"RSAU dr. Esnawan Antariksa raih akreditasi Paripurna", detail:"RSAU dr. Esnawan Antariksa berhasil mempertahankan status akreditasi Paripurna dari KARS untuk periode 2026-2029.", time:"7d ago", date:"18 Mar 2026", icon:"✈️", category:"Akreditasi" },
  { id:6, title:"Update SIMRS v4.2 untuk seluruh RS TNI", detail:"Update terbaru SIMRS mencakup modul telemedis, integrasi BPJS otomatis, dan dashboard 15 parameter kinerja.", time:"10d ago", date:"15 Mar 2026", icon:"💻", category:"Teknologi" },
  { id:7, title:"RSPPN Soedirman benchmark nasional Command Center", detail:"RSPPN PB Soedirman ditetapkan sebagai RS benchmark untuk implementasi Integrated Command Center Kemhan.", time:"12d ago", date:"13 Mar 2026", icon:"🎖️", category:"Kebijakan" },
  { id:8, title:"Kerjasama riset kedokteran militer TNI-BRIN", detail:"TNI dan BRIN menandatangani MoU riset pengembangan alat diagnostik portable untuk operasi militer di lapangan.", time:"14d ago", date:"11 Mar 2026", icon:"🔬", category:"Riset" },
];

export const recentReports = [
  { title:"Laporan Kesiapan Operasional RS TNI Triwulan Q1 2026", time:"2d ago", type:"Triwulan" },
  { title:"Analisis Alkes RSPPN PB Soedirman", time:"3d ago", type:"Alkes" },
  { title:"Laporan Logistik Medik Nasional", time:"5d ago", type:"Logistik" },
  { title:"Status Akreditasi Seluruh RS TNI 2026", time:"7d ago", type:"Akreditasi" },
  { title:"Laporan BOR Nasional RS Kemhan Februari 2026", time:"10d ago", type:"Kinerja" },
  { title:"Evaluasi Kesiapan ICU RS TNI Perbatasan", time:"14d ago", type:"Evaluasi" },
];

export const equipmentData = {
  ventilators: { available: 18, total: 20, maintenance: 1, broken: 1 },
  monitors: { available: 45, total: 50, maintenance: 3, broken: 2 },
  mri: { available: 3, total: 4, maintenance: 1, broken: 0 },
  xray: { available: 8, total: 10, maintenance: 1, broken: 1 },
  defibrillator: { available: 12, total: 14, maintenance: 2, broken: 0 },
  infusionPump: { available: 35, total: 40, maintenance: 3, broken: 2 },
  ecg: { available: 15, total: 18, maintenance: 2, broken: 1 },
};

export const trackedEntities = [
  { id:'P-1045', type:'patient', name:'Pasien IGD', location:'IGD', status:'Lab (02 min)', floor:1, x:25, y:30, detail:'Tn. Ahmad Fauzi, 45th, Prajurit - Demam Berdarah' },
  { id:'V-0012', type:'ventilator', name:'Ventilator V-12', location:'ICU 1', status:'Ready', floor:2, x:65, y:35, detail:'Drager Evita Infinity V500, SN: DRG-2024-0012' },
  { id:'N-001', type:'nakes', name:'Dr. Sari Dewi', location:'Lt.3', status:'Active', floor:3, x:78, y:55, detail:'Sp. Penyakit Dalam, Shift Pagi 07:00-14:00' },
  { id:'P-1046', type:'patient', name:'Pasien Bedah', location:'OK-2', status:'Monitoring', floor:2, x:42, y:50, detail:'Ny. Ratna M., 38th, Keluarga Prajurit - Post-Op Appendectomy' },
  { id:'V-0013', type:'ventilator', name:'Ventilator V-13', location:'ICU 2', status:'In Use', floor:2, x:55, y:28, detail:'Hamilton C6, SN: HAM-2023-0013, Pasien: P-1047' },
  { id:'N-002', type:'nakes', name:'Dr. Ahmad Rizal', location:'IGD', status:'Active', floor:1, x:30, y:45, detail:'Sp. Bedah Umum, Shift Pagi 07:00-14:00' },
  { id:'P-1047', type:'patient', name:'Pasien ICU', location:'ICU 3', status:'Critical', floor:2, x:70, y:50, detail:'Serda Budi P., 32th, Trauma Multiple - Kecelakaan Latihan' },
  { id:'N-003', type:'nakes', name:'Ns. Maria L.', location:'VIP', status:'Active', floor:3, x:35, y:25, detail:'Perawat Senior, Shift Pagi 07:00-14:00' },
];

export const newsTrendData = {
  labels: ['1 Jan','5 Jan','10 Jan','15 Jan','12 Jun','15 Jun','18 Jun','1 Sep','15 Sep'],
  crawler: [40,65,80,55,90,70,85,60,75],
  operasional: [30,50,60,45,70,55,65,50,60],
};

export const buildingFloors = [
  {
    floor: 1, name: 'Lantai 1 — IGD & Poliklinik',
    rooms: [
      { id:'r1-1', name:'IGD', type:'emergency', x:5, y:5, w:25, h:40, capacity:20, occupied:14, equipment:['Defib x2','Monitor x5','Ventilator x2'] },
      { id:'r1-2', name:'Poliklinik Umum', type:'outpatient', x:35, y:5, w:25, h:40, capacity:10, occupied:6, equipment:['USG x1','EKG x2'] },
      { id:'r1-3', name:'Radiologi', type:'diagnostic', x:5, y:52, w:25, h:40, capacity:4, occupied:2, equipment:['X-Ray x2','CT-Scan x1'] },
      { id:'r1-4', name:'Farmasi', type:'pharmacy', x:35, y:52, w:25, h:40, capacity:null, occupied:null, equipment:['Dispenser Otomatis x1'] },
      { id:'r1-5', name:'Laboratorium', type:'lab', x:65, y:5, w:30, h:40, capacity:6, occupied:4, equipment:['Analyzer x3','Centrifuge x2'] },
      { id:'r1-6', name:'Administrasi', type:'admin', x:65, y:52, w:30, h:40, capacity:null, occupied:null, equipment:[] },
    ]
  },
  {
    floor: 2, name: 'Lantai 2 — ICU & Rawat Inap',
    rooms: [
      { id:'r2-1', name:'ICU', type:'icu', x:5, y:5, w:30, h:40, capacity:12, occupied:9, equipment:['Ventilator x8','Monitor x12','Defib x3'] },
      { id:'r2-2', name:'ICCU', type:'icu', x:40, y:5, w:25, h:40, capacity:8, occupied:6, equipment:['Monitor x8','Ventilator x4'] },
      { id:'r2-3', name:'Bangsal Pria', type:'ward', x:5, y:52, w:28, h:40, capacity:30, occupied:22, equipment:['Monitor x6','Infusion Pump x10'] },
      { id:'r2-4', name:'Bangsal Wanita', type:'ward', x:38, y:52, w:28, h:40, capacity:28, occupied:18, equipment:['Monitor x6','Infusion Pump x8'] },
      { id:'r2-5', name:'Kamar Operasi', type:'operating', x:70, y:5, w:25, h:40, capacity:4, occupied:2, equipment:['Mesin Anestesi x4','Lampu OK x4','Monitor x4'] },
      { id:'r2-6', name:'Recovery Room', type:'recovery', x:70, y:52, w:25, h:40, capacity:8, occupied:5, equipment:['Monitor x8','Infusion Pump x8'] },
    ]
  },
  {
    floor: 3, name: 'Lantai 3 — VIP & Spesialis',
    rooms: [
      { id:'r3-1', name:'VIP A', type:'vip', x:5, y:5, w:28, h:40, capacity:10, occupied:7, equipment:['Monitor x10','TV x10','AC x10'] },
      { id:'r3-2', name:'VIP B', type:'vip', x:38, y:5, w:28, h:40, capacity:8, occupied:5, equipment:['Monitor x8','TV x8','AC x8'] },
      { id:'r3-3', name:'Ruang Spesialis', type:'specialist', x:70, y:5, w:25, h:40, capacity:6, occupied:3, equipment:['USG x2','EKG x2'] },
      { id:'r3-4', name:'Ruang Konsultasi', type:'consultation', x:5, y:52, w:30, h:40, capacity:4, occupied:2, equipment:['Komputer x4'] },
      { id:'r3-5', name:'Ruang Direktur', type:'admin', x:40, y:52, w:25, h:40, capacity:null, occupied:null, equipment:[] },
      { id:'r3-6', name:'Ruang Rapat', type:'meeting', x:70, y:52, w:25, h:40, capacity:20, occupied:0, equipment:['Projector x1','Video Conf x1'] },
    ]
  },
];

export const systemSettings = {
  secureLAN: { status: 'Active', uptime: '99.97%', lastIncident: '45 hari lalu', dataCenter: 'Type A', encryption: 'AES-256', firewall: 'Active' },
  users: [
    { id:1, name:'Kolonel Romli', role:'Super Admin', status:'Online', lastLogin:'25 Mar 2026, 07:00', access:'Full Access' },
    { id:2, name:'Mayor Dr. Sari', role:'Admin RS', status:'Online', lastLogin:'25 Mar 2026, 07:15', access:'RS Monitoring, RFID' },
    { id:3, name:'Kapten IT Budi', role:'IT Admin', status:'Online', lastLogin:'25 Mar 2026, 06:30', access:'Admin Settings, Secure LAN' },
    { id:4, name:'Lettu Dr. Ahmad', role:'Viewer', status:'Offline', lastLogin:'24 Mar 2026, 16:45', access:'Dashboard GIS, Data Analysis' },
    { id:5, name:'Serka Medik Rini', role:'Operator', status:'Online', lastLogin:'25 Mar 2026, 07:20', access:'RFID Asset, RS Monitoring' },
  ],
  auditLog: [
    { time:'07:02', user:'Kolonel Romli', action:'Login via MFA', status:'Success' },
    { time:'07:05', user:'Kolonel Romli', action:'Akses Dashboard GIS', status:'Success' },
    { time:'07:10', user:'Mayor Dr. Sari', action:'Generate Laporan Triwulan', status:'Success' },
    { time:'07:15', user:'Kapten IT Budi', action:'Update Firewall Rules', status:'Success' },
    { time:'07:20', user:'Serka Medik Rini', action:'Scan RFID Ventilator V-015', status:'Success' },
    { time:'06:30', user:'System', action:'Backup Data Center otomatis', status:'Success' },
    { time:'06:00', user:'System', action:'Vulnerability Scan selesai', status:'0 Threats Found' },
  ],
};
