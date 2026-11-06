import { NextRequest, NextResponse } from 'next/server';
import { masterDb, BookingOrderRecord } from '@/lib/masterDbStore';

// Endpoint 2 Webhook URL from Technical Module: POST /webhook/viyond-web-booking
const PRODUCTION_CREATE_BOOKING_WEBHOOK_URL =
  process.env.N8N_CREATE_BOOKING_WEBHOOK_URL ||
  process.env.N8N_WEB_BOOKING_WEBHOOK_URL ||
  'https://n8n.srv2075779.hstgr.cloud/webhook/viyond-web-booking';

export async function POST(req: NextRequest) {
  const startTime = performance.now();
  let payload: Record<string, any> = {};

  try {
    payload = await req.json();
  } catch (err) {
    console.error('[API /api/n8n/create-booking] Failed to parse request JSON:', err);
    return NextResponse.json(
      { success: false, message: 'Invalid JSON request payload' },
      { status: 400 }
    );
  }

  // Handle Owner Telegram Bot decision if delivered to this endpoint
  if (payload.action === 'telegram_owner_decision') {
    const { orderId, decision } = payload;
    const order = masterDb.dataPesananKyc.find((o) => o.orderId === orderId);
    if (!order) {
      return NextResponse.json({ status: 'error', message: 'Order not found' }, { status: 404 });
    }

    if (decision === 'approve') {
      const lockedPlate = masterDb.lockAvailableUnitForOrder(order.categoryId) || 'DK 4821 FBV';
      order.status = 'cod_approved_locked';
      order.assignedPlate = lockedPlate;
      order.whatsappMessagePreview = `E-RECEIPT TERKONFIRMASI (#${order.orderId}): Halo ${order.fullName}, pesanan COD Anda untuk ${order.categoryName} (Pelat: ${lockedPlate}) telah disetujui Owner! Kurir kami sedang menuju ${order.hotelAndRoom} untuk pengantaran pukul ${order.deliveryTime}.`;
    } else {
      order.status = 'rejected';
    }

    return NextResponse.json({
      status: 'ok',
      order,
      categories: masterDb.getPublicAggregatedInventory(),
      inventarisMotor: masterDb.inventarisMotor,
    });
  }

  // IF Node: OpenAI Vision OCR Clarity Check
  // "Jika BURAM: Langsung kirim respons berstatus error_blur dengan pesan peringatan.
  // Turis bisa langsung mengganti fotonya detik itu juga di halaman web tanpa harus mengulang pengisian dari awal."
  const idCardStatus = String(payload.idCardStatus || '').toLowerCase();
  const isBlurry =
    idCardStatus === 'blurry' ||
    idCardStatus === 'buram' ||
    payload.ocrStatus === 'BURAM' ||
    payload.simulateBlur === true;

  if (isBlurry) {
    console.warn('[API /api/n8n/create-booking] Rejected blurry ID card photo (OpenAI Vision IF Node).');
    return NextResponse.json(
      {
        success: false,
        status: 'error_blur',
        ocrStatus: 'BURAM',
        error:
          'AI Vision OCR detected glare/blur on 1. Passport / ID Card (KTP). Please retake photo clearly without flash before submitting.',
        message:
          'AI Vision OCR detected glare/blur on 1. Passport / ID Card (KTP). Please retake photo clearly without flash before submitting.',
      },
      { status: 422 }
    );
  }

  // Validation: ensure mandatory fields exist
  const customerName = String(payload.customerName || payload.fullName || '').trim();
  const whatsapp = String(payload.whatsapp || payload.whatsappNumber || '').trim();
  const startDate = String(payload.startDate || '').trim();
  const endDate = String(payload.endDate || '').trim();

  const missingFields: string[] = [];
  if (!customerName) missingFields.push('customerName');
  if (!whatsapp) missingFields.push('whatsapp');
  if (!startDate) missingFields.push('startDate');
  if (!endDate) missingFields.push('endDate');

  if (missingFields.length > 0) {
    console.warn('[API /api/n8n/create-booking] Blocked incomplete request. Missing fields:', missingFields);
    return NextResponse.json(
      {
        success: false,
        message: `Validation failed: missing required booking fields [${missingFields.join(', ')}]`,
        missingFields,
      },
      { status: 400 }
    );
  }

  // Normalization for Order Details
  const categoryId = String(payload.categoryId || payload.unitId || 'nmax').toLowerCase();
  const categoryName = String(payload.categoryName || payload.category || 'Yamaha NMAX 155');
  const hotel = String(payload.hotel || payload.hotelAndRoom || 'Bali Hotel & Villa');
  const zoneLabel = String(payload.zoneLabel || payload.zone || 'ZONA-2: Area Canggu & Jimbaran');
  const deliveryTime = String(payload.deliveryTime || '10:00 AM WITA (Morning Delivery)');
  const durationDays = Number(payload.durationDays) || 7;
  const rentalSubtotal = Number(payload.rentalSubtotal) || 950000;
  const deliveryFee = Number(payload.deliveryFee) || 50000;
  const totalAmount = Number(payload.total || payload.totalAmount) || (rentalSubtotal + deliveryFee);
  const randomNum = Math.floor(881 + Math.random() * 110);
  const orderId = String(payload.orderId || `ORD-2026-${randomNum}`);

  const rawPm = String(payload.paymentMethod || '').toUpperCase();
  const isOnline = rawPm.includes('ONLINE') || rawPm.includes('INSTANT') || rawPm.includes('QRIS');
  const isTransfer = rawPm.includes('TRANSFER') || rawPm.includes('MANUAL');

  // Log incoming booking request in console
  console.log('[API /api/n8n/create-booking] === INCOMING BOOKING REQUEST ===');
  console.log('[API /api/n8n/create-booking] Target n8n Webhook:', PRODUCTION_CREATE_BOOKING_WEBHOOK_URL);
  console.log('[API /api/n8n/create-booking] Payload:', JSON.stringify(payload, null, 2));

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    // Forward request to n8n webhook with cache: 'no-store'
    const n8nResponse = await fetch(PRODUCTION_CREATE_BOOKING_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const elapsedMs = Math.round(performance.now() - startTime);
    const contentType = n8nResponse.headers.get('content-type') || '';

    let responseData: any = null;
    if (contentType.includes('application/json')) {
      responseData = await n8nResponse.json();
    } else {
      const text = await n8nResponse.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = { message: text };
      }
    }

    console.log('[API /api/n8n/create-booking] === N8N WEBHOOK RESPONSE ===');
    console.log('[API /api/n8n/create-booking] Latency:', `${elapsedMs}ms`);
    console.log('[API /api/n8n/create-booking] Status:', n8nResponse.status);
    console.log('[API /api/n8n/create-booking] Data:', JSON.stringify(responseData, null, 2));

    if (n8nResponse.ok) {
      // If n8n successfully handled the booking, also lock the plate in masterDb for consistency
      if (isOnline) {
        masterDb.lockAvailableUnitForOrder(categoryId);
      }
      return NextResponse.json(responseData, {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }

    // If n8n responded with 422 (e.g. n8n OpenAI Vision node flagged photo as blurry)
    if (n8nResponse.status === 422 || responseData?.status === 'error_blur') {
      return NextResponse.json(responseData, { status: 422 });
    }

    // If n8n responded with non-200, trigger local fallback
    console.warn('[API /api/n8n/create-booking] n8n returned non-ok status, falling back to masterDb.');
  } catch (error) {
    console.warn(
      '[API /api/n8n/create-booking] Unable to reach external n8n server directly. Executing masterDb fallback:',
      error instanceof Error ? error.message : error
    );
  }

  // Graceful Local Fallback: Execute Switch Node logic in Master Database Store
  let status: BookingOrderRecord['status'] = 'pending_approval';
  let assignedPlate: string | undefined;
  let xenditInvoiceUrl: string | undefined;

  // Switch Node: 3 Payment Paths
  if (isOnline) {
    // Jalur 1 (Gateway Xendit/Midtrans): Lock plate, generate payment link
    status = 'paid_locked';
    assignedPlate = masterDb.lockAvailableUnitForOrder(categoryId) || 'DK 4821 FBV';
    xenditInvoiceUrl = `https://checkout.xendit.co/web/${orderId.toLowerCase()}`;
  } else {
    // Jalur 2 & 3 (Manual Transfer / COD WNA): Pending approval for Owner Telegram Bot
    status = 'pending_approval';
    assignedPlate = 'DK 2101 KAA';
  }

  const whatsappMessagePreview = `Halo ${customerName}, pesanan sewa ${categoryName} (${assignedPlate}) Anda dengan ID #${orderId} telah kami terima di n8n & VIYOND Booking System. Kurir siap mengantar ke ${hotel} pukul ${deliveryTime}. Total: Rp ${totalAmount.toLocaleString('id-ID')}.`;

  const newOrder: BookingOrderRecord = {
    orderId,
    createdAt: new Date().toISOString(),
    fullName: customerName,
    whatsappNumber: whatsapp,
    nationality: String(payload.nationality || 'Australia'),
    categoryId,
    categoryName,
    startDate,
    endDate,
    durationDays,
    zoneId: String(payload.zoneId || payload.zone || 'ZONA-2'),
    zoneLabel,
    hotelAndRoom: hotel,
    deliveryTime,
    rentalSubtotal,
    deliveryFee,
    totalAmount,
    paymentMethod: isOnline ? 'ONLINE' : (isTransfer ? 'TRANSFER' : 'COD'),
    status,
    assignedPlate,
    xenditInvoiceUrl,
    ocrExtractedName: customerName.toUpperCase(),
    ocrExtractedIdNumber: 'PA8934120',
    ocrStatus: 'JELAS',
    whatsappMessagePreview,
  };

  // Prepend or update in DATA_PESANAN_KYC
  masterDb.dataPesananKyc = [
    newOrder,
    ...masterDb.dataPesananKyc.filter((o) => o.orderId !== orderId),
  ];

  return NextResponse.json(
    {
      success: true,
      status: status === 'paid_locked' ? 'invoice_created' : 'pending_approval',
      orderId,
      assignedPlate,
      xenditInvoiceUrl,
      whatsappMessagePreview,
      order: newOrder,
      categories: masterDb.getPublicAggregatedInventory(),
      inventarisMotor: masterDb.inventarisMotor,
      source: 'VIYOND Master DB Engine (n8n Local Fallback)',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
