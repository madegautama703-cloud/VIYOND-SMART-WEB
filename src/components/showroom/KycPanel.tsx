'use client';

import React from 'react';
import { Camera, Upload, ShieldCheck, FileText, Plane, Hotel, UserRound } from 'lucide-react';
import type { KycSlotKey, ShowroomKycDoc, ShowroomViewModel } from './types';
import { COUNTRY_CODES, NATIONALITIES } from './shared';

const SLOT_ICONS: Record<KycSlotKey, React.ComponentType<{ className?: string }>> = {
  passport: FileText,
  selfie: UserRound,
  flight: Plane,
  hotel: Hotel,
};

function DocStatus({ doc }: { doc: ShowroomKycDoc }) {
  const map = {
    verified: { cls: 'bg-[#D1FAE5] text-[#065F46]', dot: 'bg-[#10B981]', label: 'Verified' },
    compressing: { cls: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500 animate-pulse', label: 'Scanning' },
    blurry: { cls: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500', label: 'Blurry' },
    ready_to_upload: { cls: 'bg-[#F1F2F4] text-[#6B7280]', dot: 'bg-[#9CA3AF]', label: 'Required' },
  }[doc.status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${map.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${map.dot}`} />
      {map.label}
    </span>
  );
}

const fieldCls =
  'w-full rounded-2xl bg-[#F4F5F6] border border-transparent px-4 py-3 text-sm font-medium text-[#14171F] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#10B981] focus:bg-white transition-colors';
const labelCls = 'block text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] mb-1.5';

export function KycContactFields({ vm }: { vm: ShowroomViewModel }) {
  const { t } = vm;
  return (
    <div className="space-y-3">
      <div>
        <label className={labelCls}>{t.fullNameLabel}</label>
        <input
          type="text"
          value={vm.fullName}
          onChange={(e) => vm.setFullName(e.target.value)}
          className={fieldCls}
          placeholder="Alexander Wright"
        />
      </div>
      <div>
        <label className={labelCls}>{t.whatsappLabel}</label>
        <div className="flex gap-2">
          <select
            value={vm.countryCode}
            onChange={(e) => vm.setCountryCode(e.target.value)}
            className={`${fieldCls} w-[108px] shrink-0 cursor-pointer`}
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            type="tel"
            inputMode="tel"
            value={vm.whatsappLocal}
            onChange={(e) => vm.setWhatsappLocal(e.target.value)}
            className={fieldCls}
            placeholder="412 345 678"
          />
        </div>
      </div>
      <div>
        <label className={labelCls}>{t.nationalityLabel}</label>
        <select
          value={vm.nationality}
          onChange={(e) => vm.setNationality(e.target.value)}
          className={`${fieldCls} cursor-pointer`}
        >
          {(NATIONALITIES.includes(vm.nationality) ? NATIONALITIES : [vm.nationality, ...NATIONALITIES]).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function KycDocumentGrid({
  vm,
  columns = 2,
}: {
  vm: ShowroomViewModel;
  columns?: 1 | 2;
}) {
  const { t } = vm;
  const slots: Array<{ key: KycSlotKey; title: string; cameraLabel: string }> = [
    { key: 'passport', title: t.doc1Title, cameraLabel: vm.lang === 'id' ? 'Kamera' : 'Camera' },
    { key: 'selfie', title: t.doc2Title, cameraLabel: 'Selfie' },
    { key: 'flight', title: t.doc3Title, cameraLabel: vm.lang === 'id' ? 'Kamera' : 'Camera' },
    { key: 'hotel', title: t.doc4Title, cameraLabel: vm.lang === 'id' ? 'Kamera' : 'Camera' },
  ];

  return (
    <div className={`grid gap-3 ${columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
      {slots.map(({ key, title, cameraLabel }) => {
        const doc = vm.kycDocs[key];
        const Icon = SLOT_ICONS[key];
        const isBlurry = doc?.status === 'blurry';
        const hasFile = doc && doc.status !== 'ready_to_upload';
        return (
          <div
            key={key}
            className={`rounded-2xl border p-4 transition-colors ${
              isBlurry ? 'border-rose-200 bg-rose-50/70' : 'border-[#EEF0F2] bg-[#F7F8F9]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm border border-[#EEF0F2]">
                <Icon className="h-4 w-4 text-[#14171F]" />
              </div>
              {doc && <DocStatus doc={doc} />}
            </div>
            <div className="mt-3 text-[13px] font-semibold leading-snug text-[#14171F]">
              {title.replace(/^\d\.\s*/, '')}
            </div>
            <p
              className={`mt-1 line-clamp-2 text-[11px] leading-snug ${
                isBlurry ? 'text-rose-600' : 'text-[#6B7280]'
              }`}
            >
              {hasFile
                ? `${doc.fileName}${doc.compressedKb ? ` · ${doc.compressedKb} KB` : ''}`
                : doc?.ocrMessage}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => vm.openCamera(key)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#14171F] px-3 py-2 text-[11px] font-semibold text-white transition-transform active:scale-95 cursor-pointer"
              >
                <Camera className="h-3.5 w-3.5" />
                {cameraLabel}
              </button>
              <button
                type="button"
                onClick={() => vm.openFilePicker(key)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#E5E7EB] text-[#14171F] transition-transform active:scale-95 cursor-pointer"
                aria-label={`Upload ${title}`}
              >
                <Upload className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PdpConsent({ vm }: { vm: ShowroomViewModel }) {
  const { t } = vm;
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-[#F4F5F6] p-3.5">
      <input
        type="checkbox"
        checked={vm.pdpAgreed}
        onChange={(e) => vm.setPdpAgreed(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#10B981]"
      />
      <span className="text-[11px] leading-relaxed text-[#4B5563]">
        <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-[#10B981]" />
        {t.pdpConsentPart1}
        <span className="font-semibold text-[#065F46]">{t.pdpConsentHighlight}</span>.
      </span>
    </label>
  );
}

export function KycProgress({ vm }: { vm: ShowroomViewModel }) {
  const pct = Math.round((vm.validatedDocCount / 4) * 100);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-[#6B7280]">
        <span>{vm.t.upload4DocsTitle}</span>
        <span className="text-[#14171F]">{vm.validatedDocCount}/4</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ECEEF0]">
        <div
          className="h-full rounded-full bg-[#10B981] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
