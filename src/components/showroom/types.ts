import type React from 'react';
import type {
  BILINGUAL_COPY,
  DeliveryZone,
  SiteConfig,
  VehicleCategory,
} from '@/config/siteConfig';
import type { PriceBreakdown } from '@/lib/priceCalculator';
import type { BookingOrderRecord } from '@/lib/masterDbStore';

/**
 * Showroom UI view-model.
 * Pure presentation contract: every value / setter / handler comes straight from
 * BookingWizardApp so state logic, price calculator, KYC compression and n8n
 * webhooks stay 100% untouched.
 */

export type CategoryId = 'nmax' | 'pcx' | 'scoopy' | 'vario' | 'fazzio';
export type KycSlotKey = 'passport' | 'selfie' | 'flight' | 'hotel';
export type PaymentMethod = 'COD' | 'QRIS' | 'TRANSFER' | 'ONLINE';
export type StepNumber = 1 | 2 | 3;

export interface ShowroomCategory extends VehicleCategory {
  availableUnits: number;
  totalFleetUnits: number;
  isAvailable: boolean;
}

export interface ShowroomKycDoc {
  id: KycSlotKey;
  status: 'blurry' | 'compressing' | 'verified' | 'ready_to_upload';
  fileName: string;
  compressedKb: number;
  ocrMessage: string;
}

export type CopyDictionary = (typeof BILINGUAL_COPY)[keyof typeof BILINGUAL_COPY];

export interface ShowroomViewModel {
  // Locale & brand
  lang: 'en' | 'id';
  setLang: (lang: 'en' | 'id') => void;
  t: CopyDictionary;
  siteConfig: SiteConfig;

  // Wizard navigation
  activeStep: StepNumber;
  goToStep: (step: StepNumber) => void;

  // Step 1 — dates, catalog, zone
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  rentalDays: number;
  formatDisplayDate: (iso: string) => string;
  categories: ShowroomCategory[];
  selectedCategoryId: CategoryId;
  setSelectedCategoryId: (id: CategoryId) => void;
  selectedCategory: ShowroomCategory;
  zones: DeliveryZone[];
  selectedZone: DeliveryZone;
  selectedZoneId: string;
  setSelectedZoneId: (id: string) => void;
  hotelAndRoom: string;
  setHotelAndRoom: (v: string) => void;
  deliveryTime: string;
  setDeliveryTime: (v: string) => void;
  priceBreakdown: PriceBreakdown;
  isSyncingStock: boolean;
  refreshInventory: () => void;

  // Step 2 — contact & KYC
  fullName: string;
  setFullName: (v: string) => void;
  countryCode: string;
  setCountryCode: (v: string) => void;
  whatsappLocal: string;
  setWhatsappLocal: (v: string) => void;
  nationality: string;
  setNationality: (v: string) => void;
  pdpAgreed: boolean;
  setPdpAgreed: (v: boolean) => void;
  kycDocs: Record<string, ShowroomKycDoc>;
  validatedDocCount: number;
  openCamera: (slot: KycSlotKey) => void;
  openFilePicker: (slot: KycSlotKey) => void;

  // Step 3 — payment & submission
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
  isSubmittingBooking: boolean;
  handleSubmitBooking: () => void;
  submittedOrderId: string | null;
  submittedOrderStatus: string | null;
  bookingSubmissionError: string | null;
  validationErrors: string[];
  activeOrder: BookingOrderRecord;

  // AI CS / WhatsApp concierge
  waChatInput: string;
  setWaChatInput: (v: string) => void;
  handleSendWaChat: (e: React.FormEvent) => void;
  openWaChat: () => void;
}
