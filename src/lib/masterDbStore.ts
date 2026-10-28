import {
  INITIAL_INVENTARIS_MOTOR,
  INITIAL_ZONA_ONGKIR,
  VEHICLE_CATEGORIES,
  InventoryUnitRow,
  DeliveryZone,
} from '@/config/siteConfig';

export interface BookingOrderRecord {
  orderId: string;
  createdAt: string;
  fullName: string;
  whatsappNumber: string;
  nationality: string;
  categoryId: string;
  categoryName: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  zoneId: string;
  zoneLabel: string;
  hotelAndRoom: string;
  deliveryTime: string;
  rentalSubtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod:
    | 'instant_online'
    | 'manual_transfer'
    | 'cod_arrival'
    | 'COD'
    | 'QRIS'
    | 'TRANSFER'
    | 'ONLINE';
  status: 'paid_locked' | 'pending_approval' | 'cod_approved_locked' | 'rejected';
  assignedPlate?: string;
  xenditInvoiceUrl?: string;
  ocrExtractedName?: string;
  ocrExtractedIdNumber?: string;
  ocrStatus: 'JELAS' | 'BURAM';
  whatsappMessagePreview: string;
}

class MasterDatabaseStore {
  public inventarisMotor: InventoryUnitRow[] = [...INITIAL_INVENTARIS_MOTOR.map((u) => ({ ...u }))];
  public zonaOngkir: DeliveryZone[] = [...INITIAL_ZONA_ONGKIR.map((z) => ({ ...z }))];
  public dataPesananKyc: BookingOrderRecord[] = [
    {
      orderId: 'ORD-2026-881',
      createdAt: '2026-05-15T09:42:00+08:00',
      fullName: 'Alexander Wright',
      whatsappNumber: '+61 412 345 678',
      nationality: 'Australia (Verified Foreign Tourist)',
      categoryId: 'scoopy',
      categoryName: 'Honda Scoopy',
      startDate: '2026-05-15',
      endDate: '2026-05-22',
      durationDays: 7,
      zoneId: 'zona-2',
      zoneLabel: 'Zona 2: Canggu / Jimbaran',
      hotelAndRoom: 'The Haven Suites Canggu — Room 204',
      deliveryTime: '10:00 AM WITA (Morning Delivery)',
      rentalSubtotal: 520000,
      deliveryFee: 50000,
      totalAmount: 570000,
      paymentMethod: 'cod_arrival',
      status: 'pending_approval',
      ocrExtractedName: 'ALEXANDER WRIGHT',
      ocrExtractedIdNumber: 'PA8934120',
      ocrStatus: 'JELAS',
      whatsappMessagePreview:
        'Halo Alexander Wright, pesanan sewa Honda Scoopy Anda dengan ID #ORD-2026-881 telah kami terima. Tim VIYOND sedang memproses pengantaran ke The Haven Suites Canggu — Room 204 pukul 10:00 AM WITA.',
    },
  ];

  public getPublicAggregatedInventory() {
    return VEHICLE_CATEGORIES.map((cat) => {
      const readyUnits = this.inventarisMotor.filter(
        (u) => u.categoryId === cat.id && u.status === 'READY'
      );
      const totalUnits = this.inventarisMotor.filter((u) => u.categoryId === cat.id).length;
      // Code Node n8n:
      // Agregasi Stok per Kategori tanpa membocorkan pelat nomor ke publik
      return {
        ...cat,
        availableUnits: readyUnits.length,
        totalFleetUnits: totalUnits,
        isAvailable: readyUnits.length > 0,
      };
    });
  }

  public toggleCategoryStockForUat(categoryId: 'nmax' | 'pcx' | 'scoopy' | 'vario' | 'fazzio', forceSoldOut?: boolean) {
    const units = this.inventarisMotor.filter((u) => u.categoryId === categoryId);
    const anyReady = units.some((u) => u.status === 'READY');
    const targetMakeSoldOut = forceSoldOut !== undefined ? forceSoldOut : anyReady;

    this.inventarisMotor = this.inventarisMotor.map((u) => {
      if (u.categoryId !== categoryId) return u;
      return {
        ...u,
        status: targetMakeSoldOut ? 'DISEWA' : 'READY',
      };
    });
    return this.getPublicAggregatedInventory();
  }

  public updateSingleUnitStatus(unitId: string, status: 'READY' | 'DISEWA' | 'BENGKEL') {
    this.inventarisMotor = this.inventarisMotor.map((u) =>
      u.unitId === unitId ? { ...u, status } : u
    );
    return this.inventarisMotor;
  }

  public lockAvailableUnitForOrder(categoryId: string): string | undefined {
    const readyUnit = this.inventarisMotor.find(
      (u) => u.categoryId === categoryId && u.status === 'READY'
    );
    if (!readyUnit) return undefined;
    readyUnit.status = 'DISEWA';
    return readyUnit.plateNumber;
  }
}

// Global singleton across hot reloads
const globalForDb = globalThis as unknown as { viyondMasterDb?: MasterDatabaseStore };
export const masterDb = globalForDb.viyondMasterDb ?? new MasterDatabaseStore();
if (process.env.NODE_ENV !== 'production') {
  globalForDb.viyondMasterDb = masterDb;
}
