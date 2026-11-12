'use client';

import React, { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  RefreshCw,
  Send,
  Boxes,
  Truck,
  ScanFace,
  Wallet,
  Sparkles,
  CalendarDays,
  Camera,
  Paperclip,
  Zap,
  Lock,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { DELIVERY_TIME_SLOTS } from '@/config/siteConfig';
import { formatIdr } from '@/lib/priceCalculator';
import type { ShowroomViewModel } from './types';
import {
  AvailabilityPill,
  BENTO_CARD,
  ScooterVisual,
  StepSwitcher,
  shiftIsoDate,
  splitIsoDate,
} from './shared';
import { KycContactFields, KycDocumentGrid, KycProgress, PdpConsent } from './KycPanel';
import {
  BookingSummaryList,
  PaymentMethodList,
  PrimaryStepAction,
  SubmissionFeedback,
} from './PaymentPanel';

const EASE = [0.22, 1, 0.36, 1] as const;

export function DesktopShowroom({ vm }: { vm: ShowroomViewModel }) {
  const { t, lang, selectedCategory, activeStep } = vm;
  const specs = (lang === 'id' ? selectedCategory.specsId : selectedCategory.specsEn).split(' · ');

  const currentIdx = vm.categories.findIndex((c) => c.id === vm.selectedCategoryId);
  const cycleScooter = (dir: -1 | 1) => {
    const nextIdx = (currentIdx + dir + vm.categories.length) % vm.categories.length;
    const nextCat = vm.categories[nextIdx];
    if (nextCat) vm.setSelectedCategoryId(nextCat.id);
  };

  return (
    <div className="min-h-screen bg-[#E6E8EA] text-[#14171F] selection:bg-[#10B981] selection:text-white">
      <div className="mx-auto max-w-[1440px] px-8 py-6 xl:px-12">
        {/* ── STEP SWITCHER BAR (Centered Pill Step Switcher Only) ─────────── */}
        <div className="flex items-center justify-center">
          <StepSwitcher
            activeStep={activeStep}
            onChange={vm.goToStep}
            lang={lang}
            layoutId="desktop-step-pill"
          />
        </div>

        {/* ── CENTER SHOWROOM STAGE (Mirrors Volvo EX30 Stage + Floating Right Panel) ── */}
        <section className="relative mt-7 grid grid-cols-12 items-start gap-6">
          {/* Left + Center Showroom Stage (8 cols) */}
          <div className="relative col-span-8 min-h-[450px]">
            <div className="flex items-start gap-6">
              {/* Left Vertical Control Rail (Back button + 3-icon pill stack like Image 1) */}
              <div className="flex flex-col items-center gap-4 pt-1 shrink-0">
                <button
                  type="button"
                  onClick={() => cycleScooter(-1)}
                  title={lang === 'id' ? 'Motor Sebelumnya' : 'Previous Scooter'}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 text-[#14171F] shadow-sm transition-all hover:bg-white cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <div className="mt-4 flex flex-col gap-1.5 rounded-2xl bg-white/65 backdrop-blur-md p-1.5 border border-white/60 shadow-sm">
                  <RailIconButton
                    active={activeStep === 2}
                    onClick={() => vm.goToStep(2)}
                    label={lang === 'id' ? 'Verifikasi KYC' : 'Identity KYC Verification'}
                  >
                    <Lock className="h-4 w-4" />
                  </RailIconButton>
                  <RailIconButton
                    active={activeStep === 1}
                    onClick={() => vm.goToStep(1)}
                    label={lang === 'id' ? 'Katalog & Spesifikasi' : 'Fleet Specs & Dates'}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </RailIconButton>
                  <RailIconButton
                    active={false}
                    onClick={vm.openWaChat}
                    label={t.askAiCs}
                  >
                    <Sparkles className="h-4 w-4" />
                  </RailIconButton>
                </div>
              </div>

              {/* Showroom Headline, Specs Subtitle, and L-R-F-B Style Scooter Selector */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedCategory.id + '-heading'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, ease: EASE }}
                    >
                      <h1 className="text-[48px] xl:text-[54px] font-normal leading-[1.04] tracking-[-0.025em] text-[#14171F]">
                        {selectedCategory.name}
                      </h1>
                      <p className="mt-1.5 text-[14px] text-[#6B7280]">{specs.join(' · ')}</p>
                    </motion.div>
                  </AnimatePresence>

                  <AvailabilityPill
                    available={selectedCategory.isAvailable}
                    label={
                      selectedCategory.isAvailable
                        ? `• AVAILABLE (${selectedCategory.availableUnits} ${t.readySuffix})`
                        : t.soldOut
                    }
                  />
                </div>

                {/* Scooter Model Selector Pill Bar (Mirrors the green-circle "L R F B" bar in Image 1) */}
                <div className="mt-5 inline-flex flex-wrap items-center gap-1.5 rounded-full bg-white/70 backdrop-blur-md p-1.5 border border-white/60 shadow-sm">
                  {vm.categories.map((c) => {
                    const active = c.id === vm.selectedCategoryId;
                    const shortLabel = c.shortName.replace(/^(Yamaha|Honda)\s+/i, '');
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => vm.setSelectedCategoryId(c.id)}
                        className={`relative rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors cursor-pointer ${
                          active
                            ? 'text-white'
                            : 'text-[#14171F]/75 hover:text-[#14171F]'
                        } ${!c.isAvailable ? 'opacity-50' : ''}`}
                      >
                        {active && (
                          <motion.span
                            layoutId="showroom-scooter-selector"
                            className="absolute inset-0 rounded-full bg-[#10B981] shadow-sm"
                            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                          />
                        )}
                        <span className="relative z-10">{shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Center Transparent Scooter Stage with Framer Motion Transition */}
            <div className="relative mt-1 flex h-[340px] items-center justify-center pl-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory.id}
                  initial={{ opacity: 0, x: 70, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -70, scale: 0.95 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="relative z-10 flex h-full w-full items-center justify-center"
                >
                  <ScooterVisual
                    imageFile={selectedCategory.imageFile}
                    variant={selectedCategory.id}
                    alt={selectedCategory.name}
                    dimmed={!selectedCategory.isAvailable}
                    className="h-full max-h-[325px] w-auto max-w-[580px]"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Daily & Weekly Rate Badge anchored subtly on bottom-left of stage */}
              <div className="absolute bottom-2 left-16 z-20 flex items-baseline gap-2 rounded-2xl bg-white/75 backdrop-blur-md px-4 py-2 border border-white/60 shadow-sm">
                <span className="text-[22px] font-bold tracking-tight text-[#14171F]">
                  {formatIdr(selectedCategory.dailyPrice)}
                </span>
                <span className="text-[12px] text-[#6B7280]">
                  / {lang === 'id' ? 'hari' : 'day'} · {lang === 'id' ? 'Mingguan' : 'Weekly'}{' '}
                  {formatIdr(selectedCategory.weeklyPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* ── FLOATING RIGHT PANEL + FAR-RIGHT ICON RAIL (4 cols) ─────────── */}
          <aside className="col-span-4 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {activeStep === 1 && (
                  <motion.div
                    key="step1-assistant"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <FloatingAssistantPanel vm={vm} />
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="step2-kyc-drawer"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className={BENTO_CARD}
                  >
                    <KycDrawer vm={vm} />
                  </motion.div>
                )}

                {activeStep === 3 && (
                  <motion.div
                    key="step3-payment-drawer"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className={BENTO_CARD}
                  >
                    <PaymentDrawer vm={vm} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Far-Right Vertical Icon Rail (Mirrors the right 3-button rail in Image 1) */}
            <div className="mt-24 hidden xl:flex flex-col gap-1.5 rounded-2xl bg-white/65 backdrop-blur-md p-1.5 border border-white/60 shadow-sm shrink-0">
              <RailIconButton
                active={activeStep === 3}
                onClick={() => vm.goToStep(3)}
                label={lang === 'id' ? 'Pembayaran Instan' : 'Instant Payment'}
              >
                <Zap className="h-4 w-4" />
              </RailIconButton>
              <RailIconButton
                active={false}
                onClick={() => {
                  vm.goToStep(2);
                  vm.openCamera('passport');
                }}
                label={lang === 'id' ? 'Scan Paspor / KTP' : 'Scan Passport / ID'}
              >
                <Camera className="h-4 w-4" />
              </RailIconButton>
              <RailIconButton
                active={vm.isSyncingStock}
                onClick={vm.refreshInventory}
                label={lang === 'id' ? 'Sinkronisasi Stok' : 'Sync Live Stock'}
              >
                <RefreshCw className={`h-4 w-4 ${vm.isSyncingStock ? 'animate-spin' : ''}`} />
              </RailIconButton>
            </div>
          </aside>
        </section>

        {/* ── BOTTOM 3-BENTO GRID (Mirrors My Location | My Dates | Payment Method) ── */}
        <section className="mt-6 grid grid-cols-3 gap-6 pb-8">
          <LocationBento vm={vm} />
          <DatesBento vm={vm} />
          <PaymentBento vm={vm} />
        </section>
      </div>
    </div>
  );
}

function RailIconButton({
  children,
  onClick,
  label,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all cursor-pointer ${
        active
          ? 'bg-[#D0D4D9] text-[#14171F] shadow-inner'
          : 'text-[#4B5563] hover:bg-white hover:text-[#14171F]'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Floating Right Panel (Step 1) — Mirrors the "AI Assistant" card + prompt composer
 * from the Volvo EX30 Desktop Showroom reference image.
 */
function FloatingAssistantPanel({ vm }: { vm: ShowroomViewModel }) {
  const { lang, selectedCategory, selectedZone, priceBreakdown, t } = vm;

  const summaryCards = [
    {
      icon: Boxes,
      title: 'Live Stock',
      sub: selectedCategory.isAvailable
        ? `${selectedCategory.availableUnits} ${lang === 'id' ? 'Unit Tersedia' : 'Units Ready'}`
        : t.soldOut,
      active: true,
      onClick: vm.refreshInventory,
    },
    {
      icon: Truck,
      title: 'Zone Delivery',
      sub: `${selectedZone?.code ?? 'ZONA-2'} · ${
        priceBreakdown.deliveryFee === 0 ? 'Free' : `Rp ${priceBreakdown.deliveryFee / 1000}k`
      }`,
      active: false,
      onClick: () => {
        const el = document.getElementById('bento-location-input');
        el?.focus();
      },
    },
    {
      icon: ScanFace,
      title: 'Instant AI KYC',
      sub: `${vm.validatedDocCount}/4 ${lang === 'id' ? 'Dokumen' : 'Verified'}`,
      active: false,
      onClick: () => vm.goToStep(2),
    },
    {
      icon: Wallet,
      title: 'Total Price',
      sub: formatIdr(priceBreakdown.totalAmount),
      active: false,
      onClick: () => vm.goToStep(3),
    },
  ];

  return (
    <div className="space-y-3">
      {/* Top Card: AI Assistant + 4 Feature Summary Tiles */}
      <div className={BENTO_CARD}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="text-[15px] font-semibold text-[#14171F]">AI Assistant</div>
            <div className="mt-0.5 text-[11px] text-[#6B7280]">
              {lang === 'id' ? 'Bagaimana kami bisa membantu sewa Anda?' : 'How can I help you?'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => vm.goToStep(2)}
            title={lang === 'id' ? 'Buka Form KYC' : 'Open KYC Drawer'}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4F5F6] text-[#14171F] hover:bg-[#E5E7EB] transition-colors cursor-pointer"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {/* 2x2 Feature Summary Grid (Live Stock, Zone Delivery, Instant AI KYC, Total Price) */}
        <div className="grid grid-cols-2 gap-2.5">
          {summaryCards.map(({ icon: Icon, title, sub, active, onClick }) => (
            <button
              key={title}
              type="button"
              onClick={onClick}
              className={`group rounded-2xl p-3.5 text-left transition-all cursor-pointer ${
                active
                  ? 'bg-white shadow-sm border border-[#EEF0F2]'
                  : 'bg-[#F4F5F6]/90 hover:bg-white border border-transparent hover:border-[#EEF0F2]'
              }`}
            >
              <div className="flex items-center gap-2 text-[13px] font-semibold text-[#14171F]">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#14171F] text-white group-hover:bg-[#10B981] transition-colors">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="truncate">{title}</span>
              </div>
              <div className="mt-1.5 truncate pl-8 text-[11px] font-medium text-[#6B7280]">
                {sub}
              </div>
            </button>
          ))}
        </div>

        {/* Centralized Price Summary, KYC Status & Primary Action Button */}
        <div className="mt-4 rounded-2xl bg-[#F4F5F6] p-4 border border-[#EEF0F2]">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-[11px] font-medium text-[#6B7280]">{t.totalEstimate}</div>
              <div className="text-[22px] font-bold tracking-tight text-[#14171F]">
                {formatIdr(priceBreakdown.totalAmount)}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D1FAE5] px-2.5 py-1 text-[11px] font-bold text-[#065F46]">
                <ScanFace className="h-3.5 w-3.5 text-[#10B981]" />
                {vm.validatedDocCount === 4
                  ? (lang === 'id' ? '4/4 KYC Lengkap' : '4/4 KYC Verified')
                  : `${vm.validatedDocCount}/4 ${lang === 'id' ? 'KYC Terisi' : 'KYC Verified'}`}
              </span>
              <div className="mt-0.5 text-[11px] font-semibold text-[#6B7280]">
                ≈ ${priceBreakdown.approxUsd} USD
              </div>
            </div>
          </div>

          <div className="mt-3.5">
            <button
              type="button"
              onClick={() => vm.goToStep(2)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10B981] px-5 py-3.5 text-[14px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(16,185,129,0.8)] transition-all hover:bg-[#0EA472] cursor-pointer"
            >
              <span>{lang === 'id' ? 'Buka Verifikasi KYC (Step 2) →' : 'Open KYC Verification (Step 2) →'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Card: Prompt Composer ("Arrange to rent this scooter for 10am" + Send) */}
      <form
        onSubmit={(e) => {
          vm.handleSendWaChat(e);
          vm.openWaChat();
        }}
        className="bg-white/90 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-white/50"
      >
        <input
          type="text"
          value={vm.waChatInput}
          onChange={(e) => vm.setWaChatInput(e.target.value)}
          placeholder={
            lang === 'id'
              ? `Siapkan sewa ${selectedCategory.shortName} untuk jam 10 pagi`
              : `Arrange to rent this ${selectedCategory.shortName} for 10am`
          }
          className="w-full bg-transparent px-1 py-1 text-[13px] font-medium text-[#14171F] placeholder:text-[#4B5563] focus:outline-none"
        />
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={vm.openWaChat}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4F5F6] text-[#14171F] hover:bg-[#E5E7EB] cursor-pointer"
              title={t.askAiCs}
            >
              <Sparkles className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                vm.goToStep(2);
                vm.openFilePicker('passport');
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4F5F6] text-[#14171F] hover:bg-[#E5E7EB] cursor-pointer"
              title={lang === 'id' ? 'Unggah Dokumen KYC' : 'Upload KYC Document'}
            >
              <Paperclip className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                vm.goToStep(2);
                vm.openCamera('passport');
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4F5F6] text-[#14171F] hover:bg-[#E5E7EB] cursor-pointer"
              title={lang === 'id' ? 'Kamera KYC' : 'Camera KYC'}
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#10B981] px-4 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-[#0EA472] transition-colors cursor-pointer"
          >
            <span>Send</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}

/** Step 2 Drawer inside Floating Right Panel */
function KycDrawer({ vm }: { vm: ShowroomViewModel }) {
  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-semibold text-[#14171F]">
            {vm.t.instantVerificationTitle}
          </div>
          <div className="mt-0.5 text-[11px] text-[#6B7280]">{vm.t.instantVerificationSub}</div>
        </div>
        <button
          type="button"
          onClick={() => vm.goToStep(1)}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F4F5F6] text-[#14171F] hover:bg-[#E5E7EB] cursor-pointer"
          aria-label="Close KYC drawer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="-mr-2 max-h-[430px] space-y-4 overflow-y-auto pr-2">
        <KycContactFields vm={vm} />
        <KycProgress vm={vm} />
        <KycDocumentGrid vm={vm} columns={2} />
        <PdpConsent vm={vm} />
        <SubmissionFeedback vm={vm} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-[#EEF0F2]">
        <div>
          <div className="text-[11px] font-medium text-[#6B7280]">{vm.t.totalEstimate}</div>
          <div className="text-[20px] font-bold tracking-tight text-[#14171F]">
            {formatIdr(vm.priceBreakdown.totalAmount)}
          </div>
        </div>
        <PrimaryStepAction vm={vm} className="px-6 py-3 text-[13px]" />
      </div>
    </div>
  );
}

/** Step 3 Drawer inside Floating Right Panel */
function PaymentDrawer({ vm }: { vm: ShowroomViewModel }) {
  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-semibold text-[#14171F]">
            {vm.lang === 'id' ? 'Konfirmasi & Pembayaran' : 'Confirm & Verify Booking'}
          </div>
          <div className="mt-0.5 text-[11px] text-[#6B7280]">{vm.t.step3Header}</div>
        </div>
        <button
          type="button"
          onClick={() => vm.goToStep(2)}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F4F5F6] text-[#14171F] hover:bg-[#E5E7EB] cursor-pointer"
          aria-label="Back to KYC"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <BookingSummaryList vm={vm} />

      <div className="mt-3 flex items-end justify-between rounded-2xl bg-[#F4F5F6] p-3.5">
        <div>
          <div className="text-[11px] text-[#6B7280]">{vm.t.totalEstimate}</div>
          <div className="text-[22px] font-bold tracking-tight text-[#14171F]">
            {formatIdr(vm.priceBreakdown.totalAmount)}
          </div>
        </div>
        <span className="rounded-full bg-[#D1FAE5] px-2.5 py-1 text-[11px] font-bold text-[#065F46]">
          ≈ ${vm.priceBreakdown.approxUsd} USD
        </span>
      </div>

      <div className="mt-3 space-y-3">
        <SubmissionFeedback vm={vm} />
        <PrimaryStepAction vm={vm} className="w-full" />
      </div>
    </div>
  );
}

function BentoHeader({
  title,
  subtitle,
  onAction,
}: {
  title: string;
  subtitle: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-[15px] font-semibold text-[#14171F]">{title}</div>
        <div className="mt-0.5 truncate text-[11px] text-[#6B7280]">{subtitle}</div>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4F5F6] text-[#14171F] hover:bg-[#E5E7EB] transition-colors cursor-pointer"
        aria-label={title}
      >
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/**
 * Bottom Bento Left: Delivery Location & Zone (ZONA_ONGKIR + Hotel Input + Green Map Pin)
 */
function LocationBento({ vm }: { vm: ShowroomViewModel }) {
  const { lang } = vm;
  return (
    <div className={`${BENTO_CARD} flex flex-col justify-between`}>
      <div>
        <BentoHeader
          title={lang === 'id' ? 'Lokasi Pengantaran' : 'My Location'}
          subtitle={vm.hotelAndRoom || 'Canggu, Bali'}
          onAction={() => {
            const el = document.getElementById('bento-location-input');
            el?.focus();
          }}
        />

        <div className="space-y-2">
          <select
            value={vm.selectedZone?.code ?? vm.selectedZoneId}
            onChange={(e) => vm.setSelectedZoneId(e.target.value)}
            aria-label={vm.t.deliveryAreaZone}
            className="w-full cursor-pointer rounded-2xl bg-[#F4F5F6] px-3.5 py-2.5 text-[12px] font-semibold text-[#14171F] focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
          >
            {vm.zones.map((z) => (
              <option key={z.code} value={z.code}>
                {(lang === 'id' ? z.labelId : z.labelEn) || z.name || z.code}
              </option>
            ))}
          </select>

          <input
            id="bento-location-input"
            type="text"
            value={vm.hotelAndRoom}
            onChange={(e) => vm.setHotelAndRoom(e.target.value)}
            placeholder={vm.t.hotelVillaRoom}
            className="w-full rounded-2xl bg-[#F4F5F6] px-3.5 py-2.5 text-[12px] font-medium text-[#14171F] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
          />
        </div>
      </div>

      {/* Minimal Architectural Map with Emerald Green Pin (Mirrors Image 1 Bottom-Left Card) */}
      <div className="relative mt-3 h-[112px] overflow-hidden rounded-2xl bg-[#ECEEF0]">
        {/* Map blocks & white streets */}
        <div className="absolute -left-3 top-3 h-14 w-28 rotate-[-6deg] rounded-xl bg-[#DFE3E6]" />
        <div className="absolute left-24 -top-2 h-36 w-4 rotate-[12deg] bg-white/90" />
        <div className="absolute inset-x-0 top-[58px] h-3.5 -rotate-3 bg-white/90" />
        <div className="absolute right-4 top-2 h-11 w-24 rotate-3 rounded-xl bg-[#DFE3E6]" />
        <div className="absolute bottom-2 left-4 h-9 w-20 rounded-xl bg-[#DFE3E6]" />
        <div className="absolute bottom-2 right-8 h-10 w-24 rounded-xl bg-[#DFE3E6]" />

        {/* Pulsing Emerald Map Pin */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981] shadow-[0_0_0_8px_rgba(16,185,129,0.2)]">
            <MapPin className="h-5 w-5 text-white" />
          </span>
        </motion.div>

        <span className="absolute bottom-2 left-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-[#065F46]">
          {vm.selectedZone?.code} ·{' '}
          {vm.priceBreakdown.deliveryFee === 0
            ? 'Free Delivery'
            : formatIdr(vm.priceBreakdown.deliveryFee)}
        </span>
      </div>
    </div>
  );
}

/**
 * Bottom Bento Center: My Rental Dates (Big Modern Calendar Numbers + Delivery Time like Image 1)
 */
function DatesBento({ vm }: { vm: ShowroomViewModel }) {
  const { lang, t } = vm;
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const changeStart = (val: string) => {
    vm.setStartDate(val);
    if (val && vm.endDate && val > vm.endDate) vm.setEndDate(val);
  };
  const changeEnd = (val: string) => {
    vm.setEndDate(val);
  };

  // Extract time label (e.g. "10:00" and "AM")
  const timeMatch = vm.deliveryTime.match(/^(\d{2}:\d{2})\s*(AM|PM)?/i);
  const timeClock = timeMatch?.[1] || '10:00';
  const timeMeridiem = timeMatch?.[2]?.toUpperCase() || 'WITA';

  const cycleTimeSlot = () => {
    const idx = DELIVERY_TIME_SLOTS.findIndex((s) => s.value === vm.deliveryTime);
    const next = DELIVERY_TIME_SLOTS[(idx + 1) % DELIVERY_TIME_SLOTS.length];
    if (next) vm.setDeliveryTime(next.value);
  };

  return (
    <div className={`${BENTO_CARD} flex flex-col justify-between`}>
      <div>
        <BentoHeader
          title={lang === 'id' ? 'Tanggal Sewa & Jam Antar' : 'My Dates'}
          subtitle={`${vm.formatDisplayDate(vm.startDate)} → ${vm.formatDisplayDate(vm.endDate)} · ${timeClock} ${timeMeridiem}`}
          onAction={() => startRef.current?.showPicker?.()}
        />

        {/* Big Modern Calendar Number Cards (Start Date | Return Date | Delivery Time) */}
        <div className="grid grid-cols-3 gap-2.5">
          <BigCalendarTile
            badge={lang === 'id' ? 'MULAI SEWA' : 'START DATE'}
            iso={vm.startDate}
            inputRef={startRef}
            onShift={(d) => changeStart(shiftIsoDate(vm.startDate, d))}
            onChange={changeStart}
          />
          <BigCalendarTile
            badge={lang === 'id' ? 'SELESAI' : 'RETURN DATE'}
            iso={vm.endDate}
            min={vm.startDate}
            inputRef={endRef}
            onShift={(d) => {
              const next = shiftIsoDate(vm.endDate, d);
              if (next >= vm.startDate) changeEnd(next);
            }}
            onChange={changeEnd}
          />

          {/* Big Clock Tile (like "10:25 AM" in Image 1) */}
          <button
            type="button"
            onClick={cycleTimeSlot}
            title={vm.t.preferredDeliveryTime}
            className="group flex flex-col items-center justify-between rounded-2xl bg-[#F4F5F6] px-2 py-3 text-center hover:bg-[#ECEEF0] transition-colors cursor-pointer border border-white/80 shadow-2xs"
          >
            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">
              <Clock className="h-2.5 w-2.5 text-[#10B981]" />
              {lang === 'id' ? 'JAM ANTAR' : 'DELIVERY'}
            </span>
            <span className="my-1 text-[30px] xl:text-[34px] font-semibold leading-none tracking-tight text-[#14171F] group-hover:text-[#059669] transition-colors">
              {timeClock}
            </span>
            <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-[#065F46] shadow-2xs">
              {timeMeridiem} · WITA
            </span>
          </button>
        </div>

        {/* Interactive Delivery Time Slot Selector Strip */}
        <div className="mt-3 rounded-2xl bg-[#F4F5F6] p-2">
          <div className="mb-1.5 flex items-center justify-between px-1.5 text-[10px] font-semibold text-[#6B7280]">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 text-[#10B981]" />
              {lang === 'id' ? 'Pilih Jam Pengantaran Hotel:' : 'Preferred Hotel Delivery Time:'}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#14171F]">
              {timeClock} {timeMeridiem}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {DELIVERY_TIME_SLOTS.map((slot) => {
              const slotMatch = slot.value.match(/^(\d{2}:\d{2})\s*(AM|PM)?/i);
              const shortLabel = slotMatch ? `${slotMatch[1]} ${slotMatch[2] || ''}`.trim() : slot.value;
              const isSelected = vm.deliveryTime === slot.value;
              return (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => vm.setDeliveryTime(slot.value)}
                  className={`rounded-xl py-1.5 text-[10px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#10B981] text-white shadow-xs'
                      : 'bg-white/80 text-[#4B5563] hover:bg-white hover:text-[#14171F]'
                  }`}
                >
                  {shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tier Pricing & Duration Summary Strip */}
      <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#F4F5F6] px-3.5 py-2.5 text-[11px]">
        <div className="flex items-center gap-2 min-w-0">
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#10B981]" />
          <span className="truncate font-semibold text-[#14171F]">
            {lang === 'id' ? vm.priceBreakdown.tierLabelId : vm.priceBreakdown.tierLabelEn}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-bold text-[#14171F]">
            {formatIdr(vm.priceBreakdown.rentalSubtotal)}
          </span>
          <span className="rounded-full bg-[#D1FAE5] px-2.5 py-0.5 font-bold text-[#065F46]">
            {vm.rentalDays} {t.daysUnit}
          </span>
        </div>
      </div>
    </div>
  );
}

function BigCalendarTile({
  badge,
  iso,
  min,
  inputRef,
  onShift,
  onChange,
}: {
  badge: string;
  iso: string;
  min?: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onShift: (delta: number) => void;
  onChange: (val: string) => void;
}) {
  const p = splitIsoDate(iso);
  return (
    <div className="relative flex flex-col items-center justify-between rounded-2xl bg-[#F4F5F6] px-1.5 py-3 text-center border border-white/80 shadow-2xs">
      <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">{badge}</span>
      <div className="my-1 flex w-full items-center justify-between px-1">
        <button
          type="button"
          onClick={() => onShift(-1)}
          className="flex h-6 w-6 items-center justify-center rounded-full text-[#10B981] hover:bg-white cursor-pointer transition-colors"
          aria-label="Previous day"
        >
          <ChevronLeft className="h-3.5 w-3.5 stroke-[2.5]" />
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.showPicker?.()}
          className="cursor-pointer"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={iso}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.16 }}
              className="text-[36px] xl:text-[40px] font-semibold leading-none tracking-tight text-[#14171F]"
            >
              {p.day}
            </motion.div>
          </AnimatePresence>
        </button>
        <button
          type="button"
          onClick={() => onShift(1)}
          className="flex h-6 w-6 items-center justify-center rounded-full text-[#10B981] hover:bg-white cursor-pointer transition-colors"
          aria-label="Next day"
        >
          <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
        </button>
      </div>
      <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold text-[#4B5563] shadow-2xs">
        {p.month} {p.year}
      </span>
      <input
        ref={inputRef}
        type="date"
        value={iso}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="pointer-events-none absolute bottom-0 left-1/2 h-0 w-0 opacity-0"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * Bottom Bento Right: Payment Method (Purely shows Header + 4 Radio Card Payment Options)
 */
function PaymentBento({ vm }: { vm: ShowroomViewModel }) {
  const { lang } = vm;
  return (
    <div className={`${BENTO_CARD} flex flex-col justify-between`}>
      <div>
        <BentoHeader
          title={lang === 'id' ? 'Metode Pembayaran' : 'Payment Method'}
          subtitle={
            lang === 'id'
              ? vm.priceBreakdown.formulaSummaryId
              : vm.priceBreakdown.formulaSummaryEn
          }
          onAction={() => vm.goToStep(3)}
        />
        <PaymentMethodList vm={vm} />
      </div>

      <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#F4F5F6] px-3.5 py-2.5 text-[11px]">
        <span className="font-medium text-[#6B7280]">
          {lang === 'id' ? 'Metode Pembayaran Dipilih' : 'Selected Payment Method'}
        </span>
        <span className="rounded-full bg-[#D1FAE5] px-2.5 py-0.5 font-bold text-[#065F46]">
          {vm.paymentMethod}
        </span>
      </div>
    </div>
  );
}
