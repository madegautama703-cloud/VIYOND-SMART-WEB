'use client';

import React, { useState } from 'react';
import {
  SiteConfig,
  clientPresets,
  InventoryUnitRow,
} from '@/config/siteConfig';
import { BookingOrderRecord } from '@/lib/masterDbStore';
import {
  X,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Send,
  Database,
  Sliders,
  ShieldAlert,
  Truck,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UatControlConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  siteConfig: SiteConfig;
  onUpdateSiteConfig: (cfg: SiteConfig) => void;
  inventarisMotor: InventoryUnitRow[];
  orders: BookingOrderRecord[];
  onToggleCategoryStock: (
    categoryId: 'nmax' | 'pcx' | 'scoopy' | 'vario' | 'fazzio',
    forceSoldOut?: boolean
  ) => Promise<void>;
  onUpdateSingleUnit: (
    unitId: string,
    status: 'READY' | 'DISEWA' | 'BENGKEL'
  ) => Promise<void>;
  onOwnerTelegramDecision: (
    orderId: string,
    decision: 'approve' | 'reject'
  ) => Promise<void>;
  onTriggerBlurryTest: (makeBlurry: boolean) => void;
  idCardIsBlurry: boolean;
}

export function UatControlConsole({
  isOpen,
  onClose,
  siteConfig,
  onUpdateSiteConfig,
  inventarisMotor,
  orders,
  onToggleCategoryStock,
  onUpdateSingleUnit,
  onOwnerTelegramDecision,
  onTriggerBlurryTest,
  idCardIsBlurry,
}: UatControlConsoleProps) {
  const [activeTab, setActiveTab] = useState<'uat' | 'telegram' | 'config'>('uat');
  const [busyAction, setBusyAction] = useState<string | null>(null);

  if (!isOpen) return null;

  const pcxReadyCount = inventarisMotor.filter(
    (u) => u.categoryId === 'pcx' && u.status === 'READY'
  ).length;

  const latestOrder = orders[0];

  const handleTogglePcx = async () => {
    setBusyAction('pcx');
    await onToggleCategoryStock('pcx', pcxReadyCount > 0);
    setBusyAction(null);
  };

  const handleDecision = async (orderId: string, decision: 'approve' | 'reject') => {
    setBusyAction(`${orderId}-${decision}`);
    await onOwnerTelegramDecision(orderId, decision);
    setBusyAction(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl h-full bg-[#081226] border-l border-blue-400/20 text-slate-100 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-400/15 bg-[#050b16]/90">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight text-white">
                VIYOND — Master DB, n8n & Telegram UAT Console
              </h2>
              <Badge variant="secondary">Tahap 4 & 5</Badge>
            </div>
            <p className="text-xs text-blue-200/70 mt-0.5">
              Interactive test console for Google Sheets + Telegram Bot + siteConfig.ts
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close UAT Console"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-[#050b16] border-b border-blue-400/15">
          <button
            onClick={() => setActiveTab('uat')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'uat'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-blue-200/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>1. /stok & UAT Tests</span>
          </button>
          <button
            onClick={() => setActiveTab('telegram')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'telegram'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-blue-200/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>2. Telegram COD Bot</span>
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'config'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-blue-200/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>3. siteConfig.ts (15m)</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'uat' && (
            <>
              {/* UAT Scenario 2: Two-way Stock Sync */}
              <div className="rounded-2xl bg-[#0e1f42]/80 border border-blue-400/20 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-blue-300">
                      UAT Skenario #2 · Sinkronisasi Stok Dua Arah (Telegram ↔ Web)
                    </div>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      Honda PCX 160 Live Stock Override (/stok)
                    </h3>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-blue-200 font-bold">
                    {pcxReadyCount > 0 ? `${pcxReadyCount} READY` : '0 READY (SOLD OUT)'}
                  </span>
                </div>
                <p className="text-xs text-blue-100/75 leading-relaxed">
                  Ketika staf menekan tombol <code className="font-mono text-white">/stok</code> di
                  Telegram Bot, status unit PCX di tab <code className="font-mono text-white">INVENTARIS_MOTOR</code> berubah detik itu juga tanpa membocorkan pelat nomor ke publik.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleTogglePcx}
                    disabled={busyAction === 'pcx'}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${busyAction === 'pcx' ? 'animate-spin' : ''}`}
                    />
                    <span>
                      {pcxReadyCount === 0
                        ? 'Telegram /stok: Set Honda PCX 160 → 3 Units READY'
                        : 'Telegram /stok: Set All Honda PCX 160 → DISEWA (Sold Out)'}
                    </span>
                  </Button>
                </div>
              </div>

              {/* UAT Scenario 3: Blurry Photo OCR Rejection */}
              <div className="rounded-2xl bg-[#0e1f42]/80 border border-blue-400/20 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-blue-300">
                      UAT Skenario #3 · Uji Tolak Foto Buram di Layar Web (AI Vision OCR)
                    </div>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      1. Passport / ID Card (KTP) Clarity State
                    </h3>
                  </div>
                  <Badge variant={idCardIsBlurry ? 'destructive' : 'success'}>
                    {idCardIsBlurry ? 'STATUS: BURAM' : 'STATUS: JELAS'}
                  </Badge>
                </div>
                <p className="text-xs text-blue-100/75 leading-relaxed">
                  Uji respons <code className="font-mono text-white">error_blur</code> pada Langkah 2
                  tanpa menghapus isian nama, WhatsApp, atau tanggal yang sudah diketik turis.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={idCardIsBlurry ? 'destructive' : 'secondary'}
                    size="sm"
                    onClick={() => onTriggerBlurryTest(true)}
                    className="flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Simulasikan Foto Buram (Glare/Blur)</span>
                  </Button>
                  <Button
                    variant={!idCardIsBlurry ? 'success' : 'secondary'}
                    size="sm"
                    onClick={() => onTriggerBlurryTest(false)}
                    className="flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Simulasikan Foto Jelas (OCR Terverifikasi)</span>
                  </Button>
                </div>
              </div>

              {/* Master DB Table: INVENTARIS_MOTOR */}
              <div className="rounded-2xl bg-[#0e1f42]/80 border border-blue-400/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-blue-300">
                      Google Sheets Master DB · Tab INVENTARIS_MOTOR
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      Unit-Level Plate & Status Control
                    </h3>
                  </div>
                  <span className="text-xs text-blue-200/70 font-mono tabular-nums">
                    {inventarisMotor.filter((u) => u.status === 'READY').length} /{' '}
                    {inventarisMotor.length} READY
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto rounded-xl border border-blue-400/15 divide-y divide-blue-400/10 bg-[#060d1d]">
                  {inventarisMotor.map((unit) => (
                    <div
                      key={unit.unitId}
                      className="flex items-center justify-between px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold text-white w-16">
                          {unit.unitId}
                        </span>
                        <span className="font-mono text-blue-200/80 tabular-nums">
                          {unit.plateNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {(['READY', 'DISEWA', 'BENGKEL'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => onUpdateSingleUnit(unit.unitId, st)}
                            className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition-colors cursor-pointer ${
                              unit.status === st
                                ? st === 'READY'
                                  ? 'bg-emerald-500 text-slate-950 font-bold'
                                  : st === 'DISEWA'
                                  ? 'bg-amber-500 text-slate-950 font-bold'
                                  : 'bg-rose-500 text-white font-bold'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'telegram' && (
            <div className="space-y-4">
              {/* Owner Telegram Group Simulator */}
              <div className="rounded-2xl bg-[#0e1f42]/80 border border-blue-400/20 p-4 space-y-3">
                <div className="text-xs font-semibold text-blue-300">
                  UAT Skenario #4 · Grup Telegram Owner (Persetujuan COD / Transfer)
                </div>
                <h3 className="text-sm font-bold text-white">
                  Incoming Booking Alert — #{latestOrder?.orderId}
                </h3>

                {latestOrder && (
                  <div className="rounded-xl bg-[#060d1d] border border-blue-400/20 p-3.5 space-y-2.5 text-xs font-mono">
                    <div className="text-emerald-400 font-semibold">
                      [VIYOND BOT] NEW WEB BOOKING RECEIVED
                    </div>
                    <div className="space-y-1 text-blue-100/90">
                      <div>Order ID: #{latestOrder.orderId}</div>
                      <div>Renter: {latestOrder.fullName} ({latestOrder.nationality})</div>
                      <div>WhatsApp: {latestOrder.whatsappNumber}</div>
                      <div>Unit: {latestOrder.categoryName} ({latestOrder.durationDays} Days)</div>
                      <div>Hotel: {latestOrder.hotelAndRoom}</div>
                      <div>Delivery: {latestOrder.deliveryTime}</div>
                      <div>
                        Total: Rp {latestOrder.totalAmount.toLocaleString('id-ID')} (
                        {latestOrder.paymentMethod.toUpperCase()})
                      </div>
                      <div>
                        AI Vision OCR: {latestOrder.ocrStatus} (ID: {latestOrder.ocrExtractedIdNumber})
                      </div>
                      <div>
                        Current Status:{' '}
                        <span className="text-white font-bold">{latestOrder.status}</span>
                        {latestOrder.assignedPlate && ` · Plate Locked: ${latestOrder.assignedPlate}`}
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleDecision(latestOrder.orderId, 'approve')}
                        disabled={busyAction === `${latestOrder.orderId}-approve`}
                        className="flex-1 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve COD & Lock Plate</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDecision(latestOrder.orderId, 'reject')}
                        disabled={busyAction === `${latestOrder.orderId}-reject`}
                        className="flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Tolak COD</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Courier Telegram Group + WhatsApp E-Receipt Preview */}
              {latestOrder && (
                <div className="grid grid-cols-1 gap-3">
                  <div className="rounded-2xl bg-[#0e1f42]/80 border border-blue-400/20 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
                      <Truck className="w-4 h-4" />
                      <span>Grup Telegram Kurir (Tugas Pengantaran)</span>
                    </div>
                    {latestOrder.status === 'cod_approved_locked' ||
                    latestOrder.status === 'paid_locked' ? (
                      <div className="text-xs text-emerald-200 bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-3 font-mono space-y-1">
                        <div className="font-bold text-emerald-400">
                          DISPATCH LOCKED — PLATE: {latestOrder.assignedPlate || 'DK 4821 FBV'}
                        </div>
                        <div>Deliver Unit: {latestOrder.categoryName}</div>
                        <div>Destination: {latestOrder.hotelAndRoom}</div>
                        <div>Time: {latestOrder.deliveryTime}</div>
                        <div>Collect Cash: Rp {latestOrder.totalAmount.toLocaleString('id-ID')}</div>
                      </div>
                    ) : (
                      <p className="text-xs text-blue-200/70">
                        Menunggu Owner menekan tombol <strong>Approve COD & Lock Plate</strong> di
                        atas untuk mengunci pelat nomor di Google Sheets dan mengirim tugas ke kurir.
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-[#0e1f42]/80 border border-blue-400/20 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                      <MessageSquare className="w-4 h-4" />
                      <span>Evolution API / WABA Outbound WhatsApp Sync</span>
                    </div>
                    <div className="text-xs text-blue-100/90 bg-[#060d1d] border border-blue-400/15 rounded-xl p-3 leading-relaxed">
                      “{latestOrder.whatsappMessagePreview}”
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#0e1f42]/80 border border-blue-400/20 p-4 space-y-3">
                <div className="text-xs font-semibold text-blue-300">
                  TAHAP 4 · Standarisasi Master Template Web (Duplikasi 15 Menit)
                </div>
                <h3 className="text-sm font-bold text-white">
                  Pilih Preset Klien atau Ubah Variabel <code className="font-mono">siteConfig.ts</code>
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(clientPresets).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => onUpdateSiteConfig(preset)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        siteConfig.brandName === preset.brandName
                          ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                          : 'bg-[#060d1d] border-blue-400/20 text-blue-100 hover:bg-white/5'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{preset.brandName}</div>
                      <div className="text-[10px] opacity-75 truncate mt-0.5">
                        +{preset.whatsappNumber}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  {/* isShowcaseMode Interactive Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#060d1d] border border-blue-400/25">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>isShowcaseMode</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          siteConfig.isShowcaseMode
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                            : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                        }`}>
                          {siteConfig.isShowcaseMode ? 'Showcase / UAT Active' : 'Production Mode'}
                        </span>
                      </div>
                      <div className="text-[10px] text-blue-200/70 mt-0.5">
                        {siteConfig.isShowcaseMode
                          ? 'Aktif: Board/Mobile view, hero banner, tombol UAT & latency ms.'
                          : 'Nonaktif: Production mode bersih & responsif untuk pelanggan akhir.'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateSiteConfig({
                          ...siteConfig,
                          isShowcaseMode: !siteConfig.isShowcaseMode,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        siteConfig.isShowcaseMode ? 'bg-blue-600' : 'bg-slate-700'
                      }`}
                      aria-label="Toggle Showcase Mode"
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          siteConfig.isShowcaseMode ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-blue-200/80 mb-1">
                      brandName (Nama Rental Klien)
                    </label>
                    <input
                      type="text"
                      value={siteConfig.brandName}
                      onChange={(e) =>
                        onUpdateSiteConfig({ ...siteConfig, brandName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#060d1d] border border-blue-400/25 text-xs text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-blue-200/80 mb-1">
                      whatsappNumber (Nomor WA Bisnis Klien)
                    </label>
                    <input
                      type="text"
                      value={siteConfig.whatsappNumber}
                      onChange={(e) =>
                        onUpdateSiteConfig({ ...siteConfig, whatsappNumber: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#060d1d] border border-blue-400/25 text-xs font-mono text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-blue-200/80 mb-1">
                      n8nGetInventoryEndpoint
                    </label>
                    <input
                      type="text"
                      value={siteConfig.n8nGetInventoryEndpoint}
                      onChange={(e) =>
                        onUpdateSiteConfig({
                          ...siteConfig,
                          n8nGetInventoryEndpoint: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#060d1d] border border-blue-400/25 text-xs font-mono text-blue-200 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-blue-200/80 mb-1">
                      n8nPostBookingEndpoint
                    </label>
                    <input
                      type="text"
                      value={siteConfig.n8nPostBookingEndpoint}
                      onChange={(e) =>
                        onUpdateSiteConfig({
                          ...siteConfig,
                          n8nPostBookingEndpoint: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#060d1d] border border-blue-400/25 text-xs font-mono text-blue-200 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
