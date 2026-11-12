'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, CreditCard, QrCode, Landmark, Banknote, ExternalLink } from 'lucide-react';
import { formatIdr } from '@/lib/priceCalculator';
import type { PaymentMethod, ShowroomViewModel } from './types';
import { getPaymentOptions } from './shared';

const PAY_ICONS: Record<PaymentMethod, React.ComponentType<{ className?: string }>> = {
  ONLINE: CreditCard,
  QRIS: QrCode,
  TRANSFER: Landmark,
  COD: Banknote,
};

export function PaymentMethodList({
  vm,
  dense = false,
}: {
  vm: ShowroomViewModel;
  dense?: boolean;
}) {
  const options = getPaymentOptions(vm.t, vm.lang);
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const Icon = PAY_ICONS[opt.id];
        const active = vm.paymentMethod === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => vm.setPaymentMethod(opt.id)}
            className={`flex w-full items-center gap-3 rounded-2xl border text-left transition-all cursor-pointer ${
              dense ? 'px-3 py-2.5' : 'px-4 py-3'
            } ${
              active
                ? 'border-[#10B981]/40 bg-[#F0FDF7] shadow-sm'
                : 'border-transparent bg-[#F4F5F6] hover:bg-[#EEF0F2]'
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                active ? 'bg-[#10B981] text-white' : 'bg-white text-[#14171F]'
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-[#14171F]">{opt.title}</span>
              <span className="block truncate text-[11px] text-[#6B7280]">{opt.desc}</span>
            </span>
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                active ? 'border-[#10B981]' : 'border-[#D1D5DB]'
              }`}
            >
              {active && <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function BookingSummaryList({ vm }: { vm: ShowroomViewModel }) {
  const { priceBreakdown: p, selectedCategory, selectedZone, lang } = vm;
  const rows: Array<[string, string]> = [
    [lang === 'id' ? 'Unit' : 'Scooter', selectedCategory.name],
    [
      lang === 'id' ? 'Periode' : 'Period',
      `${vm.formatDisplayDate(vm.startDate)} → ${vm.formatDisplayDate(vm.endDate)}`,
    ],
    [lang === 'id' ? 'Durasi' : 'Duration', `${vm.rentalDays} ${vm.t.daysUnit.toLowerCase()} · ${lang === 'id' ? p.tierLabelId : p.tierLabelEn}`],
    [lang === 'id' ? 'Antar ke' : 'Deliver to', vm.hotelAndRoom || '—'],
    [selectedZone?.code || 'Zone', p.deliveryFee === 0 ? 'Free' : formatIdr(p.deliveryFee)],
    [lang === 'id' ? 'Subtotal sewa' : 'Rental subtotal', formatIdr(p.rentalSubtotal)],
  ];
  return (
    <dl className="divide-y divide-[#EEF0F2]">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-start justify-between gap-4 py-2.5">
          <dt className="shrink-0 text-[12px] text-[#6B7280]">{k}</dt>
          <dd className="text-right text-[12px] font-semibold text-[#14171F]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SubmissionFeedback({ vm }: { vm: ShowroomViewModel }) {
  return (
    <AnimatePresence initial={false}>
      {vm.bookingSubmissionError && !vm.submittedOrderId && (
        <motion.div
          key="err"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800"
        >
          <div className="flex items-center gap-2 text-[13px] font-semibold">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {vm.bookingSubmissionError}
          </div>
          {vm.validationErrors.length > 0 && (
            <ul className="mt-2 list-disc space-y-0.5 pl-6 text-[11px]">
              {vm.validationErrors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
      {vm.submittedOrderId && (
        <motion.div
          key="ok"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="rounded-2xl border border-[#10B981]/30 bg-[#F0FDF7] p-4"
        >
          <div className="flex items-center gap-2 text-[14px] font-semibold text-[#065F46]">
            <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
            {vm.t.bookingReceivedTitle}
          </div>
          <p className="mt-1 text-[12px] text-[#065F46]/80">
            #{vm.submittedOrderId} · {vm.submittedOrderStatus}
            {vm.activeOrder.assignedPlate ? ` · ${vm.activeOrder.assignedPlate}` : ''}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {vm.activeOrder.xenditInvoiceUrl && (
              <a
                href={vm.activeOrder.xenditInvoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#10B981] px-4 py-2 text-[12px] font-semibold text-white"
              >
                {vm.lang === 'id' ? 'Bayar Sekarang' : 'Pay Now'}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={vm.openWaChat}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#065F46] border border-[#10B981]/30 cursor-pointer"
            >
              {vm.t.openWhatsappTracking}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Primary emerald action for the current step */
export function PrimaryStepAction({
  vm,
  className = '',
}: {
  vm: ShowroomViewModel;
  className?: string;
}) {
  const { activeStep, t } = vm;
  const label =
    activeStep === 1
      ? t.continueToVerification
      : activeStep === 2
      ? t.continueToPayment
      : vm.isSubmittingBooking
      ? vm.lang === 'id'
        ? 'Mengirim...'
        : 'Submitting...'
      : t.submitVerifyBooking;

  const onClick = () => {
    if (activeStep === 1) vm.goToStep(2);
    else if (activeStep === 2) vm.goToStep(3);
    else vm.handleSubmitBooking();
  };

  const disabled =
    (activeStep === 1 && !vm.selectedCategory.isAvailable) ||
    (activeStep === 3 && vm.isSubmittingBooking);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 rounded-full bg-[#10B981] px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(16,185,129,0.8)] transition-colors hover:bg-[#0EA472] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${className}`}
    >
      {activeStep === 3 && vm.isSubmittingBooking && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {label}
    </motion.button>
  );
}
