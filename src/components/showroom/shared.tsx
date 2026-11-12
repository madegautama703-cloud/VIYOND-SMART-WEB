'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { CategoryId, CopyDictionary, PaymentMethod } from './types';

/** Shared design tokens (Bento Showroom + Native App Card Sheet) */
export const BENTO_CARD =
  'bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/50';

const SCOOTER_IMAGE_MAP: Record<CategoryId, string> = {
  nmax: '/NMAX.png',
  pcx: '/PCX.png',
  scoopy: '/Scoopy.png',
  vario: '/Vario.png',
  fazzio: '/Fazzio.png',
};

/**
 * Renders each scooter's authentic transparent studio photo (NMAX 155, PCX 160,
 * Scoopy, Vario 160, Fazzio) with a realistic showroom floor contact shadow,
 * falling back to ScooterStudioRender only if an image fails to load.
 */
export function ScooterVisual({
  imageFile,
  variant,
  alt,
  className = '',
  dimmed = false,
}: {
  imageFile: string;
  variant: CategoryId;
  alt: string;
  className?: string;
  dimmed?: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  const resolvedSrc =
    imageFile.startsWith('http://') ||
    imageFile.startsWith('https://') ||
    imageFile.startsWith('data:') ||
    imageFile.startsWith('/')
      ? imageFile
      : SCOOTER_IMAGE_MAP[variant] || `/${imageFile}`;

  if (!imgFailed) {
    return (
      <div
        className={`relative flex items-center justify-center select-none pointer-events-none ${className} ${
          dimmed ? 'opacity-40 grayscale' : ''
        }`}
      >
        {/* Showroom floor contact shadow */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[3%] left-1/2 h-[12%] w-[76%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(20,23,31,0.28)_0%,rgba(20,23,31,0.10)_52%,transparent_78%)] blur-[2px]"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedSrc}
          alt={alt}
          draggable={false}
          onError={() => setImgFailed(true)}
          className="relative z-10 h-full w-auto max-w-full object-contain drop-shadow-[0_14px_22px_rgba(20,23,31,0.18)]"
        />
      </div>
    );
  }

  return (
    <ScooterStudioRender
      variant={variant}
      className={`${className} ${dimmed ? 'opacity-40 grayscale' : ''}`}
    />
  );
}

/**
 * High-detail studio profile render of each Bali scooter model
 * (Metallic paint gradients, alloy wheels, brake discs, twin shocks, LED DRLs, and floor shadow)
 */
export function ScooterStudioRender({
  variant,
  className = '',
}: {
  variant: CategoryId;
  className?: string;
}) {
  const palettes: Record<
    CategoryId,
    {
      bodyTop: string;
      bodyMid: string;
      bodyDark: string;
      accent: string;
      trim: string;
      seat: string;
      caliper: string;
    }
  > = {
    // Yamaha NMAX 155 — Volvo EX30 Vapour Grey / Metallic Silver
    nmax: {
      bodyTop: '#D6DADE',
      bodyMid: '#9EA6B0',
      bodyDark: '#5A626E',
      accent: '#10B981',
      trim: '#1D212A',
      seat: '#232730',
      caliper: '#10B981',
    },
    // Honda PCX 160 — Pearl Platinum White & Obsidian
    pcx: {
      bodyTop: '#F7F9FA',
      bodyMid: '#CFD5DC',
      bodyDark: '#7C8594',
      accent: '#0EA5E9',
      trim: '#181B22',
      seat: '#1F232B',
      caliper: '#10B981',
    },
    // Honda Scoopy — Retro Cream Ivory & Warm Espresso Seat
    scoopy: {
      bodyTop: '#F5EFE6',
      bodyMid: '#D8CFC2',
      bodyDark: '#8C8275',
      accent: '#10B981',
      trim: '#262930',
      seat: '#5C3A21',
      caliper: '#10B981',
    },
    // Honda Vario 160 — Matte Stealth Charcoal & Emerald Sport
    vario: {
      bodyTop: '#4B5262',
      bodyMid: '#2C313C',
      bodyDark: '#161920',
      accent: '#10B981',
      trim: '#111318',
      seat: '#1E2128',
      caliper: '#10B981',
    },
    // Yamaha Fazzio — Neo-Retro Sage Silver & Mint
    fazzio: {
      bodyTop: '#DCE7E3',
      bodyMid: '#9FB6AE',
      bodyDark: '#5E746C',
      accent: '#10B981',
      trim: '#1F2428',
      seat: '#2B3036',
      caliper: '#10B981',
    },
  };

  const p = palettes[variant] || palettes.nmax;
  const isRetro = variant === 'scoopy' || variant === 'fazzio';
  const isMaxi = variant === 'nmax' || variant === 'pcx';
  const uid = `sc-${variant}`;

  return (
    <svg
      viewBox="0 0 520 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-paint`} x1="120" y1="60" x2="390" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={p.bodyTop} />
          <stop offset="52%" stopColor={p.bodyMid} />
          <stop offset="100%" stopColor={p.bodyDark} />
        </linearGradient>
        <linearGradient id={`${uid}-lower`} x1="140" y1="150" x2="380" y2="235" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2B303B" />
          <stop offset="100%" stopColor="#12151C" />
        </linearGradient>
        <linearGradient id={`${uid}-glass`} x1="330" y1="32" x2="375" y2="115" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14171F" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#14171F" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id={`${uid}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0F131A" stopOpacity="0.38" />
          <stop offset="65%" stopColor="#0F131A" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#0F131A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Studio Floor Contact Shadow */}
      <ellipse cx="262" cy="264" rx="210" ry="16" fill={`url(#${uid}-shadow)`} />
      <ellipse cx="128" cy="262" rx="58" ry="7" fill="#0B0E14" opacity="0.35" />
      <ellipse cx="394" cy="262" rx="58" ry="7" fill="#0B0E14" opacity="0.35" />

      {/* ── REAR WHEEL ASSEMBLY ── */}
      <g>
        {/* Tire */}
        <circle cx="128" cy="208" r="52" fill="#181B22" />
        <circle cx="128" cy="208" r="46" stroke="#2A2F3A" strokeWidth="3" />
        {/* Rim outer lip */}
        <circle cx="128" cy="208" r="35" fill="#12151B" stroke="#8C95A4" strokeWidth="2.5" />
        {/* Brake disc */}
        <circle cx="128" cy="208" r="22" fill="none" stroke="#9CA3AF" strokeWidth="4" strokeDasharray="6 3" />
        {/* 5 Aero Machined Spokes (Volvo EX30 style two-tone) */}
        <path
          d="M128 173 L134 202 L122 202 Z M161 196 L133 206 L137 195 Z M149 236 L129 213 L139 207 Z M107 236 L117 207 L127 213 Z M95 196 L119 195 L123 206 Z"
          fill="#D4D8DF"
        />
        <circle cx="128" cy="208" r="9" fill="#232832" stroke="#D4D8DF" strokeWidth="2" />
      </g>

      {/* ── FRONT WHEEL ASSEMBLY ── */}
      <g>
        {/* Front mudguard */}
        <path
          d="M346 168 C366 146 414 148 432 174 L412 184 C398 168 372 168 356 180 Z"
          fill={`url(#${uid}-paint)`}
        />
        {/* Tire */}
        <circle cx="394" cy="208" r="52" fill="#181B22" />
        <circle cx="394" cy="208" r="46" stroke="#2A2F3A" strokeWidth="3" />
        {/* Rim outer lip */}
        <circle cx="394" cy="208" r="35" fill="#12151B" stroke="#8C95A4" strokeWidth="2.5" />
        {/* Brake disc & Emerald Caliper */}
        <circle cx="394" cy="208" r="24" fill="none" stroke="#B4BCC8" strokeWidth="4.5" strokeDasharray="7 3" />
        <rect x="366" y="186" width="12" height="18" rx="4" transform="rotate(-18 366 186)" fill={p.caliper} />
        {/* 5 Aero Machined Spokes */}
        <path
          d="M394 173 L400 202 L388 202 Z M427 196 L399 206 L403 195 Z M415 236 L395 213 L405 207 Z M373 236 L383 207 L393 213 Z M361 196 L385 195 L389 206 Z"
          fill="#D4D8DF"
        />
        <circle cx="394" cy="208" r="9" fill="#232832" stroke="#D4D8DF" strokeWidth="2" />
      </g>

      {/* ── SWINGARM, CVT CASE & EXHAUST ── */}
      <path
        d="M94 206 C94 194 106 188 124 188 L196 194 C206 196 212 204 210 214 C208 222 198 226 186 226 L112 222 C98 220 94 214 94 206 Z"
        fill="#1F242D"
        stroke="#373E4C"
        strokeWidth="2"
      />
      <circle cx="118" cy="206" r="11" fill="#2D3340" />
      {/* Exhaust muffler */}
      <path d="M138 204 L212 174 L222 186 L144 218 Z" fill="#14171F" />
      <path d="M206 172 L226 165 L230 179 L212 186 Z" fill="#9CA3AF" />
      {/* Rear Twin Shock Absorber */}
      <line x1="132" y1="192" x2="152" y2="144" stroke="#9CA3AF" strokeWidth="6" strokeLinecap="round" />
      <line
        x1="134"
        y1="186"
        x2="150"
        y2="148"
        stroke={p.accent}
        strokeWidth="7"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />

      {/* ── FRONT TELESCOPIC FORK ── */}
      <line x1="352" y1="118" x2="394" y2="208" stroke="#313744" strokeWidth="11" strokeLinecap="round" />
      <line x1="356" y1="124" x2="394" y2="206" stroke="#9EA6B2" strokeWidth="4" strokeLinecap="round" />

      {/* ── MAIN CHASSIS & BODYWORK ── */}
      {isMaxi ? (
        <>
          {/* Maxi Touring Lower Sill & Footboard Tunnel */}
          <path
            d="M148 168 L228 164 L298 188 L368 184 L382 154 L330 148 L272 190 L196 188 L138 168 Z"
            fill={`url(#${uid}-lower)`}
          />
          {/* Rear Tail & Side Fairing */}
          <path
            d="M78 136 C96 122 142 122 186 132 L256 172 L306 170 L344 102 C362 96 388 106 404 128 C410 138 408 150 396 158 L342 188 L234 192 L156 168 L84 148 C76 146 74 140 78 136 Z"
            fill={`url(#${uid}-paint)`}
          />
          {/* Sharp Character Crease Line */}
          <path
            d="M94 140 L188 148 L258 182 L344 176 L392 142"
            stroke="#FFFFFF"
            strokeOpacity="0.55"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Aerodynamic Smoked Windshield */}
          <path
            d="M332 98 C340 66 356 44 378 34 C382 54 378 82 364 104 Z"
            fill={`url(#${uid}-glass)`}
          />
          {/* Sculpted Dual-Level Touring Seat */}
          <path
            d="M102 128 C114 110 156 110 184 124 C206 134 238 136 266 130 C274 128 280 134 276 142 C264 156 226 162 184 150 L106 136 C98 134 98 130 102 128 Z"
            fill={p.seat}
          />
          {/* Seat contrast stitching */}
          <path
            d="M114 128 Q154 118 186 132 T262 136"
            stroke={p.accent}
            strokeWidth="2"
            strokeDasharray="5 3"
          />
        </>
      ) : isRetro ? (
        <>
          {/* Retro Classic Curved Body & Flat Floorboard */}
          <path
            d="M84 156 C82 122 120 112 168 116 L214 174 L302 174 L334 96 C356 94 378 108 386 132 C392 152 382 176 362 188 L202 190 L132 172 L84 156 Z"
            fill={`url(#${uid}-paint)`}
          />
          <path
            d="M188 184 L318 184 L326 194 L182 194 Z"
            fill={`url(#${uid}-lower)`}
          />
          {/* Retro Chrome Trim Strip */}
          <path
            d="M98 148 Q150 136 204 174 L312 174"
            stroke="#FFFFFF"
            strokeOpacity="0.7"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Classic Rounded Leather Seat */}
          <path
            d="M108 118 C122 104 178 104 206 118 C214 122 214 132 202 136 L114 132 C104 130 102 122 108 118 Z"
            fill={p.seat}
          />
          {/* Round Halo LED Headlamp */}
          <circle cx="378" cy="116" r="14" fill="#F8FAFC" stroke={p.trim} strokeWidth="4" />
          <circle cx="378" cy="116" r="9" stroke={p.accent} strokeWidth="2.5" />
        </>
      ) : (
        <>
          {/* Sporty Agile Angular Body (Vario 160) */}
          <path
            d="M76 128 L178 134 L224 180 L304 178 L342 92 L408 126 L362 188 L212 192 L144 166 Z"
            fill={`url(#${uid}-paint)`}
          />
          <path
            d="M192 180 L318 180 L342 192 L186 192 Z"
            fill={`url(#${uid}-lower)`}
          />
          <path
            d="M92 132 L182 142 L236 184 L348 168 L396 130"
            stroke={p.accent}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Sport Stepped Seat */}
          <path
            d="M98 122 C118 108 166 112 204 128 C212 132 210 142 198 144 L98 130 Z"
            fill={p.seat}
          />
        </>
      )}

      {/* ── HANDLEBAR, MIRROR & LED HEADLIGHT / TAILLIGHT ── */}
      {/* Handlebar stem & grip */}
      <path d="M312 82 L344 96 L336 106 L306 90 Z" fill="#181B22" />
      <circle cx="310" cy="84" r="6" fill="#10B981" />
      {/* Side mirror */}
      <line x1="326" y1="84" x2="318" y2="54" stroke="#181B22" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="314" cy="50" rx="12" ry="7" transform="rotate(-12 314 50)" fill="#181B22" />

      {/* Front LED DRL Signature */}
      {!isRetro && (
        <path
          d="M382 116 L404 130 L394 140 L374 126 Z"
          fill="#F8FAFC"
          stroke={p.accent}
          strokeWidth="2"
        />
      )}

      {/* Rear Grab Bar & Taillight */}
      <path d="M78 126 L112 120 L108 128 L76 134 Z" fill="#1F242D" />
      <path d="M74 134 L86 136 L82 144 L72 140 Z" fill="#EF4444" />
    </svg>
  );
}

/** Emerald "• AVAILABLE" / "SOLD OUT" status pill (#10B981 on #D1FAE5 with #065F46 text) */
export function AvailabilityPill({
  available,
  label,
  className = '',
}: {
  available: boolean;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
        available ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-rose-100 text-rose-700'
      } ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${available ? 'bg-[#10B981]' : 'bg-rose-500'}`}
      />
      {label}
    </span>
  );
}

/**
 * Top Bar Pill Step Switcher — styled directly after the "Rent | Buy | Sell"
 * segmented pill tabs in the Volvo EX30 Desktop Showroom reference.
 */
export function StepSwitcher({
  activeStep,
  onChange,
  lang,
  layoutId,
  className = '',
}: {
  activeStep: 1 | 2 | 3;
  onChange: (s: 1 | 2 | 3) => void;
  lang: 'en' | 'id';
  layoutId: string;
  className?: string;
}) {
  const steps: Array<{ id: 1 | 2 | 3; label: string }> = [
    { id: 1, label: lang === 'id' ? '1. Sewa & Unit' : '1. Rent & Unit' },
    { id: 2, label: lang === 'id' ? '2. Verifikasi KYC' : '2. KYC Verification' },
    { id: 3, label: lang === 'id' ? '3. Pembayaran' : '3. Payment' },
  ];
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {steps.map((s) => {
        const active = activeStep === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            className={`relative rounded-2xl px-5 py-2.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              active
                ? 'text-[#14171F]'
                : 'bg-white/75 text-[#4B5563] hover:bg-white hover:text-[#14171F] border border-white/60 shadow-sm'
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-2xl bg-[#D0D4D9] shadow-inner"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10">{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Payment method options shared by desktop + mobile */
export function getPaymentOptions(t: CopyDictionary, lang: 'en' | 'id') {
  const options: Array<{ id: PaymentMethod; title: string; desc: string }> = [
    { id: 'ONLINE', title: t.payOption1Title, desc: t.payOption1Desc },
    {
      id: 'QRIS',
      title: 'QRIS Instant Scan',
      desc:
        lang === 'id'
          ? 'Scan GoPay / OVO / DANA / ShopeePay / m-Banking'
          : 'Scan with GoPay / OVO / DANA / Mobile Banking',
    },
    { id: 'TRANSFER', title: t.payOption2Title, desc: t.payOption2Desc },
    { id: 'COD', title: t.payOption3Title, desc: t.payOption3Sub },
  ];
  return options;
}

export const COUNTRY_CODES = [
  { value: '+61', label: '+61 AUS' },
  { value: '+62', label: '+62 IDN' },
  { value: '+7', label: '+7 RUS' },
  { value: '+1', label: '+1 USA' },
  { value: '+44', label: '+44 GBR' },
  { value: '+33', label: '+33 FRA' },
];

export const NATIONALITIES = [
  'Australia',
  'United Kingdom',
  'Russia',
  'United States',
  'France',
  'Germany',
  'Indonesia',
];

/** Parse ISO date → big calendar-style parts (like "20 Jul" in Image 1) */
export function splitIsoDate(iso: string) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [y, m, d] = (iso || '').split('-').map((p) => parseInt(p, 10));
  if (!y || !m || !d) return { day: '--', month: '---', year: '', weekday: '' };
  const date = new Date(Date.UTC(y, m - 1, d));
  return {
    day: String(d).padStart(2, '0'),
    month: months[m - 1] ?? '',
    year: String(y),
    weekday: days[date.getUTCDay()] ?? '',
  };
}

/** Shift ISO date by n days (used by the calendar chevrons) */
export function shiftIsoDate(iso: string, delta: number) {
  const [y, m, d] = (iso || '').split('-').map((p) => parseInt(p, 10));
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d + delta));
  return date.toISOString().slice(0, 10);
}
