# Brag Plan: VIYOND Smart Web Booking Engine

## What is this app?
Mesin booking sewa motor mobile-first untuk Bali: pilih unit dari armada live, unggah 4 dokumen KYC yang diverifikasi AI, bayar, lalu motor diantar gratis ke hotel. Booking otomatis diteruskan ke WhatsApp & Telegram lewat n8n.

## 9-question rubric
1. **App:** Booking engine sewa motor Bali dengan stok live (n8n), KYC berbasis AI, dan pengiriman ke hotel.
2. **Klaim terkuat:** "Sewa Motor di Bali — Verifikasi Online Instan & Gratis Antar ke Hotel." dan "tanpa tahan paspor fisik".
3. **Visual hook:** Hero gelap dengan aurora hijau (#34D399 / #059669) dan headline 3 baris.
4. **UI yang ditampilkan:** katalog armada (PCX, Vario, Fazzio, Scoopy dari `public/`), daftar 4 dokumen KYC, pilihan pembayaran, konfirmasi "Pesanan Diterima!".
5. **Video terpendek:** ±23 detik, 5 adegan.
6. **Tone:** `app-store`; arah kreatif: "iklan Bali yang bersih, dingin, dan percaya diri".
7. **Audio:** bed musik hangat + SFX kartu/klik tipis.
8. **Caption:** lihat bawah.
9. **User flow:** pilih armada → unggah 4 dokumen (verifikasi AI) → pilih pembayaran → Pesanan Diterima, notifikasi WhatsApp & Telegram.

## The angle
Bagi turis, sewa motor di Bali berarti antre, titip paspor, dan chat bolak-balik. Video ini memutar kebalikannya: satu alur di ponsel, selesai sebelum kopi dingin. Semua salinan diambil dari klaim asli proyek (bahasa Indonesia dari `siteConfig.ts` dan hero), bukan klaim baru.

## Hook (first 2-3 seconds)
Tiga baris headline asli masuk satu per satu di atas aurora hijau gelap: **"Sewa Motor di Bali —"** / **"Verifikasi Online Instan"** / **"& Gratis Antar ke Hotel."** Ditahan sampai terbaca penuh.

## Key moments (the middle)
- Empat kartu motor (PCX, Vario, Fazzio, Scoopy) masuk satu per satu dengan lencana "● LIVE" dan label "Armada live".
- Empat baris dokumen KYC dipindai satu per satu dan berubah jadi centang hijau, lalu muncul lencana "Terverifikasi AI".
- Tiga opsi pembayaran (Online Instan, Transfer Bank Manual, Cash on Delivery), lalu layar "Pesanan Diterima!" dan dua notifikasi masuk: WhatsApp dan Telegram.

## Outro / punchline
**"Tanpa tahan paspor fisik."** → **"Motor diantar ke lobi hotel Anda."** → logo VIYOND + "Smart Web Booking Engine · Bali".

## User flow worth showing
1. Entry: pilih unit dari armada live.
2. Key action: unggah 4 dokumen KYC, verifikasi AI.
3. Result: pilih bayar, Pesanan Diterima, notifikasi WhatsApp & Telegram.

## Tone
- Preset: app-store
- Creative direction: iklan Bali yang bersih, dingin, dan percaya diri
- Interpretation: kartu fitur bersih, transisi geser/halus, tanpa kekacauan. Gerak cepat masuk lalu ditahan agar terbaca.

## Format: vertical — 1080x1920
## Duration: 23 seconds

## Visual identity (from the project)
- Background: #000000 (hero) dan #14171F (nav/theme color); showroom #E6E8EA
- Accent: #34D399 (hijau), #059669, #86EFAC; teks hijau tua #064E3B
- Text: #FFFFFF di atas gelap, #14171F di atas kartu terang
- Display font: Plus Jakarta Sans (dari `layout.tsx`)
- Body font: Plus Jakarta Sans; JetBrains Mono untuk label teknis
- Strongest visual element: hero aurora gelap + kartu armada

## Share copy (draft)
VIYOND Smart Web Booking Engine: sewa motor di Bali dengan verifikasi online instan dan gratis antar ke hotel, tanpa tahan paspor fisik.

## Privacy note
Tidak ada URL webhook, nomor WhatsApp, atau data pelanggan asli di video. Nama dokumen/penyewa pada layar adalah contoh fiktif ("Contoh Penyewa").

## Audio direction
- Role: warm bed dengan aksen SFX profesional yang jarang
- Music: `happy-beats-business-moves-vol-11-by-ende-dot-app.mp3` (114.84 BPM, hangat dan bisnis; cocok untuk app-store)
- Music treatment: mulai dari 0s, volume ±0.30, fade-in 0.6s, fade-out 1.5s menjelang akhir
- Music cue guidance: preset dibaca dari `assets/music/cues/...vol-11...music-cues.md`. Strong cue: 3.70s (cut ke adegan 2), 12.65s (lencana "Terverifikasi AI"), 17.91s (cut ke outro). Beat grid dipakai untuk kartu berurutan, dengan teks diambil tiap beat ke-2 agar terbaca.
- Audio-reactive treatment: tidak tersedia (ekstraksi `media-use` tidak terpasang); dicatat di brief, dilewati.
- SFX posture: moderate, selaras gerak, lembut
- Audio-coupled moments: kartu motor satu per satu, baris KYC dipindai, notifikasi masuk
- Restraint rule: tanpa SFX tajam/berulang; tanpa voiceover (tidak diminta)

## Storyboard

### Scene 1 — Hook — 3.7s (0–3.7)
Latar hitam, aurora hijau bernapas pelan. Tiga baris headline asli masuk di 0.3s / 0.9s / 1.5s (cepat masuk, lalu ditahan hingga 3.4s).
Sequential/interaction: ya — 3 baris headline masuk berurutan, tiap baris ditahan; baris terakhir settled ≥1.3s.
Audio intent: tenang dan percaya diri.
Audio-coupled idea: drop lembut pada baris pertama dan ketiga.
Music: bed hangat masuk.
Transition mood: clean → Scene 2 (cut di strong cue 3.70s)

### Scene 2 — Armada live — 4.74s (3.7–8.44)
Latar terang #E6E8EA dalam bingkai ponsel. Judul "Pilih unit armada live" dan lencana "● LIVE". Empat kartu motor (PCX, Vario, Fazzio, Scoopy) masuk di 4.23 / 5.28 / 6.34 / 7.38s, tiap kartu bernama dan ditahan.
Sequential/interaction: ya — 4 kartu satu per satu (tiap beat); kursor memilih kartu Vario.
Audio intent: ringan dan rapi.
Audio-coupled idea: card slide per kartu; klik saat kursor memilih.
Transition mood: slide → Scene 3

### Scene 3 — Verifikasi KYC — 4.74s (8.44–13.18)
Judul "Verifikasi AI dalam hitungan menit". Empat baris dokumen: Paspor / KTP Asli; Foto Selfie Memegang Paspor/KTP; Screenshot Tiket Pesawat Pulang; Bukti Booking Hotel / Vila. Tiap baris dipindai lalu centang di 9.50 / 10.54 / 11.60 / 12.65s. Di 12.65s lencana "Terverifikasi AI".
Sequential/interaction: ya — baris dipindai satu per satu (tiap beat ke-2); judul tertahan penuh.
Audio intent: terasa teliti dan memuaskan.
Audio-coupled idea: klik halus per centang; bell lembut di lencana.
Transition mood: slide → Scene 4

### Scene 4 — Bayar & terkirim — 4.73s (13.18–17.91)
Tiga opsi pembayaran masuk berurutan: "Pembayaran Online Instan", "Transfer Bank Manual", "Cash on Delivery". Opsi online terpilih, layar "Pesanan Diterima!" muncul, dua notifikasi (WhatsApp, Telegram) masuk dari atas di 15.81 / 16.86s.
Sequential/interaction: ya — opsi dan notifikasi berurutan; kursor mengetuk opsi.
Audio intent: tuntas dan tenang.
Audio-coupled idea: klik opsi, drop dua notifikasi.
Transition mood: clean → Scene 5 (cut di strong cue 17.91s)

### Scene 5 — Punchline — 5.09s (17.91–23.0)
Kembali gelap dengan aurora. "Tanpa tahan paspor fisik." (18.2s), lalu "Motor diantar ke lobi hotel Anda." (19.5s), lalu logo VIYOND + "Smart Web Booking Engine · Bali" (20.5s), ditahan hingga 23s.
Sequential/interaction: ya — tiga lapis teks; tiap lapis ditahan ≥1.2s.
Audio intent: payoff hangat; musik mengecil.
Audio-coupled idea: impact lembut saat logo mendarat.
Music: fade-out dari 21.5s.

**Music mood for this video:** upbeat, bersih
**Audio summary:** bed hangat dengan aksen kartu/klik lembut dan satu bell di centang akhir, ditutup impact lembut pada logo dengan musik memudar.
