/**
 * VIYOND Master Template Configuration
 * TAHAP 4: STANDARISASI "MASTER TEMPLATE WEB" (SIAP DUPLIKASI 15 MENIT)
 *
 * Pisahkan semua konfigurasi klien dan URL Webhook n8n ke file ini.
 * Untuk klien baru:
 * 1. Duplikasi repository
 * 2. Ubah isi siteConfig.ts (brandName, whatsappNumber, n8n webhook URLs, dll.)
 * 3. Deploy ke Vercel / Cloudflare Pages (100% Free Jamstack Architecture)
 */

export interface SiteConfig {
  brandName: string;
  brandTagline: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  whatsappNumber: string;
  n8nGetInventoryEndpoint: string;
  n8nPostBookingEndpoint: string;
  googleMapsLocation: string;
  usdExchangeRate: number;
  /**
   * System Toggle:
   * true = Showcase / Prototype / UAT Mode (dengan banner showcase, navigasi simulasi, frame HP buatan, tombol /stok)
   * false = Production Mode (bersih, responsif penuh langsung ke form booking, tanpa elemen UAT / simulasi)
   */
  isShowcaseMode: boolean;
}

export const defaultSiteConfig: SiteConfig = {
  brandName: 'VIYOND',
  brandTagline: 'Vision & Beyond · Bali Smart Mobility',
  logoUrl: '/assets/aistudio/design_UI_UX_V_35fb639f.svg',
  primaryColor: '#1b5fd4',
  secondaryColor: '#0a1d45',
  accentColor: '#2f7bff',
  whatsappNumber: '6281239998877',
  // Production Webhook GET n8n
  n8nGetInventoryEndpoint:
    process.env.NEXT_PUBLIC_N8N_GET_INVENTORY_WEBHOOK_URL ||
    'https://n8n.srv2075779.hstgr.cloud/webhook/viyond-live-inventory',
  n8nPostBookingEndpoint:
    process.env.NEXT_PUBLIC_N8N_CREATE_BOOKING_WEBHOOK_URL ||
    'https://n8n.srv2075779.hstgr.cloud/webhook/viyond-create-booking',
  googleMapsLocation: 'https://maps.google.com/?q=-8.6500,115.1333',
  usdExchangeRate: 15625, // Rp 1.000.000 ≈ 64 USD
  isShowcaseMode: true,
};

export const clientPresets: Record<string, SiteConfig> = {
  viyond: defaultSiteConfig,
  bliMade: {
    brandName: 'Bli Made Scooter Rental',
    brandTagline: 'Canggu & Seminyak Express Delivery',
    logoUrl: '/assets/aistudio/design_UI_UX_V_35fb639f.svg',
    primaryColor: '#2563EB',
    secondaryColor: '#0f172a',
    accentColor: '#38bdf8',
    whatsappNumber: '6281999112233',
    n8nGetInventoryEndpoint: 'https://n8n.srv2075779.hstgr.cloud/webhook/viyond-live-inventory',
    n8nPostBookingEndpoint: '/api/n8n/create-booking',
    googleMapsLocation: 'https://maps.google.com/?q=-8.6478,115.1385',
    usdExchangeRate: 15625,
    isShowcaseMode: true,
  },
  uluwatuMoto: {
    brandName: 'Uluwatu Surf Riders',
    brandTagline: 'South Kuta & Bukit Peninsula Fleet',
    logoUrl: '/assets/aistudio/design_UI_UX_V_35fb639f.svg',
    primaryColor: '#0EA5E9',
    secondaryColor: '#0369a1',
    accentColor: '#7dd3fc',
    whatsappNumber: '6281333445566',
    n8nGetInventoryEndpoint: 'https://n8n.srv2075779.hstgr.cloud/webhook/viyond-live-inventory',
    n8nPostBookingEndpoint: '/api/n8n/create-booking',
    googleMapsLocation: 'https://maps.google.com/?q=-8.8149,115.0884',
    usdExchangeRate: 15625,
    isShowcaseMode: true,
  },
};

export type UnitStatus = 'READY' | 'DISEWA' | 'BENGKEL';

export interface InventoryUnitRow {
  unitId: string;
  categoryId: 'nmax' | 'pcx' | 'scoopy' | 'vario' | 'fazzio';
  plateNumber: string; // Stored in Master DB Google Sheets, hidden from public GET endpoint
  status: UnitStatus;
}

export interface VehicleCategory {
  id: 'nmax' | 'pcx' | 'scoopy' | 'vario' | 'fazzio';
  name: string;
  shortName: string;
  segment: 'maxi' | 'compact';
  specsEn: string;
  specsId: string;
  imageFile: string;
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  featured?: boolean;
}

export interface DeliveryZone {
  code: string;
  name?: string;
  coverage?: string;
  fee: number;
  id?: string;
  labelEn?: string;
  labelId?: string;
  areaNames?: string;
}

export const VEHICLE_CATEGORIES: VehicleCategory[] = [
  {
    id: 'nmax',
    name: 'Yamaha NMAX 155',
    shortName: 'Yamaha NMAX 155',
    segment: 'maxi',
    specsEn: 'Comfort Touring · 2 Helmets · ABS',
    specsId: 'Touring Nyaman · 2 Helm SNI · ABS',
    imageFile: 'NMAX.webp',
    dailyPrice: 150000,
    weeklyPrice: 950000,
    monthlyPrice: 2800000,
    featured: true,
  },
  {
    id: 'pcx',
    name: 'Honda PCX 160',
    shortName: 'Honda PCX 160',
    segment: 'maxi',
    specsEn: 'Luxury Cruiser · 2 Helmets · Keyless ABS',
    specsId: 'Cruiser Mewah · 2 Helm SNI · Keyless ABS',
    imageFile: 'PCX.webp',
    dailyPrice: 150000,
    weeklyPrice: 950000,
    monthlyPrice: 2800000,
    featured: false,
  },
  {
    id: 'scoopy',
    name: 'Honda Scoopy',
    shortName: 'Scoopy',
    segment: 'compact',
    specsEn: 'Retro Light · 2 Helmets · USB Charger',
    specsId: 'Retro Ringan · 2 Helm · Charger USB',
    imageFile: 'Scoopy.webp',
    dailyPrice: 85000,
    weeklyPrice: 520000,
    monthlyPrice: 1500000,
  },
  {
    id: 'vario',
    name: 'Honda Vario 160',
    shortName: 'Vario 160',
    segment: 'compact',
    specsEn: 'Sporty Agile · 2 Helmets · Smart Key',
    specsId: 'Sporty Gesit · 2 Helm · Smart Key',
    imageFile: 'Vario.webp',
    dailyPrice: 110000,
    weeklyPrice: 680000,
    monthlyPrice: 1950000,
  },
  {
    id: 'fazzio',
    name: 'Yamaha Fazzio',
    shortName: 'Fazzio',
    segment: 'compact',
    specsEn: 'Hybrid Classic · 2 Helmets · LED',
    specsId: 'Klasik Hybrid · 2 Helm · Lampu LED',
    imageFile: 'Fazzio.webp',
    dailyPrice: 90000,
    weeklyPrice: 560000,
    monthlyPrice: 1600000,
  },
];

// Master DB Tab: INVENTARIS_MOTOR
// Default fleet status with fallback units ready for live customer booking
export const INITIAL_INVENTARIS_MOTOR: InventoryUnitRow[] = [
  // NMAX (3 READY, 1 DISEWA)
  { unitId: 'NMAX-01', categoryId: 'nmax', plateNumber: 'DK 4821 FBV', status: 'READY' },
  { unitId: 'NMAX-02', categoryId: 'nmax', plateNumber: 'DK 5109 FBV', status: 'READY' },
  { unitId: 'NMAX-03', categoryId: 'nmax', plateNumber: 'DK 6290 FBV', status: 'READY' },
  { unitId: 'NMAX-04', categoryId: 'nmax', plateNumber: 'DK 3312 FBV', status: 'DISEWA' },
  // PCX (2 READY, 1 DISEWA, 1 BENGKEL)
  { unitId: 'PCX-01', categoryId: 'pcx', plateNumber: 'DK 8812 FCX', status: 'READY' },
  { unitId: 'PCX-02', categoryId: 'pcx', plateNumber: 'DK 8845 FCX', status: 'READY' },
  { unitId: 'PCX-03', categoryId: 'pcx', plateNumber: 'DK 8901 FCX', status: 'BENGKEL' },
  // Scoopy (3 READY, 1 DISEWA)
  { unitId: 'SCP-01', categoryId: 'scoopy', plateNumber: 'DK 2101 KAA', status: 'READY' },
  { unitId: 'SCP-02', categoryId: 'scoopy', plateNumber: 'DK 2102 KAA', status: 'READY' },
  { unitId: 'SCP-03', categoryId: 'scoopy', plateNumber: 'DK 2103 KAA', status: 'READY' },
  { unitId: 'SCP-04', categoryId: 'scoopy', plateNumber: 'DK 2104 KAA', status: 'DISEWA' },
  // Vario 160 (3 READY, 1 DISEWA)
  { unitId: 'VAR-01', categoryId: 'vario', plateNumber: 'DK 7411 BAA', status: 'READY' },
  { unitId: 'VAR-02', categoryId: 'vario', plateNumber: 'DK 7412 BAA', status: 'READY' },
  { unitId: 'VAR-03', categoryId: 'vario', plateNumber: 'DK 7413 BAA', status: 'READY' },
  { unitId: 'VAR-04', categoryId: 'vario', plateNumber: 'DK 7414 BAA', status: 'DISEWA' },
  // Fazzio (2 READY, 1 DISEWA)
  { unitId: 'FAZ-01', categoryId: 'fazzio', plateNumber: 'DK 9011 FAA', status: 'READY' },
  { unitId: 'FAZ-02', categoryId: 'fazzio', plateNumber: 'DK 9012 FAA', status: 'READY' },
  { unitId: 'FAZ-03', categoryId: 'fazzio', plateNumber: 'DK 9013 FAA', status: 'DISEWA' },
];

// Master DB Tab: ZONA_ONGKIR
export const INITIAL_ZONA_ONGKIR: DeliveryZone[] = [
  {
    id: 'zona-1',
    code: 'ZONA-1',
    name: 'Zona 1: Area Kuta & Seminyak (Free)',
    coverage: 'Kuta, Legian, Seminyak, Tuban Airport',
    labelEn: 'Zona 1: Kuta / Seminyak (Free)',
    labelId: 'Zona 1: Kuta / Seminyak (Gratis)',
    areaNames: 'Kuta, Legian, Seminyak, Tuban Airport',
    fee: 0,
  },
  {
    id: 'zona-2',
    code: 'ZONA-2',
    name: 'Zona 2: Area Canggu & Jimbaran (+Rp 50.000)',
    coverage: 'Canggu, Berawa, Pererenan, Jimbaran, Kerobokan',
    labelEn: 'Zona 2: Canggu / Jimbaran (+Rp 50.000)',
    labelId: 'Zona 2: Canggu / Jimbaran (+Rp 50.000)',
    areaNames: 'Canggu, Berawa, Pererenan, Jimbaran, Kerobokan',
    fee: 50000,
  },
  {
    id: 'zona-3',
    code: 'ZONA-3',
    name: 'Zona 3: Area Uluwatu, Sanur & Ubud (+Rp 100.000)',
    coverage: 'Uluwatu, Bingin, Ungasan, Ubud, Nusa Dua, Sanur',
    labelEn: 'Zona 3: Uluwatu / Ubud (+Rp 100.000)',
    labelId: 'Zona 3: Uluwatu / Ubud (+Rp 100.000)',
    areaNames: 'Uluwatu, Bingin, Ungasan, Ubud, Nusa Dua, Sanur',
    fee: 100000,
  },
];

export const DELIVERY_TIME_SLOTS = [
  { value: '08:00 AM WITA (Early Bird Delivery)', labelEn: '08:00 AM WITA (Early Bird Delivery)', labelId: '08:00 WITA (Pengantaran Pagi Awal)' },
  { value: '10:00 AM WITA (Morning Delivery)', labelEn: '10:00 AM WITA (Morning Delivery)', labelId: '10:00 WITA (Pengantaran Pagi)' },
  { value: '01:00 PM WITA (Check-in Delivery)', labelEn: '01:00 PM WITA (Check-in Delivery)', labelId: '13:00 WITA (Saat Check-in Hotel)' },
  { value: '04:00 PM WITA (Afternoon Delivery)', labelEn: '04:00 PM WITA (Afternoon Delivery)', labelId: '16:00 WITA (Pengantaran Sore)' },
  { value: '07:00 PM WITA (Evening Delivery)', labelEn: '07:00 PM WITA (Evening Delivery)', labelId: '19:00 WITA (Pengantaran Malam)' },
];

export const BILINGUAL_COPY = {
  en: {
    heroTitleLine1: 'Rent a Scooter',
    heroTitleLine2: 'in Bali — Instant',
    heroSubtitle: 'Online verification and free hotel delivery in minutes.',
    trustGoogle: '4.9/5 Google Reviews',
    trustHelmet: 'Helmet + Holder Included',
    trustInstant: '24/7 Instant Booking',
    step1Tab: '1. Unit & Zone',
    step2Tab: '2. KYC Upload',
    step3Tab: '3. Payment',
    selectRentalPeriod: 'Select rental period',
    startDate: 'START DATE',
    endDate: 'END DATE',
    daysUnit: 'DAYS',
    checkLiveStockBtn: 'Check Availability',
    checkLiveStockUatBtn: 'Check Live Stock (n8n Sync)',
    syncingStock: 'Checking Availability...',
    syncingStockUat: 'Syncing n8n Master DB...',
    liveFleetCatalog: 'Live Fleet Catalog',
    allUnits: 'All Units',
    filters: 'Available Only',
    unitsAvailable: 'Units Available',
    readySuffix: 'Ready',
    soldOut: 'Sold Out',
    allUnitsRented: 'All units currently rented / in maintenance',
    unavailableForDates: 'Unavailable for Selected Dates',
    selectedForBooking: 'Selected for Booking',
    selectUnit: 'Select',
    deliveryZoneTitle: 'Delivery Zone and Hotel Details',
    syncedWithTab: 'Synced with tab ZONA_ONGKIR',
    deliveryAreaZone: 'DELIVERY AREA ZONE',
    hotelVillaRoom: 'HOTEL / VILLA NAME AND ROOM NO.',
    preferredDeliveryTime: 'PREFERRED DELIVERY TIME',
    rentalTermsFaqTitle: 'Rental Terms and Insurance FAQ (EN/ID)',
    totalEstimate: 'Total Estimate',
    autoTiered: 'Auto-Tiered',
    continueToVerification: 'Continue to Verification',
    // Step 2
    step2Header: 'Step 2 of 3 — Identity KYC',
    instantVerificationTitle: 'Instant Verification',
    instantVerificationSub: 'Auto client-side compression (under 500KB) and AI Vision check.',
    renterContactDetails: 'Renter contact details',
    fullNameLabel: 'FULL NAME (AS ON PASSPORT / KTP)',
    whatsappLabel: 'ACTIVE WHATSAPP NUMBER (FOR E-RECEIPT)',
    nationalityLabel: 'NATIONALITY',
    upload4DocsTitle: 'Upload 4 mandatory KYC documents',
    doc1Title: '1. Passport / ID Card (KTP)',
    doc2Title: '2. Selfie Holding Your ID/Passport',
    doc3Title: '3. Return Flight Ticket Screenshot',
    doc4Title: '4. Hotel / Villa Booking Confirmation',
    retakeReplacePhoto: 'Retake / Replace Photo',
    tapToUploadFile: '+ Tap to Upload File',
    takePhotoCamera: 'Take with Camera',
    changeBtn: 'Change',
    pdpConsentPart1: 'I agree to the processing of my identity documents for rental verification (UU PDP). Documents are ',
    pdpConsentHighlight: 'auto-deleted 24 hours after rental ends',
    continueToPayment: 'Continue to Payment',
    // Step 3
    step3Header: 'Step 3 of 3 — Payment',
    bookingSummary: 'BOOKING SUMMARY',
    selectPaymentMethod: 'Select Payment Method',
    payOption1Title: 'Instant Online Payment',
    payOption1Desc: 'Visa / Mastercard / QRIS / Virtual Account',
    payOption1Sub: 'Powered by Xendit / Midtrans — Instant Lock',
    payOption2Title: 'Manual Bank Transfer (Local Bank)',
    payOption2Desc: 'BCA / Mandiri / BNI — Upload transfer receipt',
    payOption2Sub: 'Requires owner verification via Telegram Bot',
    payOption3Title: 'Cash on Delivery (Pay on Arrival)',
    payOption3Badge: 'Verified Foreign Tourists Only',
    payOption3Sub: 'Pay cash to courier when scooter arrives at hotel.',
    submitVerifyBooking: 'Submit and Verify My Booking',
    bookingReceivedTitle: 'Booking Received!',
    openWhatsappTracking: 'Open WhatsApp Live Tracking',
    askAiCs: 'Ask CS',
    directWhatsapp: 'Chat WhatsApp',
    termsItems: [
      {
        q: 'What is included in every scooter rental?',
        a: 'Every rental includes 2 sanitized SNI helmets, a waterproof phone holder, USB charging port (on selected units), vehicle registration (STNK), and free Zone 1 hotel delivery.',
      },
      {
        q: 'How does the tier pricing calculator work?',
        a: '1–6 days uses the Daily Rate. 7–29 days automatically switches to the discounted Weekly Package + remaining days. 30+ days unlocks the Monthly Package.',
      },
      {
        q: 'How is my Passport/KTP data protected (UU PDP)?',
        a: 'Photos are compressed in your browser (<500KB), verified by AI Vision OCR for clarity only, and automatically purged 24 hours after your scooter is returned.',
      },
    ],
  },
  id: {
    heroTitleLine1: 'Sewa Motor',
    heroTitleLine2: 'di Bali — Instan',
    heroSubtitle: 'Verifikasi online & gratis pengantaran hotel dalam hitungan menit.',
    trustGoogle: '4.9/5 Ulasan Google',
    trustHelmet: '2 Helm SNI + Holder HP',
    trustInstant: 'Booking Instan 24/7',
    step1Tab: '1. Unit & Zona',
    step2Tab: '2. Unggah KYC',
    step3Tab: '3. Pembayaran',
    selectRentalPeriod: 'Pilih tanggal sewa',
    startDate: 'TANGGAL MULAI',
    endDate: 'TANGGAL SELESAI',
    daysUnit: 'HARI',
    checkLiveStockBtn: 'Cek Ketersediaan',
    checkLiveStockUatBtn: 'Cek Stok Live (Sinkron n8n)',
    syncingStock: 'Mengecek Ketersediaan...',
    syncingStockUat: 'Menarik Data Master DB...',
    liveFleetCatalog: 'Katalog Unit Live',
    allUnits: 'Semua Unit',
    filters: 'Hanya Tersedia',
    unitsAvailable: 'Unit Tersedia',
    readySuffix: 'Tersedia',
    soldOut: 'Stok Habis',
    allUnitsRented: 'Seluruh unit sedang disewa / perawatan bengkel',
    unavailableForDates: 'Tidak Tersedia di Tanggal Ini',
    selectedForBooking: 'Dipilih untuk Sewa',
    selectUnit: 'Pilih',
    deliveryZoneTitle: 'Zona Pengantaran & Detail Hotel',
    syncedWithTab: 'Tersinkronisasi dengan tab ZONA_ONGKIR',
    deliveryAreaZone: 'ZONA AREA PENGANTARAN',
    hotelVillaRoom: 'NAMA HOTEL / VILA DAN NOMOR KAMAR',
    preferredDeliveryTime: 'JAM PENGANTARAN',
    rentalTermsFaqTitle: 'Syarat Sewa & FAQ Asuransi (EN/ID)',
    totalEstimate: 'Estimasi Total',
    autoTiered: 'Tarif Bertingkat',
    continueToVerification: 'Lanjut ke Verifikasi KYC',
    // Step 2
    step2Header: 'Langkah 2 dari 3 — Identitas KYC',
    instantVerificationTitle: 'Verifikasi Instan',
    instantVerificationSub: 'Kompresi otomatis di browser (<500KB) dan validasi AI Vision OCR.',
    renterContactDetails: 'Data kontak penyewa',
    fullNameLabel: 'NAMA LENGKAP (SESUAI PASPOR / KTP)',
    whatsappLabel: 'NOMOR WHATSAPP AKTIF (UNTUK E-RECEIPT)',
    nationalityLabel: 'KEWARGANEGARAAN',
    upload4DocsTitle: 'Unggah 4 dokumen wajib KYC',
    doc1Title: '1. Paspor / KTP Asli',
    doc2Title: '2. Foto Selfie Memegang Paspor/KTP',
    doc3Title: '3. Screenshot Tiket Pesawat Pulang',
    doc4Title: '4. Bukti Booking Hotel / Vila',
    retakeReplacePhoto: 'Foto Ulang / Ganti Foto',
    tapToUploadFile: '+ Ketuk untuk Unggah File',
    takePhotoCamera: 'Ambil dengan Kamera',
    changeBtn: 'Ubah',
    pdpConsentPart1: 'Saya menyetujui pemrosesan dokumen identitas untuk verifikasi sewa kendaraan (UU PDP). Dokumen ',
    pdpConsentHighlight: 'dihapus otomatis 24 jam setelah masa sewa berakhir',
    continueToPayment: 'Lanjut ke Pembayaran',
    // Step 3
    step3Header: 'Langkah 3 dari 3 — Pembayaran',
    bookingSummary: 'RINGKASAN PESANAN',
    selectPaymentMethod: 'Pilih Metode Pembayaran',
    payOption1Title: 'Pembayaran Online Instan',
    payOption1Desc: 'Visa / Mastercard / QRIS / Virtual Account',
    payOption1Sub: 'Via Xendit / Midtrans — Kunci Unit Otomatis',
    payOption2Title: 'Transfer Bank Manual (Bank Lokal)',
    payOption2Desc: 'BCA / Mandiri / BNI — Unggah bukti transfer',
    payOption2Sub: 'Menunggu persetujuan Owner via Telegram Bot',
    payOption3Title: 'Cash on Delivery (Bayar Saat Tiba)',
    payOption3Badge: 'Khusus Turis Asing Terverifikasi',
    payOption3Sub: 'Bayar tunai ke kurir saat motor tiba di hotel.',
    submitVerifyBooking: 'Kirim & Verifikasi Pesanan Saya',
    bookingReceivedTitle: 'Pesanan Diterima!',
    openWhatsappTracking: 'Buka Pelacakan Live WhatsApp',
    askAiCs: 'Tanya CS',
    directWhatsapp: 'Chat WhatsApp',
    termsItems: [
      {
        q: 'Apa saja fasilitas yang termasuk dalam sewa motor?',
        a: 'Setiap unit dilengkapi 2 helm SNI bersih, holder HP tahan air, port USB charger (unit tertentu), STNK asli, serta gratis ongkir untuk area Zona 1 (Kuta/Seminyak).',
      },
      {
        q: 'Bagaimana rumus perhitungan harga bertingkat (Live Price)?',
        a: 'Durasi 1–6 hari menggunakan Harga Harian. Durasi 7–29 hari otomatis menggunakan Paket Mingguan + sisa hari. Durasi 30+ hari menggunakan Paket Bulanan hemat.',
      },
      {
        q: 'Bagaimana keamanan foto KTP/Paspor saya (Kepatuhan UU PDP)?',
        a: 'Foto dikompres otomatis di browser (<500KB), diperiksa kejelasannya oleh AI Vision OCR, dan dihapus otomatis dari sistem 24 jam setelah masa sewa selesai.',
      },
    ],
  },
};
