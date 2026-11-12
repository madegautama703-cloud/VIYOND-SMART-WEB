'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gauge,
  HardHat,
  Heart,
  MapPin,
  SlidersHorizontal,
  Star,
  Truck,
  Users,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { DELIVERY_TIME_SLOTS } from '@/config/siteConfig';
import { formatIdr } from '@/lib/priceCalculator';
import type { ShowroomCategory, ShowroomViewModel } from './types';
import { AvailabilityPill, ScooterVisual } from './shared';
import { KycContactFields, KycDocumentGrid, KycProgress, PdpConsent } from './KycPanel';
import {
  BookingSummaryList,
  PaymentMethodList,
  PrimaryStepAction,
  SubmissionFeedback,
} from './PaymentPanel';

const EASE = [0.22, 1, 0.36, 1] as const;

export function MobileShowroom({ vm }: { vm: ShowroomViewModel }) {
  return (
    <div className="min-h-screen bg-[#14171F] text-[#14171F]">
      <AnimatePresence mode="wait" initial={false}>
        {vm.activeStep === 1 ? (
          <motion.div
            key="mobile-step-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <MobileCatalogSheet vm={vm} />
          </motion.div>
        ) : (
          <motion.div
            key="mobile-step-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <MobileDetailSheet vm={vm} />
          </motion.div>
        )}
      </AnimatePresence>

      <MobileStickyBottomBar vm={vm} />
    </div>
  );
}

/* ─────────────────── STEP 1 · NATIVE APP CATALOG SHEET (Image 2 Center/Left) ─────────────────── */

function MobileCatalogSheet({ vm }: { vm: ShowroomViewModel }) {
  const { lang, t } = vm;

  const changeStart = (val: string) => {
    vm.setStartDate(val);
    if (val && vm.endDate && val > vm.endDate) vm.setEndDate(val);
  };

  return (
    <div className="bg-[#14171F]">
      {/* Dark Charcoal Header (#14171F) */}
      <header className="bg-[#14171F] px-5 pb-9 pt-[max(env(safe-area-inset-top),20px)] text-white">
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-[11px] font-medium text-white/55">
              {lang === 'id' ? 'Lokasi' : 'Location'}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[15px] font-semibold tracking-tight">
              <span>Bali, Indonesia</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => vm.setLang(lang === 'en' ? 'id' : 'en')}
              className="h-10 rounded-full border border-white/15 bg-white/5 px-3.5 text-[11px] font-bold uppercase text-white transition-colors hover:bg-white/10 cursor-pointer"
            >
              {lang === 'en' ? 'EN' : 'ID'}
            </button>
            <button
              type="button"
              onClick={vm.openWaChat}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 cursor-pointer"
              aria-label={t.askAiCs}
            >
              <Bell className="h-4 w-4 text-rose-400" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            </button>
          </div>
        </div>

        <h1 className="mt-6 text-[28px] font-semibold leading-[1.12] tracking-tight text-white">
          {lang === 'id' ? 'Cari motor pilihanmu' : 'Search your scooter'}
        </h1>
        <p className="mt-1.5 text-[12px] text-white/60">
          {lang === 'id'
            ? 'Sewa motor dengan pengantaran instan ke hotel Anda'
            : 'Find a scooter hire wherever you are in Bali'}
        </p>

        {/* Capsule Date Search Bar + Circular Filter/Refresh Button (Mirrors Image 2 Search Bar) */}
        <div className="mt-5 flex items-center gap-2.5">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-3 text-[#14171F] shadow-sm">
            <CalendarDays className="h-4 w-4 shrink-0 text-[#6B7280]" />
            <input
              type="date"
              value={vm.startDate}
              onChange={(e) => changeStart(e.target.value)}
              aria-label={t.startDate}
              className="min-w-0 flex-1 bg-transparent text-[12px] font-semibold text-[#14171F] focus:outline-none"
            />
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF]" />
            <input
              type="date"
              value={vm.endDate}
              min={vm.startDate}
              onChange={(e) => vm.setEndDate(e.target.value)}
              aria-label={t.endDate}
              className="min-w-0 flex-1 bg-transparent text-[12px] font-semibold text-[#14171F] focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={vm.refreshInventory}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#14171F] shadow-sm active:scale-95 transition-transform cursor-pointer"
            aria-label={t.checkLiveStockBtn}
          >
            <SlidersHorizontal
              className={`h-4 w-4 ${vm.isSyncingStock ? 'animate-spin text-[#10B981]' : ''}`}
            />
          </button>
        </div>
      </header>

      {/* Curved White Content Sheet (bg-white rounded-t-[32px] -mt-4 p-5) */}
      <main className="relative -mt-4 rounded-t-[32px] bg-white p-5 pb-36 text-[#14171F]">
        {/* Section Header: Nearest to you | VIEW ALL */}
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold tracking-tight text-[#14171F]">
            {lang === 'id' ? 'Terdekat dari lokasi Anda' : 'Nearest to you'}
          </h2>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
            {lang === 'id' ? 'LIHAT SEMUA' : 'VIEW ALL'}
          </span>
        </div>

        {/* Vertical Scooter Cards List */}
        <div className="mt-3.5 space-y-4">
          {vm.categories.map((c, i) => (
            <MobileScooterCard key={c.id} vm={vm} category={c} index={i} />
          ))}
        </div>

        {/* Carousel Indicator Dots (Mirrors the blue/grey indicator dots in Image 2) */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {vm.categories.map((c) => {
            const active = c.id === vm.selectedCategoryId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => vm.setSelectedCategoryId(c.id)}
                aria-label={c.name}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  active ? 'w-6 bg-[#10B981]' : 'w-2 bg-[#D1D5DB]'
                }`}
              />
            );
          })}
        </div>

        {/* Delivery Zone & Hotel Section */}
        <section className="mt-7">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-semibold tracking-tight text-[#14171F]">
              {lang === 'id' ? 'Zona Antar & Hotel' : 'Delivery location'}
            </h2>
            <span className="rounded-full bg-[#D1FAE5] px-2.5 py-0.5 text-[10px] font-bold text-[#065F46]">
              {vm.priceBreakdown.deliveryFee === 0
                ? 'FREE'
                : `+${formatIdr(vm.priceBreakdown.deliveryFee)}`}
            </span>
          </div>

          <div className="mt-3 space-y-2.5 rounded-3xl border border-[#EEF0F2] bg-[#F7F8F9] p-4">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
                {t.deliveryAreaZone}
              </label>
              <select
                value={vm.selectedZone?.code ?? vm.selectedZoneId}
                onChange={(e) => vm.setSelectedZoneId(e.target.value)}
                className="w-full cursor-pointer rounded-2xl bg-white border border-[#E5E7EB] px-3.5 py-3 text-[13px] font-semibold text-[#14171F] focus:outline-none focus:border-[#10B981]"
              >
                {vm.zones.map((z) => (
                  <option key={z.code} value={z.code}>
                    {(lang === 'id' ? z.labelId : z.labelEn) || z.name || z.code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
                {t.hotelVillaRoom}
              </label>
              <div className="flex items-center gap-2 rounded-2xl bg-white border border-[#E5E7EB] px-3.5 py-3">
                <MapPin className="h-4 w-4 shrink-0 text-[#10B981]" />
                <input
                  type="text"
                  value={vm.hotelAndRoom}
                  onChange={(e) => vm.setHotelAndRoom(e.target.value)}
                  placeholder={t.hotelVillaRoom}
                  className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#14171F] placeholder:text-[#9CA3AF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
                {t.preferredDeliveryTime}
              </label>
              <select
                value={vm.deliveryTime}
                onChange={(e) => vm.setDeliveryTime(e.target.value)}
                className="w-full cursor-pointer rounded-2xl bg-white border border-[#E5E7EB] px-3.5 py-3 text-[13px] font-semibold text-[#14171F] focus:outline-none focus:border-[#10B981]"
              >
                {DELIVERY_TIME_SLOTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {lang === 'id' ? s.labelId : s.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function MobileScooterCard({
  vm,
  category: c,
  index,
}: {
  vm: ShowroomViewModel;
  category: ShowroomCategory;
  index: number;
}) {
  const { lang, t } = vm;
  const selected = c.id === vm.selectedCategoryId;
  const specs = (lang === 'id' ? c.specsId : c.specsEn).split(' · ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.32, ease: EASE }}
      onClick={() => vm.setSelectedCategoryId(c.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') vm.setSelectedCategoryId(c.id);
      }}
      className={`overflow-hidden rounded-3xl border bg-white p-3.5 text-left transition-all cursor-pointer ${
        selected
          ? 'border-[#10B981] ring-2 ring-[#10B981]/20 shadow-[0_14px_34px_-16px_rgba(16,185,129,0.5)]'
          : 'border-[#EEF0F2] shadow-sm'
      }`}
    >
      {/* Grey Stage Container with • AVAILABLE badge & Heart Circle (Mirrors BMW M4 card in Image 2) */}
      <div className="relative rounded-2xl bg-[#F4F5F6] px-3.5 pb-2 pt-3.5">
        <div className="flex items-center justify-between">
          <AvailabilityPill
            available={c.isAvailable}
            label={c.isAvailable ? `AVAILABLE (${c.availableUnits})` : t.soldOut}
          />
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              selected
                ? 'border-[#10B981] bg-[#10B981] text-white'
                : 'border-[#E5E7EB] bg-white text-[#14171F]'
            }`}
          >
            <Heart className={`h-4 w-4 ${selected ? 'fill-white' : ''}`} />
          </span>
        </div>

        <div className="my-1 flex h-40 items-center justify-center">
          <ScooterVisual
            imageFile={c.imageFile}
            variant={c.id}
            alt={c.name}
            dimmed={!c.isAvailable}
            className="h-full w-auto max-w-[88%]"
          />
        </div>
      </div>

      {/* Scooter Name, Distance/Stock & Daily Rate */}
      <div className="mt-3.5 px-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate text-[17px] font-semibold tracking-tight text-[#14171F]">
            {c.name}
          </h3>
          <div className="shrink-0 text-right">
            <span className="text-[18px] font-bold text-[#14171F]">
              Rp {c.dailyPrice / 1000}k
            </span>
            <span className="text-[11px] font-medium text-[#6B7280]">
              /{lang === 'id' ? 'hari' : 'day'}
            </span>
          </div>
        </div>

        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#6B7280]">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#6B7280]" />
          <span>
            {c.isAvailable
              ? `${c.availableUnits} ${lang === 'id' ? 'unit siap diantar ke hotel' : 'units ready near your hotel'}`
              : t.allUnitsRented}
          </span>
        </div>

        {/* Bordered Spec Pills (Mirrors "2 seats | Automatic | Coupe | 230 HP | ★ 4.5" in Image 2) */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] px-2.5 py-1 text-[11px] font-medium text-[#374151]">
            <Users className="h-3 w-3 text-[#6B7280]" />
            2 Riders
          </span>
          {specs.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] px-2.5 py-1 text-[11px] font-medium text-[#374151]"
            >
              <Gauge className="h-3 w-3 text-[#6B7280]" />
              {s}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] px-2.5 py-1 text-[11px] font-medium text-[#374151]">
            <Star className="h-3 w-3 text-[#14171F]" />
            4.9
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────── STEP 2 & 3 · DETAIL & CHECKOUT SHEET (Image 2 Right Phone) ─────────────────── */

function MobileDetailSheet({ vm }: { vm: ShowroomViewModel }) {
  const { lang, t, selectedCategory: c, activeStep } = vm;
  const idx = vm.categories.findIndex((x) => x.id === c.id);
  const cycle = (dir: 1 | -1) => {
    const next = vm.categories[(idx + dir + vm.categories.length) % vm.categories.length];
    if (next) vm.setSelectedCategoryId(next.id);
  };

  const specBoxes = [
    {
      label: lang === 'id' ? 'Kapasitas' : 'Capacity',
      value: '2 Riders',
      icon: Users,
    },
    {
      label: lang === 'id' ? 'Transmisi' : 'Transmission',
      value: 'Automatic',
      icon: Gauge,
    },
    {
      label: lang === 'id' ? 'Tipe' : 'Type',
      value: c.segment === 'maxi' ? 'Maxi Cruiser' : 'Compact City',
      icon: ShieldCheck,
    },
    {
      label: lang === 'id' ? 'Durasi' : 'Duration',
      value: `${vm.rentalDays} ${t.daysUnit}`,
      icon: CalendarDays,
    },
    {
      label: lang === 'id' ? 'Fasilitas' : 'Helmets',
      value: '2 SNI + Holder',
      icon: HardHat,
    },
    {
      label: lang === 'id' ? 'Pengantaran' : 'Delivery',
      value: vm.selectedZone?.code ?? 'ZONA-2',
      icon: Truck,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F6] text-[#14171F]">
      {/* Clean Light Header: Back (<) | "Scooter details" | Language */}
      <header className="flex items-center justify-between px-5 pb-2 pt-[max(env(safe-area-inset-top),20px)]">
        <button
          type="button"
          onClick={() => vm.goToStep((activeStep - 1) as 1 | 2)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#14171F] shadow-xs cursor-pointer"
          aria-label="Back"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="text-center">
          <div className="text-[16px] font-semibold tracking-tight text-[#14171F]">
            {activeStep === 2
              ? lang === 'id'
                ? 'Detail & KYC'
                : 'Scooter details'
              : lang === 'id'
              ? 'Konfirmasi & Bayar'
              : 'Payment & summary'}
          </div>
        </div>

        <button
          type="button"
          onClick={() => vm.setLang(lang === 'en' ? 'id' : 'en')}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[11px] font-bold uppercase text-[#14171F] shadow-xs cursor-pointer"
        >
          {lang}
        </button>
      </header>

      {/* 360° Studio Stage with Left/Right Chevrons & Orbit Arc (Mirrors Mercedes S 500 Stage in Image 2) */}
      <div className="relative flex h-[205px] items-center justify-center px-8">
        <button
          type="button"
          onClick={() => cycle(-1)}
          className="absolute left-4 z-20 flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280] hover:bg-white cursor-pointer"
          aria-label="Previous scooter"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* 360° Orbit Ring + Center Pill */}
        <div className="pointer-events-none absolute bottom-5 left-1/2 h-14 w-[76%] -translate-x-1/2 rounded-[100%] border-b border-[#D1D5DB]" />
        <div className="pointer-events-none absolute bottom-2 left-1/2 z-20 flex h-6 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-white border border-[#E5E7EB] text-[10px] font-bold text-[#14171F] shadow-xs">
          ↔
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -36 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="relative z-10 flex h-full items-center justify-center"
          >
            <ScooterVisual
              imageFile={c.imageFile}
              variant={c.id}
              alt={c.name}
              dimmed={!c.isAvailable}
              className="h-[168px] w-auto max-w-full"
            />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => cycle(1)}
          className="absolute right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280] hover:bg-white cursor-pointer"
          aria-label="Next scooter"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Curved White Detail Sheet (Mirrors Mercedes S 500 Sheet in Image 2) */}
      <main className="rounded-t-[32px] bg-white p-5 pb-36 shadow-[0_-10px_30px_-20px_rgba(20,23,31,0.2)]">
        {/* Title + Star Rating + Heart Button */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-[#14171F]">
              {c.name}
            </h1>
            <div className="mt-1 flex items-center gap-1.5 text-[12px] text-[#6B7280]">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-[#14171F]">4.9</span>
              <span>(254 reviews)</span>
            </div>
          </div>

          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#14171F]">
            <Heart className="h-4 w-4" />
          </span>
        </div>

        {/* Soft Highlight Banner with Lightning Icon (Mirrors Image 2 Right Screen) */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#EEF1F8] p-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DCE3F5] text-[#14171F]">
            <Zap className="h-4 w-4 fill-[#14171F]" />
          </span>
          <p className="text-[12px] leading-snug text-[#374151]">
            {lang === 'id'
              ? 'Unit ini dalam kondisi prima. Selesaikan verifikasi KYC instan untuk mengunci unit ke hotel Anda.'
              : 'This scooter is in great condition, secure it immediately for your Bali trip.'}
          </p>
        </div>

        {/* 6-Tile Spec Grid (3x2 — Mirrors Capacity / Transmission / Type / Engine / Speed / Fuel) */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {specBoxes.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-[#EEF0F2] p-2.5">
              <div className="text-[10px] text-[#9CA3AF]">{label}</div>
              <div className="mt-1 flex items-center gap-1.5 truncate text-[12px] font-semibold text-[#14171F]">
                <Icon className="h-3.5 w-3.5 shrink-0 text-[#6B7280]" />
                <span className="truncate">{value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Step Switcher Pills (Step 2 KYC vs Step 3 Payment) */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-semibold tracking-tight text-[#14171F]">
              {activeStep === 2
                ? lang === 'id'
                  ? 'Verifikasi Identitas (KYC)'
                  : 'Identity KYC Verification'
                : lang === 'id'
                ? 'Rencana & Pembayaran'
                : 'Plans & Payment'}
            </h2>
            <div className="inline-flex rounded-full bg-[#F4F5F6] p-1">
              <button
                type="button"
                onClick={() => vm.goToStep(2)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold cursor-pointer ${
                  activeStep === 2 ? 'bg-[#14171F] text-white' : 'text-[#6B7280]'
                }`}
              >
                2. KYC
              </button>
              <button
                type="button"
                onClick={() => vm.goToStep(3)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold cursor-pointer ${
                  activeStep === 3 ? 'bg-[#14171F] text-white' : 'text-[#6B7280]'
                }`}
              >
                3. Pay
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeStep === 2 ? (
              <motion.div
                key="mobile-kyc-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                className="mt-4 space-y-5"
              >
                <KycContactFields vm={vm} />
                <KycProgress vm={vm} />
                <KycDocumentGrid vm={vm} columns={2} />
                <PdpConsent vm={vm} />
                <SubmissionFeedback vm={vm} />
              </motion.div>
            ) : (
              <motion.div
                key="mobile-payment-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                className="mt-4 space-y-5"
              >
                <div className="rounded-2xl border border-[#EEF0F2] bg-[#F7F8F9] p-4">
                  <BookingSummaryList vm={vm} />
                </div>
                <div>
                  <div className="mb-2.5 text-[14px] font-semibold text-[#14171F]">
                    {t.selectPaymentMethod}
                  </div>
                  <PaymentMethodList vm={vm} />
                </div>
                <SubmissionFeedback vm={vm} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ───────────────────────────── STICKY BOTTOM BAR ───────────────────────────── */

function MobileStickyBottomBar({ vm }: { vm: ShowroomViewModel }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#EEF0F2] bg-white/95 px-5 pb-[max(env(safe-area-inset-bottom),14px)] pt-3 backdrop-blur-md shadow-[0_-8px_24px_rgba(20,23,31,0.06)]">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#6B7280]">
            <span>{vm.t.totalEstimate}</span>
            <span>·</span>
            <span className="font-semibold text-[#065F46]">
              {vm.rentalDays} {vm.t.daysUnit.toLowerCase()}
            </span>
          </div>
          <motion.div
            key={vm.priceBreakdown.totalAmount}
            initial={{ opacity: 0.4, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="truncate text-[20px] font-bold tracking-tight text-[#14171F]"
          >
            {formatIdr(vm.priceBreakdown.totalAmount)}
          </motion.div>
        </div>

        <PrimaryStepAction vm={vm} className="shrink-0 px-5 py-3 text-[13px]" />
      </div>
    </div>
  );
}
