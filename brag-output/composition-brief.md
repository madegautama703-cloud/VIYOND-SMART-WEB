# Hyperframes Composition Brief: VIYOND Smart Web Booking Engine

## Objective
Create a short launch-style brag video in Indonesian for VIYOND Smart Web Booking Engine.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: vertical — 1080x1920
- Duration: 23 seconds

## Source Material
- Project root: `/Users/madepasekmaesagautama/antigravity/VIYOND-Smart-Web-Booking-Engine`
- Primary files read: `src/app/layout.tsx`, `src/app/globals.css`, `src/config/siteConfig.ts`, `src/components/showroom/HeroLandingCover.tsx`, `src/components/showroom/KycPanel.tsx`, `src/components/showroom/PaymentPanel.tsx`, `src/components/BookingWizardApp.tsx`, `public/*`
- Product name: VIYOND Smart Web Booking Engine (brand preset `YOUR BRAND` — Bali Smart Mobility)
- Tagline / strongest claim: "Sewa Motor di Bali — Verifikasi Online Instan & Gratis Antar ke Hotel." / "tanpa tahan paspor fisik"
- Key UI or visual moment to recreate: Dark hero with green aurora, live fleet cards (`PCX`, `Vario`, `Fazzio`, `Scoopy`) with `LIVE` badge, 4-step AI KYC document scan (`Paspor / KTP Asli`, `Foto Selfie Memegang Paspor/KTP`, `Screenshot Tiket Pesawat Pulang`, `Bukti Booking Hotel / Vila`), payment selection, and `"Pesanan Diterima!"` with WhatsApp & Telegram notifications.
- Copy that must appear verbatim:
  - `Smart Web Scooter Booking Engine · Bali Showroom`
  - `Sewa Motor di Bali —`
  - `Verifikasi Online Instan`
  - `& Gratis Antar ke Hotel.`
  - `Paspor / KTP Asli`
  - `Foto Selfie Memegang Paspor/KTP`
  - `Screenshot Tiket Pesawat Pulang`
  - `Bukti Booking Hotel / Vila`
  - `Pilih Metode Pembayaran`
  - `Pembayaran Online Instan`
  - `Transfer Bank Manual (Bank Lokal)`
  - `Cash on Delivery (Bayar Saat Tiba)`
  - `Pesanan Diterima!`
  - `Buka Pelacakan Live WhatsApp`

## Creative Direction
- Tone preset: `app-store`
- Creative direction: iklan Bali yang bersih, dingin, dan percaya diri
- Interpretation: Clean feature cards inside a crisp mobile frame, smooth slide/rise transitions, fast-in then hold so every Indonesian line is readable.
- Angle: Turis di Bali biasanya harus antre, titip paspor fisik, dan chat bolak-balik. VIYOND membalikkan itu menjadi satu alur cepat langsung di browser: pilih unit armada live, verifikasi KYC AI, pilih bayar, motor diantar ke hotel.
- Hook: Tiga baris headline asli masuk berurutan di atas aurora hijau gelap + unit PCX.
- Outro / punchline: `"Tanpa tahan paspor fisik."` → `"Motor diantar ke lobi hotel Anda."` → logo VIYOND + `"Smart Web Scooter Booking Engine · Bali"`.
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated visual redesign
  - Exposing internal webhook URLs or real customer data

## Visual Identity
- Background: `#000000` (dark hero/outro), `#E6E8EA` (light showroom), `#14171F` (nav/device frame)
- Text: `#FFFFFF` (on dark), `#14171F` (on light cards)
- Accent: `#34D399`, `#059669`, `#064E3B`
- Display font: `Plus Jakarta Sans` (fallback `Helvetica Neue`, `Arial`, `sans-serif`)
- Body font: `Plus Jakarta Sans`, `JetBrains Mono` for brand/tech labels
- Visual references from the project: `public/PCX.png`, `public/Vario.png`, `public/Fazzio.png`, `public/Scoopy.png`, `public/whatsapp-logo.png`, `public/viyond-logo.png`

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Hook — 3.70s (0.00–4.10s) — Dark aurora + 3-line Indonesian headline + PCX visual.
2. Armada live — 4.74s (3.70–8.84s) — Light showroom phone UI, 4 fleet cards (`PCX`, `Vario`, `Fazzio`, `Scoopy`) arriving on beat grid, cursor taps `Vario`.
3. Verifikasi KYC — 4.74s (8.44–13.58s) — 4 KYC documents scanned sequentially and checked off, `"✓ Terverifikasi AI"` badge lands on strong cue 12.65s.
4. Bayar & terkirim — 4.73s (13.18–18.31s) — 3 payment options, cursor taps Online Instan, `"Pesanan Diterima!"` screen + WhatsApp & Telegram notifications.
5. Punchline — 5.09s (17.91–23.00s) — Dark aurora outro: `"Tanpa tahan paspor fisik."`, `"Motor diantar ke lobi hotel Anda."`, VIYOND logo & tagline.

## Audio
- Audio role: warm bed with sparse professional accents
- Audio arc: Warm corporate-upbeat music bed from 0s to 23s (fade-in 0.6s, fade-out 1.5s), subtle drop/click SFX matched to card arrivals, KYC scan completions, cursor taps, and final logo landing.
- Music: `happy-beats-business-moves-vol-11-by-ende-dot-app.mp3`
- Music treatment: `data-volume="0.3"`, `data-fade-in="0.6"`, `data-fade-out="1.5"`
- Music cue guidance: Preset `.agents/skills/brag/assets/music/cues/happy-beats-business-moves-vol-11-by-ende-dot-app.music-cues.md` (114.84 BPM). Strong cues targeted: `3.70s` (Scene 2 cut), `12.65s` (AI Verified badge), `17.91s` (Scene 5 cut). Beat grid used for sequential fleet cards (`4.23s`, `4.75s`, `5.28s`, `5.80s`) and every-other-beat KYC checks (`9.50s`, `10.54s`, `11.60s`, `12.65s`).
- Audio-reactive treatment: none (skipped cleanly as no `media-use` extraction helper is installed).
- Audio-coupled moments:
  - Scene 1 — soft drop on headline lines
  - Scene 2 — card drop sounds + tap click on Vario
  - Scene 3 — click on each KYC check + soft bell on `"✓ Terverifikasi AI"`
  - Scene 4 — tap click on payment + soft impact on `"Pesanan Diterima!"` + drops on WhatsApp/Telegram toasts
  - Scene 5 — soft impact on Scene 5 cut & VIYOND logo reveal
- SFX selection guidance: Low/medium HF risk picks from `.agents/skills/brag/assets/sfx/sfx-analysis.md` (`drop_001.ogg`, `drop_002.ogg`, `click_003.ogg`, `impactSoft_medium_001.ogg`, `impactSoft_medium_002.ogg`, `impactSoft_medium_004.ogg`, `impactBell_heavy_000.ogg`).
- Audio files: copied into `brag-output/composition/assets/music/` and `brag-output/composition/assets/sfx/`.

## Hyperframes Instructions
- Use `data-composition-id="main"`, `data-width="1080"`, `data-height="1920"`, `data-duration="23"`.
- Register GSAP timeline on `window.__timelines["main"]`.
- Run `npx hyperframes check` inside `brag-output/composition/` before rendering.
