import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log("Navigating to application...");
  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await delay(2000);

  console.log("Logging in...");
  await page.waitForSelector('input[placeholder="kolonel.romli"]', { timeout: 10000 });
  await page.type('input[placeholder="kolonel.romli"]', 'kolonel.romli');
  await page.type('input[type="password"]', 'ikhi2026!');
  await page.click('button[type="submit"]');

  await page.waitForSelector('.login-mfa-value');
  const mfaCode = await page.$eval('.login-mfa-value', el => el.textContent);
  await page.type('.login-mfa-input', mfaCode);
  await page.click('button[type="submit"]');

  console.log("Waiting for dashboard...");
  await page.waitForSelector('.app', { timeout: 10000 });
  await delay(2000); // let animations settle

  console.log("Capturing Dashboard...");
  await page.click('a[href="/"]');
  await delay(3000);
  await page.screenshot({ path: 'ss_dashboard.png' });

  console.log("Capturing KPI (RS Monitoring / Analysis)...");
  await page.click('a[href="/analysis"]');
  await delay(3000);
  await page.screenshot({ path: 'ss_kpi.png' });

  console.log("Capturing RFID Tracking...");
  await page.click('a[href="/rfid"]');
  await delay(5000); // Give RFID map more time
  await page.screenshot({ path: 'ss_rfid.png' });

  console.log("Capturing DSS / Reports...");
  await page.click('a[href="/news"]');
  await delay(3000);
  await page.screenshot({ path: 'ss_dss.png' });

  console.log("Capturing Admin Settings - Network Topology...");
  await page.click('a[href="/admin"]');
  await delay(3000);
  await page.screenshot({ path: 'ss_network.png' });

  console.log("Capturing Admin Settings - System Integration...");
  const tabs = await page.$$('.adm-tab');
  for (let tab of tabs) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text.includes('System Integration')) {
      await tab.click();
      break;
    }
  }
  await delay(2000);
  await page.screenshot({ path: 'ss_system.png' });

  console.log("Generating HTML & PDF...");
  
  const toBase64 = (file) => {
    const fullPath = path.resolve(__dirname, file);
    if (!fs.existsSync(fullPath)) {
      console.warn('WARNING: Screenshot not found:', fullPath);
      return '';
    }
    return 'data:image/png;base64,' + fs.readFileSync(fullPath).toString('base64');
  };

  // Read all images FIRST
  const imgDashboard = toBase64('ss_dashboard.png');
  const imgKpi = toBase64('ss_kpi.png');
  const imgRfid = toBase64('ss_rfid.png');
  const imgDss = toBase64('ss_dss.png');
  const imgNetwork = toBase64('ss_network.png');
  const imgSystem = toBase64('ss_system.png');

  console.log("Images loaded:", {
    dashboard: imgDashboard.length > 100,
    kpi: imgKpi.length > 100,
    rfid: imgRfid.length > 100,
    dss: imgDss.length > 100,
    network: imgNetwork.length > 100,
    system: imgSystem.length > 100,
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Resume Eksekutif - IKHIS Command Center</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
    h1 { color: #0f172a; text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; margin-bottom: 30px; }
    h2 { color: #1e3a5f; margin-top: 40px; border-left: 4px solid #3b82f6; padding-left: 10px; }
    p { margin-bottom: 15px; text-align: justify; }
    .screenshot { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .features-list { margin-bottom: 20px; }
    .features-list li { margin-bottom: 10px; }
    .page-break { page-break-before: always; }
    .caption { text-align: center; font-style: italic; font-size: 0.9em; color: #64748b; margin-top: -10px; margin-bottom: 30px; }
  </style>
</head>
<body>

  <h1>RESUME EKSEKUTIF<br><span style="font-size: 0.7em; color: #475569;">IKHIS COMMAND CENTER - KEMENTERIAN PERTAHANAN</span></h1>
  
  <p>Dokumen ini menyajikan uraian ringkas mengenai <strong>Integrated Kemhan Health Intelligence System (IKHIS) Command Center</strong>. Aplikasi ini dibangun sebagai inovasi strategis untuk menjadi platform monitoring sentral seluruh rumah sakit militer di bawah Kementerian Pertahanan, dengan 17 RS (TNI AD, AL, AU) sebagai sumber data primer dan <strong>RSPPN PB Soedirman sebagai rumah sakit percontohan dan acuan utama</strong>.</p>

  <h2>1. Aplikasi Monitoring Sentral Terpadu</h2>
  <p>IKHIS Command Center berfungsi sebagai tulang punggung <strong>aplikasi monitoring</strong> seluruh aset dan fasilitas kesehatan Kemhan. Dengan pendekatan visual spasial (GIS) secara real-time, Command Center memberikan visibilitas penuh perihal status kapasitas, ketersediaan SDM militer, serta ketersediaan tempat tidur dan logistik di 17 RS secara simultan, sehingga memungkinkan pengambilan keputusan komando secara presisi kapan pun dibutuhkan.</p>
  <img src="${imgDashboard}" class="screenshot" />
  <div class="caption">Gambar 1: Dashboard Monitoring Utama dengan Pemetaan GIS</div>

  <h2>2. Analisis Grafik Kinerja & 15 Parameter Indikator Kinerja Utama (KPI)</h2>
  <p>Kekuatan analisis IKHIS didukung penyajian visual melalui <strong>analisis grafik kinerja komprehensif</strong>, mencakup pengukuran otomatis atas <strong>15 parameter Indikator Kinerja Utama (IKU)</strong>. Data ditarik dari seluruh layanan klinis hingga layanan operasional administratif, membantu para pimpinan untuk segera menemukan <em>bottleneck</em> maupun tingkat keberhasilan suatu program layanan di level rumah sakit, wilayah, maupun matra (AD/AL/AU).</p>
  <p><strong>Keunggulan:</strong> Pengambilan keputusan berbasis data konkret melalui grafik visual interaktif yang seketika merepresentasikan efektivitas dan utilitas layanan 17 RS Kemhan.</p>
  <img src="${imgKpi}" class="screenshot" />
  <div class="caption">Gambar 2: Modul Analisis Data dan 15 Parameter KPI RS Kemhan</div>

  <h2>3. Integrasi Data SIM RS Kemhan Berbasis RSPPN</h2>
  <p>Seluruh rumah sakit telah distandardisasi dengan skema pertukaran data medis kelas dunia (HL7 FHIR R4). <strong>Integrasi data dari seluruh Sistem Informasi Manajemen (SIM) RS Kemhan</strong> terpusat dan dilakukan dengan menggunakan metodologi yang telah mapan di <strong>RSPPN PB Soedirman</strong>. Standarisasi ini memastikan keseragaman, validitas, dan kontinuitas pengolahan Big Data Medis Militer tanpa celah sistem interoperabilitas.</p>

  <h2>4. Integrasi RFID Real-Time Tracking</h2>
  <p>Fitur unggulan lainnya adalah kapabilitas sistem untuk <strong>menampilkan integrasi RFID real-time tracking</strong>. Apabila data infrastruktur pelacakan spasial di 17 RS (sensor UHF 915MHz dan active tag) telah tersedia dan tayang, sistem ini memantau secara akurat pergerakan ribuan inventaris medis, sirkulasi dokter/perawat/personel militer, hingga pasien kritis (VIP/VVIP maupun trauma triage). Visualisasinya dipetakan dalam denah 2D dan isometrik 3D per bangunan.</p>
  <img src="${imgRfid}" class="screenshot" />
  <div class="caption">Gambar 3: Modul Pelacakan RFID Real-Time Terintegrasi Denah Spasial</div>

  <div class="page-break"></div>

  <h2>5. Reports dan DSS (Decision Support System)</h2>
  <p>Platform IKHIS disertai modul <strong>Report dan DSS (Sistem Pendukung Keputusan / Decision Support System)</strong>, yang tidak hanya mengoleksi <em>crawler report</em> berita/info kesehatan terkini dengan kecerdasan buatan, tapi juga mencetak hasil komputasi laporan taktis untuk pimpinan. DSS mengkalkulasi skenario prediktif (seperti lonjakan pasien atau penipisan logistik darah) dengan menggunakan NLP dan algoritma analitik lanjut, memberikan output rekomendasi tindak komando.</p>
  <img src="${imgDss}" class="screenshot" />
  <div class="caption">Gambar 4: Modul News & Reports Mendukung Fungsi DSS</div>

  <h2>6. Data Center di Setiap RS Type A (Terpusat)</h2>
  <p>Secara infrastruktur, IKHIS beroperasi di bawah payung topologi hybrid yang robust. <strong>Data Center ditempatkan secara terdesentralisasi di setiap RS Type A (Regional)</strong> seperti RSPPN, RSPAD, RSAL Mintohardjo, dan RSAU Esnawan Antariksa, yang berfungsi sebagai simpul/hub data per wilayah matra, sebelum seluruh agregasinya dialirkan dan dikoordinasi secara <strong>terpusat (Central)</strong>. Hal ini meminimalisasi latensi sekaligus menyediakan sistem <em>Disaster Recovery</em> tingkat tinggi bagi Kemhan RI.</p>

  <div class="page-break"></div>

  <h1>LAMPIRAN ARSITEKTUR</h1>
  <p>Berikut ini adalah lampiran arsitektur teknis dan dokumentasi integrasi IKHIS Command Center yang menjadi fondasi utama operabilitas 17 RS Kemhan.</p>

  <h2>Lampiran 1: Network Topology Overview</h2>
  <p>Gambaran holistik dari topologi jaringan tiering keamanan Command Center menuju simpul-simpul Data Center RS.</p>
  <img src="${imgNetwork}" class="screenshot" />
  <div class="caption">Lampiran 1: Arsitektur Network Topology Overview (Admin Settings)</div>

  <h2>Lampiran 2: System Integration Documentation</h2>
  <p>Arsitektur 4-tier dari mulai Command Center, Middleware (API Gateway, Kafka, dll), Data Center Regional, dan 17 SIM RS. Beserta protokol pertukaran (gRPC, WSS, HTTPS, dll).</p>
  <img src="${imgSystem}" class="screenshot" />
  <div class="caption">Lampiran 2: Arsitektur System Integration Documentation</div>

</body>
</html>
  `;

  const pdfPage = await browser.newPage();
  await pdfPage.setContent(html, { waitUntil: 'domcontentloaded' });
  await pdfPage.pdf({ path: 'Resume_Eksekutif_IKHIS.pdf', format: 'A4', printBackground: true, margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' } });

  console.log("PDF generated successfully: resume_eksekutif.pdf");
  await browser.close();
}

run().catch(console.error);
