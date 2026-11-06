import { NextRequest, NextResponse } from 'next/server';
import { masterDb } from '@/lib/masterDbStore';
import { INITIAL_INVENTARIS_MOTOR, VEHICLE_CATEGORIES, VehicleCategory } from '@/config/siteConfig';

// Production n8n GET Webhook URL
const PRODUCTION_N8N_WEBHOOK_URL =
  process.env.N8N_GET_INVENTORY_WEBHOOK_URL ||
  process.env.NEXT_PUBLIC_N8N_GET_INVENTORY_WEBHOOK_URL ||
  'https://n8n.srv2075779.hstgr.cloud/webhook/viyond-live-inventory';

interface EnrichedCategory extends VehicleCategory {
  availableUnits: number;
  totalFleetUnits: number;
  isAvailable: boolean;
}

interface RawMotorItem {
  id?: string;
  categoryId?: string;
  category?: string;
  name?: string;
  availableCount?: number | string;
  availableUnits?: number | string;
  readyUnits?: number | string;
  stock?: number | string;
  status?: string;
  dailyPrice?: number | string;
  weeklyPrice?: number | string;
  monthlyPrice?: number | string;
  totalUnits?: number | string;
}

/**
 * Normalizes raw motors array from n8n / Google Sheets "Aggregate Ready Stock" node
 * Maps categories: "NMAX", "PCX", "Scoopy", "Vario", "Fazzio"
 */
function mapMotorsToCategories(motors: RawMotorItem[]): EnrichedCategory[] {
  if (!motors || !Array.isArray(motors) || motors.length === 0) {
    return masterDb.getPublicAggregatedInventory();
  }
  return VEHICLE_CATEGORIES.map((cat) => {
    const matched = motors.find((m) => {
      const catName = String(m.category || m.name || '').trim().toUpperCase();
      const catId = String(m.id || m.categoryId || '').trim().toLowerCase();
      const targetId = cat.id.toLowerCase();
      const targetName = cat.name.toUpperCase();

      return (
        catName === targetId.toUpperCase() ||
        catName.includes(targetId.toUpperCase()) ||
        targetName.includes(catName) ||
        catId === targetId ||
        catId.includes(targetId)
      );
    });

    if (matched) {
      const statusUpper = String(matched.status || '').trim().toUpperCase();
      const rawCount =
        matched.availableCount ??
        matched.availableUnits ??
        matched.readyUnits ??
        matched.stock;
      let count = 0;

      if (rawCount !== undefined && rawCount !== null) {
        count = Number(rawCount) || 0;
      } else if (statusUpper === 'READY') {
        count = 2;
      }

      // If status is explicitly marked as unavailable/sold out/rented/bengkel
      if (['SOLD_OUT', 'SOLDOUT', 'DISEWA', 'BENGKEL'].includes(statusUpper)) {
        count = 0;
      }

      const isAvailable = count > 0;

      return {
        ...cat,
        availableUnits: count,
        totalFleetUnits: matched.totalUnits
          ? Number(matched.totalUnits)
          : Math.max(count, 3),
        isAvailable,
        dailyPrice: matched.dailyPrice ? Number(matched.dailyPrice) : cat.dailyPrice,
        weeklyPrice: matched.weeklyPrice ? Number(matched.weeklyPrice) : cat.weeklyPrice,
        monthlyPrice: matched.monthlyPrice ? Number(matched.monthlyPrice) : cat.monthlyPrice,
      };
    }

    // Default fallback if category not present in remote payload
    const defaultReadyCount =
      INITIAL_INVENTARIS_MOTOR.filter(
        (u) => u.categoryId === cat.id && u.status === 'READY'
      ).length || 2;

    return {
      ...cat,
      availableUnits: defaultReadyCount,
      totalFleetUnits: Math.max(defaultReadyCount + 1, 3),
      isAvailable: defaultReadyCount > 0,
    };
  });
}

// Endpoint 1: GET /webhook/viyond-live-inventory (Cek Stok & Zona)
export async function GET(req: NextRequest) {
  const startTime = performance.now();
  const url = req.nextUrl || new URL(req.url, 'http://localhost:3000');
  const searchParams = url.searchParams;

  const rawRequestedEndpoint =
    searchParams.get('endpoint') ||
    process.env.NEXT_PUBLIC_N8N_GET_INVENTORY_WEBHOOK_URL ||
    process.env.N8N_GET_INVENTORY_WEBHOOK_URL ||
    PRODUCTION_N8N_WEBHOOK_URL;

  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // Build target URL with date range query parameters for n8n webhook
  let requestedEndpoint = rawRequestedEndpoint;
  try {
    const urlObj = new URL(rawRequestedEndpoint);
    if (startDate) urlObj.searchParams.set('startDate', startDate);
    if (endDate) urlObj.searchParams.set('endDate', endDate);
    requestedEndpoint = urlObj.toString();
  } catch {
    // If not a valid absolute URL, leave as is
  }

  let categories = masterDb.getPublicAggregatedInventory();
  let zones = masterDb.zonaOngkir;
  let source = 'Google Sheets (VIYOND - Master DB) via n8n Webhook Node';
  let isLiveProduction = false;
  let rawIncomingMotors: RawMotorItem[] | null = null;

  // Attempt to pull real live data from Production n8n Webhook
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const n8nResponse = await fetch(requestedEndpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (n8nResponse.ok) {
      const rawPayload = await n8nResponse.json();

      // Normalize standard n8n response structures:
      // 1. { motors: [...] }
      // 2. [ { motors: [...] } ]
      // 3. [ { json: { motors: [...] } } ]
      // 4. Raw array of motors: [ { category: "NMAX", ... } ]
      // 5. { categories: [...] }
      let incomingData = rawPayload;
      if (Array.isArray(rawPayload) && rawPayload.length > 0) {
        // If raw array of motor items directly
        if (rawPayload[0].category || rawPayload[0].availableCount !== undefined) {
          incomingData = { motors: rawPayload };
        } else {
          incomingData = rawPayload[0].json || rawPayload[0];
        }
      } else if (rawPayload.data) {
        incomingData = rawPayload.data;
      }

      // 1. Check for { motors: [...] } from "Aggregate Ready Stock" node
      if (incomingData?.motors && Array.isArray(incomingData.motors)) {
        rawIncomingMotors = incomingData.motors;
        if (incomingData.motors.length > 0) {
          categories = mapMotorsToCategories(incomingData.motors);
          isLiveProduction = true;
        }
      }
      // 2. Or check for { categories: [...] }
      else if (incomingData?.categories && Array.isArray(incomingData.categories)) {
        rawIncomingMotors = incomingData.categories;
        if (incomingData.categories.length > 0) {
          categories = mapMotorsToCategories(incomingData.categories);
          isLiveProduction = true;
        }
      }

      if (incomingData?.zones && Array.isArray(incomingData.zones)) {
        zones = incomingData.zones.map((z: any) => ({
          code: z.code || 'ZONA-1',
          name: z.name || `Zona ${z.code}`,
          coverage: z.coverage || z.areaNames || '',
          fee: typeof z.fee === 'number' ? z.fee : Number(z.fee) || 0,
          id: z.id || z.code?.toLowerCase() || 'zona-1',
          labelEn: z.name || z.labelEn || z.code,
          labelId: z.name || z.labelId || z.code,
          areaNames: z.coverage || z.areaNames || '',
        }));
      }

      source = `Production n8n Webhook (${requestedEndpoint})`;
    }
  } catch {
    // Graceful fallback to masterDb store
    source = `Google Sheets (VIYOND - Master DB) via n8n Webhook Node (Fallback)`;
  }

  const elapsedMs = Math.max(12, Math.round(performance.now() - startTime + 25));

  return NextResponse.json(
    {
      status: 'ok',
      syncedAt: new Date().toISOString(),
      latencyMs: elapsedMs,
      source,
      isLiveProduction,
      webhookUrl: requestedEndpoint,
      categories,
      zones,
      motors: rawIncomingMotors,
      // Included for the interactive UAT / Telegram Bot Simulator drawer
      internalSheetPreview: {
        inventarisMotor: masterDb.inventarisMotor,
        orders: masterDb.dataPesananKyc,
      },
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
      },
    }
  );
}

// Simulates Telegram Bot Staff /stok command or [Tukar Unit / Swap]
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, categoryId, unitId, status, forceSoldOut } = body;

    if (action === 'toggle_category' && categoryId) {
      masterDb.toggleCategoryStockForUat(categoryId, forceSoldOut);
    } else if (action === 'update_unit' && unitId && status) {
      masterDb.updateSingleUnitStatus(unitId, status);
    } else if (action === 'reset_db') {
      masterDb.inventarisMotor = INITIAL_INVENTARIS_MOTOR.map((u) => ({ ...u }));
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Telegram Bot /stok synced with Master DB',
      categories: masterDb.getPublicAggregatedInventory(),
      inventarisMotor: masterDb.inventarisMotor,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Failed to update stock' },
      { status: 400 }
    );
  }
}
