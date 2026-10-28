import { VehicleCategory, DeliveryZone } from '@/config/siteConfig';

export interface PriceBreakdown {
  days: number;
  tierLabelEn: string;
  tierLabelId: string;
  rentalSubtotal: number;
  deliveryFee: number;
  totalAmount: number;
  approxUsd: number;
  formulaSummaryEn: string;
  formulaSummaryId: string;
}

export function calculateRentalDays(startDateStr: string, endDateStr: string): number {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffMs = end.getTime() - start.getTime();
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
}

export function calculateLivePrice(
  vehicle: VehicleCategory,
  days: number,
  zone?: DeliveryZone | null,
  usdRate: number = 15625
): PriceBreakdown {
  let rentalSubtotal = 0;
  let tierLabelEn = 'Daily Rate';
  let tierLabelId = 'Tarif Harian';

  if (days >= 30) {
    const months = Math.floor(days / 30);
    const remDays = days % 30;
    const remWeeks = Math.floor(remDays / 7);
    const extraDays = remDays % 7;
    rentalSubtotal =
      months * vehicle.monthlyPrice +
      remWeeks * vehicle.weeklyPrice +
      extraDays * vehicle.dailyPrice;
    tierLabelEn =
      remDays === 0
        ? `Monthly Tier: Rp ${(months * vehicle.monthlyPrice) / 1000}k`
        : `${months} Mo + ${remDays}d Tier`;
    tierLabelId =
      remDays === 0
        ? `Paket Bulanan: Rp ${(months * vehicle.monthlyPrice) / 1000}rb`
        : `${months} Bln + ${remDays} Hr`;
  } else if (days >= 7) {
    const weeks = Math.floor(days / 7);
    const remDays = days % 7;
    const rawWeeklyPlusDays = weeks * vehicle.weeklyPrice + remDays * vehicle.dailyPrice;
    // Cap at monthly price if cheaper
    rentalSubtotal = Math.min(rawWeeklyPlusDays, vehicle.monthlyPrice);
    if (remDays === 0) {
      tierLabelEn = `Weekly Tier: Rp ${(weeks * vehicle.weeklyPrice) / 1000}k`;
      tierLabelId = `Paket Mingguan: Rp ${(weeks * vehicle.weeklyPrice) / 1000}rb`;
    } else {
      tierLabelEn = `${weeks}W + ${remDays}D Tier: Rp ${Math.round(rentalSubtotal / 1000)}k`;
      tierLabelId = `${weeks}Mgg + ${remDays}Hr: Rp ${Math.round(rentalSubtotal / 1000)}rb`;
    }
  } else {
    rentalSubtotal = days * vehicle.dailyPrice;
    tierLabelEn = `Daily Tier: ${days} × Rp ${vehicle.dailyPrice / 1000}k`;
    tierLabelId = `Harian: ${days} × Rp ${vehicle.dailyPrice / 1000}rb`;
  }

  const deliveryFee = Number(zone?.fee ?? 0);
  const totalAmount = rentalSubtotal + deliveryFee;
  const approxUsd = Math.round(totalAmount / usdRate);

  const zoneCode = zone?.code || 'ZONA-2';
  const zoneFeeShort = deliveryFee === 0 ? 'Free' : `Rp ${deliveryFee / 1000}k`;
  const formulaSummaryEn = `${days} Days (${tierLabelEn}) + ${zoneCode} (${zoneFeeShort})`;
  const formulaSummaryId = `${days} Hari (${tierLabelId}) + ${zoneCode} (${zoneFeeShort})`;

  return {
    days,
    tierLabelEn,
    tierLabelId,
    rentalSubtotal,
    deliveryFee,
    totalAmount,
    approxUsd,
    formulaSummaryEn,
    formulaSummaryId,
  };
}

export function formatIdr(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}
