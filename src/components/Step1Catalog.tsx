'use client';

import React, { useState } from 'react';
import GlassHero from '@/components/ui/glass-hero';
import {
  SiteConfig,
  defaultSiteConfig,
  BILINGUAL_COPY,
  VehicleCategory,
  DeliveryZone,
  DELIVERY_TIME_SLOTS,
} from '@/config/siteConfig';
import { ScooterSilhouette } from '@/components/ScooterSilhouette';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowUpRight,
  Menu,
  Plus,
  Minus,
  RefreshCw,
} from 'lucide-react';
import { formatIdr } from '@/lib/priceCalculator';

export interface Step1CatalogProps {
  isBoardView?: boolean;
  siteConfig?: SiteConfig;
  lang?: 'en' | 'id';
  setLang?: (lang: 'en' | 'id') => void;
  setIsUatConsoleOpen?: (open: boolean) => void;
  activeStep?: 1 | 2 | 3;
  setActiveStep?: (step: 1 | 2 | 3) => void;
  startDate?: string;
  setStartDate?: (val: string) => void;
  endDate?: string;
  setEndDate?: (val: string) => void;
  rentalDays?: number;
  formatDisplayDate?: (d: string) => string;
  fetchLiveInventory?: () => void;
  isSyncingStock?: boolean;
  syncSource?: string;
  lastSyncLatencyMs?: number;
  categories?: any[];
  catalogFilter?: 'all' | 'available';
  setCatalogFilter?: (filter: 'all' | 'available') => void;
  maxiUnits?: any[];
  compactUnits?: any[];
  selectedCategoryId?: 'nmax' | 'pcx' | 'scoopy' | 'vario' | 'fazzio';
  setSelectedCategoryId?: (id: 'nmax' | 'pcx' | 'scoopy' | 'vario' | 'fazzio') => void;
  handleToggleCategoryStock?: (
    categoryId: 'nmax' | 'pcx' | 'scoopy' | 'vario' | 'fazzio',
    forceSoldOut?: boolean
  ) => void | Promise<void>;
  zones?: DeliveryZone[];
  selectedZone?: DeliveryZone;
  selectedZoneId?: string;
  setSelectedZoneId?: (id: string) => void;
  hotelAndRoom?: string;
  setHotelAndRoom?: (val: string) => void;
  deliveryTime?: string;
  setDeliveryTime?: (val: string) => void;
  faqOpen?: boolean;
  setFaqOpen?: (open: boolean | ((prev: boolean) => boolean)) => void;
  priceBreakdown?: any;
  selectedCategory?: any;
  setValidationErrors?: React.Dispatch<React.SetStateAction<string[]>>;
  setIsWaModalOpen?: (open: boolean) => void;
}

export const Step1Catalog: React.FC<Step1CatalogProps> = ({
  isBoardView = false,
  siteConfig = defaultSiteConfig,
  lang = 'en',
  setLang,
  setIsUatConsoleOpen,
  activeStep = 1,
  setActiveStep,
  startDate = '2026-05-15',
  setStartDate,
  endDate = '2026-05-22',
  setEndDate,
  rentalDays = 7,
  formatDisplayDate = (d) => d,
  fetchLiveInventory,
  isSyncingStock = false,
  syncSource = 'Production n8n Webhook',
  lastSyncLatencyMs = 38,
  catalogFilter = 'all',
  setCatalogFilter,
  maxiUnits = [],
  compactUnits = [],
  selectedCategoryId = 'nmax',
  setSelectedCategoryId,
  handleToggleCategoryStock,
  zones = [],
  selectedZone,
  selectedZoneId = 'ZONA-1',
  setSelectedZoneId,
  hotelAndRoom = '',
  setHotelAndRoom,
  deliveryTime = '10:00 AM WITA (Morning Delivery)',
  setDeliveryTime,
  faqOpen = false,
  setFaqOpen,
  priceBreakdown = {
    totalAmount: 950000,
    formulaSummaryEn: '7 Days · Weekly Tier Applied',
    formulaSummaryId: '7 Hari · Tarif Mingguan Hemat',
  },
  selectedCategory = { name: 'Yamaha NMAX 155' },
  setValidationErrors,
  setIsWaModalOpen,
}) => {
  const t = BILINGUAL_COPY[lang] || BILINGUAL_COPY.en;

  return (
    <div
      className={`relative overflow-hidden w-full ${
        isBoardView
          ? 'w-full max-w-[420px] mx-auto rounded-[40px] sm:rounded-[48px] border border-blue-300/25 shadow-[0_24px_80px_rgba(15,45,110,0.55)] p-4 sm:p-5'
          : 'w-full max-w-5xl mx-auto rounded-3xl border border-white/15 shadow-2xl p-6 md:p-8'
      } flex flex-col justify-between bg-[#000b29]`}
    >
      {/* BACKGROUND GLASS VIDEO HERO + VIYOND PALETTE (FULL HEIGHT CANVAS WITH BREATHING ANIMATION) */}
      <div
        className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${isBoardView ? 'rounded-[44px]' : 'rounded-3xl'} bg-[#000b29]`}
        style={{ pointerEvents: 'none' }}
      >
        {/* Video Background from 21st.dev playing in loop */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          className="absolute inset-x-0 top-0 w-full h-[540px] sm:h-[620px] object-cover opacity-60 mix-blend-screen pointer-events-none select-none"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4"
            type="video/mp4"
          />
        </video>

        {/* 1. Base Diagonal Gradient (Cyan kiri bawah ke Royal Blue kanan atas) dengan animasi pulsa */}
        <div
          className="pointer-events-none absolute inset-0 opacity-90 animate-aurora-pulse"
          style={{
            pointerEvents: 'none',
            background:
              'linear-gradient(135deg, #5ce1e6 0%, #1597e5 32%, #0f70d7 65%, #000b29 100%)',
          }}
        />

        {/* 2. Top Deep Navy Shadow Vignette (Lengkungan gelap di atas tengah) */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[320px] h-[260px] rounded-full blur-[45px]"
          style={{
            pointerEvents: 'none',
            background:
              'radial-gradient(circle, #00061a 25%, rgba(0,11,41,0.85) 65%, transparent 100%)',
          }}
        />

        {/* 3. Top-Center Intense White & Cyan Flare (Animasi Bernapas Terang & Redup) */}
        <div
          className="pointer-events-none absolute top-[230px] left-[42%] -translate-x-1/2 w-[350px] h-[230px] rounded-full blur-[32px] animate-aurora-breathe"
          style={{
            pointerEvents: 'none',
            background:
              'radial-gradient(circle, #ffffff 0%, #bef8fd 35%, #5ce1e6 65%, transparent 100%)',
          }}
        />

        {/* 4. Mid-Catalog Ambient Royal Blue Flare (Animasi pulsa di area katalog) */}
        <div
          className="pointer-events-none absolute top-[750px] left-[55%] -translate-x-1/2 w-[380px] h-[320px] rounded-full blur-[48px] animate-aurora-pulse"
          style={{
            pointerEvents: 'none',
            background:
              'radial-gradient(circle, #0f70d7 0%, #1597e5 45%, transparent 75%)',
          }}
        />

        {/* 5. Lower-Zone Cyan Accent Flare (Pendaran cyan di area delivery zone & ringkasan harga) */}
        <div
          className="pointer-events-none absolute top-[1350px] left-[40%] -translate-x-1/2 w-[340px] h-[280px] rounded-full blur-[45px] opacity-60"
          style={{
            pointerEvents: 'none',
            background:
              'radial-gradient(circle, #5ce1e6 0%, #0f70d7 50%, transparent 80%)',
          }}
        />

        {/* 6. 21st.dev Vertical Ribbed/Fluted Glass Texture through entire height */}
        <div
          className="pointer-events-none absolute inset-0 opacity-35 mix-blend-overlay"
          style={{
            pointerEvents: 'none',
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.65) 0px, rgba(255,255,255,0.65) 1px, transparent 1px, transparent 9px, rgba(0,11,41,0.4) 9px, rgba(0,11,41,0.4) 12px)',
          }}
        />

        {/* 7. Bottom Shadow Anchor */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[220px]"
          style={{
            pointerEvents: 'none',
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(0,11,41,0.7) 60%, #000b29 100%)',
          }}
        />
      </div>

      {/* Layer Konten (z-20) */}
      <div className="relative z-20 pointer-events-auto bg-transparent flex flex-col justify-between">
        {/* Dynamic Island Notch (Only in Phone / Board View) */}
        {isBoardView && (
          <div className="w-24 h-6 bg-[#02050a] rounded-full mx-auto mb-3 opacity-90" />
        )}

        {/* Top App Bar */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-lg font-black tracking-tighter text-white">
            {siteConfig.brandName}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang && setLang(lang === 'en' ? 'id' : 'en')}
              className="h-9 px-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-xs font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              EN / ID
            </button>
            <button
              onClick={() => setIsUatConsoleOpen && setIsUatConsoleOpen(true)}
              className="w-9 h-9 rounded-full bg-white text-[#071430] hover:bg-blue-50 flex items-center justify-center transition-colors cursor-pointer shadow"
              aria-label="Open UAT & Master DB Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Section & Select Rental Period Card */}
        <div className={isBoardView ? 'mb-4' : 'md:grid md:grid-cols-2 md:gap-8 md:items-center mb-6'}>
          {/* Kolom Kiri: Hero Headline & Subtitle, Trust Signals, Segmented Nav */}
          <div className="flex flex-col justify-between">
            {/* Hero Headline & Subtitle */}
            <div className="mb-4">
              <h2 className="text-[32px] md:text-[38px] leading-[1.08] font-bold tracking-tight text-white text-balance">
                {t.heroTitleLine1}
                <br />
                {t.heroTitleLine2}
              </h2>
              <p className="text-xs md:text-sm text-blue-100/85 mt-2">
                {t.heroSubtitle}
              </p>
            </div>

            {/* Trust Signals Row */}
            <div className="grid grid-cols-3 gap-1.5 mb-3 text-[11px] font-medium text-blue-100">
              <div className="py-2 px-2 rounded-full bg-[#0d224c]/70 border border-blue-300/25 text-center truncate">
                ★ {t.trustGoogle.split(' ')[0]} {t.trustGoogle.split(' ')[1]}
              </div>
              <div className="py-2 px-2 rounded-full bg-[#0d224c]/70 border border-blue-300/25 text-center truncate">
                {t.trustHelmet.split('+')[0]}
              </div>
              <div className="py-2 px-2 rounded-full bg-[#0d224c]/70 border border-blue-300/25 text-center truncate">
                {t.trustInstant.split(' ')[0]} {t.trustInstant.split(' ')[1]}
              </div>
            </div>

            {/* 3-Step Segmented Navigation */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-full bg-[#0d224c]/60 border border-blue-300/25 mb-4 md:mb-0">
              <button
                onClick={() => setActiveStep && setActiveStep(1)}
                className="py-2 px-2 rounded-full bg-white text-[#081530] text-[11px] font-bold truncate cursor-pointer shadow-sm"
              >
                {t.step1Tab}
              </button>
              <button
                onClick={() => setActiveStep && setActiveStep(2)}
                className="py-2 px-2 rounded-full text-blue-100/80 hover:text-white text-[11px] font-medium truncate cursor-pointer"
              >
                {t.step2Tab}
              </button>
              <button
                onClick={() => setActiveStep && setActiveStep(3)}
                className="py-2 px-2 rounded-full text-blue-100/80 hover:text-white text-[11px] font-medium truncate cursor-pointer"
              >
                {t.step3Tab}
              </button>
            </div>
          </div>

          {/* Kolom Kanan: Select Rental Period Card */}
          <div className="rounded-[26px] bg-[#061539]/75 backdrop-blur-xl border border-white/25 shadow-2xl p-4 md:p-5 mb-5 md:mb-0">
            <div className="text-xs font-medium text-blue-100 mb-2.5">
              {t.selectRentalPeriod}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[10px] font-semibold tracking-wider text-blue-200/70 mb-1">
                  {t.startDate}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStartDate && setStartDate(val);
                    if (val && endDate && val > endDate) {
                      setEndDate && setEndDate(val);
                    }
                    setValidationErrors &&
                      setValidationErrors((prev) =>
                        prev.filter((err) => !err.includes('Tanggal'))
                      );
                  }}
                  className="w-full bg-[#0a1b3d]/60 border border-blue-300/25 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-white"
                />
                <div className="text-[10px] text-blue-200/80 mt-1 font-mono">
                  {formatDisplayDate(startDate)}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold tracking-wider text-blue-200/70 mb-1">
                  {t.endDate} ({rentalDays} {t.daysUnit})
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => {
                    setEndDate && setEndDate(e.target.value);
                    setValidationErrors &&
                      setValidationErrors((prev) =>
                        prev.filter((err) => !err.includes('Tanggal'))
                      );
                  }}
                  className="w-full bg-[#0a1b3d]/60 border border-blue-300/25 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-white"
                />
                <div className="text-[10px] text-blue-200/80 mt-1 font-mono">
                  {formatDisplayDate(endDate)}
                </div>
              </div>
            </div>

            {/* Check Live Stock (n8n Sync) Button Row */}
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                onClick={fetchLiveInventory}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {isSyncingStock && (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                )}
                <span>
                  {isSyncingStock ? t.syncingStock : t.checkLiveStockBtn}
                </span>
              </Button>
              <Button
                variant="action"
                size="icon"
                onClick={fetchLiveInventory}
                aria-label="Sync Live Stock"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-2.5 px-1 text-[10px] text-blue-200/70 flex items-center justify-between font-mono">
              <span className="truncate max-w-[240px]">
                {isSyncingStock ? 'Calling n8n...' : syncSource}
              </span>
              <span className="tabular-nums shrink-0">{lastSyncLatencyMs}ms</span>
            </div>
          </div>
        </div>

        {/* Live Fleet Catalog Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold tracking-tight text-white">
            {t.liveFleetCatalog}
          </h3>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCatalogFilter && setCatalogFilter('all')}
              className={`h-8 px-3.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                catalogFilter === 'all'
                  ? 'bg-white text-[#081530]'
                  : 'bg-[#122b5e]/80 text-blue-100 border border-blue-300/30'
              }`}
            >
              {t.allUnits}
            </button>
            <button
              onClick={() =>
                setCatalogFilter &&
                setCatalogFilter(
                  catalogFilter === 'available' ? 'all' : 'available'
                )
              }
              className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                catalogFilter === 'available'
                  ? 'bg-white text-[#081530]'
                  : 'bg-[#122b5e]/80 text-blue-100 border border-blue-300/30'
              }`}
            >
              {t.filters}
            </button>
          </div>
        </div>

        {/* Maxi Units (NMAX & PCX) */}
        <div className={isBoardView ? 'space-y-3.5 mb-3.5' : 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'}>
          {maxiUnits
            .filter((u) =>
              catalogFilter === 'available' ? u.isAvailable : true
            )
            .map((unit) => {
            const isSelected = selectedCategoryId === unit.id;
            if (!unit.isAvailable) {
              // Sold Out Card
              return (
                <div
                  key={unit.id}
                  className="rounded-[26px] bg-[#061539]/75 backdrop-blur-xl border border-white/15 p-4 mb-3.5 text-slate-300 shadow-xl"
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <Badge variant="destructive">● {t.soldOut}</Badge>
                    <span className="font-mono text-slate-400 tabular-nums">
                      Rp {unit.dailyPrice / 1000}k/day
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="text-lg font-bold text-slate-300/80">
                        {unit.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {t.allUnitsRented}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleToggleCategoryStock &&
                        handleToggleCategoryStock(unit.id, false)
                      }
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] font-mono text-blue-200 transition-colors cursor-pointer shrink-0"
                      title="Simulate Telegram /stok command to make READY"
                    >
                      /stok → Set Ready
                    </button>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/10 text-center text-xs text-slate-400 font-medium">
                    {t.unavailableForDates}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={unit.id}
                onClick={() => setSelectedCategoryId && setSelectedCategoryId(unit.id)}
                className={`rounded-[28px] p-4 mb-3.5 border backdrop-blur-xl transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyan-400 shadow-[0_12px_40px_rgba(15,112,215,0.4)] ring-1 ring-cyan-400/50'
                    : 'border-white/20 shadow-lg hover:border-cyan-400/40'
                }`}
                style={{
                  background: isSelected
                    ? 'linear-gradient(145deg, rgba(15,112,215,0.4) 0%, rgba(6,21,57,0.85) 55%, rgba(0,11,41,0.95) 100%)'
                    : 'linear-gradient(145deg, rgba(6,21,57,0.75) 0%, rgba(0,11,41,0.9) 100%)',
                }}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <Badge variant="success">
                    ● {unit.availableUnits} {t.unitsAvailable}
                  </Badge>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    Rp {unit.dailyPrice / 1000}k/day
                  </span>
                </div>

                <ScooterSilhouette variant={unit.id} size="lg" />

                <div className="flex items-end justify-between gap-2 mt-1">
                  <div>
                    <h4 className="text-2xl font-bold tracking-tight text-white">
                      {unit.name}
                    </h4>
                    <p className="text-xs text-blue-100/90 mt-0.5">
                      {lang === 'en' ? unit.specsEn : unit.specsId}
                    </p>
                    <p className="text-[11px] text-blue-200/80 font-mono tabular-nums mt-0.5">
                      Weekly: Rp {unit.weeklyPrice / 1000}k · Monthly: Rp{' '}
                      {(unit.monthlyPrice / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-blue-200/60">
                    [{unit.imageFile}]
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-3.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategoryId && setSelectedCategoryId(unit.id);
                    }}
                    className={`flex-1 h-11 rounded-full text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white text-[#081530]'
                        : 'bg-white/15 text-white hover:bg-white/25'
                    }`}
                  >
                    {isSelected ? t.selectedForBooking : t.selectUnit}
                  </button>
                  <Button
                    variant="action"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategoryId && setSelectedCategoryId(unit.id);
                      setActiveStep && setActiveStep(2);
                    }}
                    aria-label="Select and Continue"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3-Column Compact Fleet (Scoopy, Vario 160, Fazzio) */}
        <div className={`grid ${isBoardView ? 'grid-cols-3 gap-2' : 'grid-cols-3 gap-2 md:gap-4'} mb-4`}>
          {compactUnits.map((unit) => {
            const isSelected = selectedCategoryId === unit.id;
            return (
              <div
                key={unit.id}
                onClick={() =>
                  unit.isAvailable &&
                  setSelectedCategoryId &&
                  setSelectedCategoryId(unit.id)
                }
                className={`rounded-[22px] p-2.5 border backdrop-blur-xl transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#0f70d7]/35 border-cyan-400 shadow-[0_0_20px_rgba(92,225,230,0.3)] ring-1 ring-cyan-400/40'
                    : 'bg-[#061539]/75 border-white/15 hover:border-cyan-400/40 hover:bg-[#061539]/90'
                }`}
              >
                <div className="text-[10px] font-semibold text-emerald-300 truncate">
                  ● {unit.availableUnits} {t.readySuffix}
                </div>

                <ScooterSilhouette variant={unit.id} size="sm" />

                <div>
                  <div className="text-xs font-bold text-white truncate">
                    {unit.shortName}
                  </div>
                  <div className="text-[10px] text-blue-100/80 font-mono tabular-nums">
                    Rp {unit.dailyPrice / 1000}k/day
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (unit.isAvailable && setSelectedCategoryId) {
                        setSelectedCategoryId(unit.id);
                      }
                    }}
                    className={`mt-2 w-full py-1.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#0f70d7] text-white shadow'
                        : 'bg-white text-[#081530] hover:bg-blue-50'
                    }`}
                  >
                    {isSelected ? 'Selected' : t.selectUnit}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Delivery Zone and FAQ in 2 Columns on Desktop */}
        <div className={isBoardView ? 'space-y-3.5 mb-3.5' : 'grid grid-cols-1 md:grid-cols-2 md:gap-6 mb-6'}>
          {/* Delivery Zone and Hotel Details (ZONA_ONGKIR) */}
          <div className="rounded-[28px] bg-[#061539]/75 backdrop-blur-xl border border-white/25 shadow-2xl p-4 text-white">
            <h4 className="text-base font-bold tracking-tight">
              {t.deliveryZoneTitle}
            </h4>
            <p className="text-[11px] text-blue-200/70 mb-3">
              {t.syncedWithTab}
            </p>

            <div className="space-y-2.5">
              {/* Zone Dropdown */}
              <div className="rounded-2xl bg-[#000b29]/75 border border-white/15 px-3.5 py-2.5 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <label className="block text-[9px] font-semibold tracking-wider text-blue-200/70">
                    {t.deliveryAreaZone}
                  </label>
                  <select
                    value={selectedZone?.code || selectedZoneId}
                    onChange={(e) =>
                      setSelectedZoneId && setSelectedZoneId(e.target.value)
                    }
                    className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer truncate mt-0.5"
                  >
                    {zones.map((z) => {
                      const optVal = z.code || z.id || `zone-${z.fee}`;
                      const optLabel =
                        z.name || (lang === 'en' ? z.labelEn : z.labelId) || z.code;
                      return (
                        <option
                          key={optVal}
                          value={optVal}
                          className="bg-[#09152e] text-white"
                        >
                          {optLabel}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-200 shrink-0" />
              </div>
              {(selectedZone?.coverage || selectedZone?.areaNames) && (
                <div className="text-[10px] text-blue-200/80 px-1 font-mono">
                  Coverage:{' '}
                  {(selectedZone?.coverage || selectedZone?.areaNames || '')
                    .split(',')
                    .map((a) => a.trim())
                    .filter(Boolean)
                    .join(' · ')}
                </div>
              )}

              {/* Hotel & Room Input */}
              <div className="rounded-2xl bg-[#000b29]/75 border border-white/15 px-3.5 py-2.5 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <label className="block text-[9px] font-semibold tracking-wider text-blue-200/70">
                    {t.hotelVillaRoom}
                  </label>
                  <input
                    type="text"
                    value={hotelAndRoom}
                    onChange={(e) =>
                      setHotelAndRoom && setHotelAndRoom(e.target.value)
                    }
                    placeholder="e.g. The Haven Suites Canggu — Room 204"
                    className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none mt-0.5"
                  />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-200 shrink-0" />
              </div>

              {/* Preferred Delivery Time */}
              <div className="rounded-2xl bg-[#000b29]/75 border border-white/15 px-3.5 py-2.5 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <label className="block text-[9px] font-semibold tracking-wider text-blue-200/70">
                    {t.preferredDeliveryTime}
                  </label>
                  <select
                    value={deliveryTime}
                    onChange={(e) =>
                      setDeliveryTime && setDeliveryTime(e.target.value)
                    }
                    className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer truncate mt-0.5"
                  >
                    {DELIVERY_TIME_SLOTS.map((slot) => (
                      <option
                        key={slot.value}
                        value={slot.value}
                        className="bg-[#09152e] text-white"
                      >
                        {lang === 'en' ? slot.labelEn : slot.labelId}
                      </option>
                    ))}
                  </select>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-200 shrink-0" />
              </div>
            </div>
          </div>

          {/* Bilingual Rental Terms & FAQ */}
          <div className="rounded-[28px] bg-[#061539]/75 backdrop-blur-xl border border-white/25 shadow-xl p-4 text-white">
            <button
              type="button"
              onClick={() => setFaqOpen && setFaqOpen(!faqOpen)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <span className="text-xs font-semibold text-white/95">
                {t.rentalTermsFaqTitle}
              </span>
              <span className="w-8 h-8 rounded-full bg-white text-[#09152e] flex items-center justify-center shrink-0 shadow-sm">
                {faqOpen ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </span>
            </button>
            {faqOpen && (
              <div className="mt-3 pt-3 border-t border-white/20 space-y-2.5 text-xs">
                {t.termsItems.map((item, idx) => (
                  <div key={idx} className="bg-[#000b29]/80 rounded-xl p-3 border border-white/10">
                    <div className="font-bold text-white">{item.q}</div>
                    <div className="text-blue-100/85 mt-1 leading-relaxed">
                      {item.a}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Price Summary (Kotak Ringkasan Harga Otomatis) */}
        <div className="rounded-[32px] bg-[#061539]/90 backdrop-blur-2xl border border-cyan-400/40 p-4 md:p-6 text-white shadow-[0_12px_45px_rgba(15,112,215,0.4)]">
          <div className={isBoardView ? '' : 'md:flex md:items-center md:justify-between md:gap-8'}>
            <div>
              <div className="text-[11px] text-blue-200/85 font-mono truncate">
                {lang === 'en'
                  ? priceBreakdown.formulaSummaryEn
                  : priceBreakdown.formulaSummaryId}
              </div>
              <div className="text-[11px] text-blue-300/75 mt-0.5">
                {t.totalEstimate} · {selectedCategory?.name}
              </div>
              <div className="flex items-baseline gap-3 mt-0.5 mb-3 md:mb-0">
                <span className="text-3xl md:text-4xl font-extrabold tracking-tight font-mono tabular-nums">
                  {formatIdr(priceBreakdown.totalAmount)}
                </span>
                <span className="text-[11px] text-blue-200/85">
                  {t.autoTiered}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:min-w-[280px]">
              <Button
                variant="default"
                onClick={() => setActiveStep && setActiveStep(2)}
                className="flex-1"
              >
                {t.continueToVerification}
              </Button>
              <Button
                variant="action"
                size="icon"
                onClick={() => setActiveStep && setActiveStep(2)}
                aria-label="Continue to Step 2"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1Catalog;
