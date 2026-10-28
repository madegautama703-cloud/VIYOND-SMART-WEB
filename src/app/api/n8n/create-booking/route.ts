import { NextRequest, NextResponse } from 'next/server';

const PRODUCTION_CREATE_BOOKING_WEBHOOK_URL =
  process.env.N8N_CREATE_BOOKING_WEBHOOK_URL ||
  'https://n8n.srv2075779.hstgr.cloud/webhook/viyond-create-booking';

export async function POST(req: NextRequest) {
  const startTime = performance.now();
  let payload: Record<string, unknown> = {};

  try {
    payload = await req.json();
  } catch (err) {
    console.error('[API /api/n8n/create-booking] Failed to parse request JSON:', err);
    return NextResponse.json(
      { success: false, message: 'Invalid JSON request payload' },
      { status: 400 }
    );
  }

  // Strict Validation: prevent incomplete or test-only payloads (e.g. only unitId) from reaching n8n
  const missingFields: string[] = [];
  if (!payload.customerName) missingFields.push('customerName');
  if (!payload.whatsapp) missingFields.push('whatsapp');
  if (!payload.startDate) missingFields.push('startDate');
  if (!payload.endDate) missingFields.push('endDate');
  if (!payload.unitId) missingFields.push('unitId');
  if (!payload.category) missingFields.push('category');
  if (!payload.plate) missingFields.push('plate');
  if (!payload.zone) missingFields.push('zone');
  if (!payload.paymentMethod) missingFields.push('paymentMethod');
  if (
    !Array.isArray(payload.kycFiles) ||
    payload.kycFiles.length !== 4 ||
    payload.kycFiles.some((f) => !f || typeof f !== 'string' || f.trim().length === 0)
  ) {
    missingFields.push('kycFiles (requires 4 valid file names)');
  }

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

  // 1. Log incoming booking request in console
  console.log('[API /api/n8n/create-booking] === INCOMING BOOKING REQUEST ===');
  console.log('[API /api/n8n/create-booking] Target n8n Webhook:', PRODUCTION_CREATE_BOOKING_WEBHOOK_URL);
  console.log('[API /api/n8n/create-booking] Payload:', JSON.stringify(payload, null, 2));

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

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

    let responseData: unknown = null;
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

    // 2. Log n8n webhook response in console
    console.log('[API /api/n8n/create-booking] === N8N WEBHOOK RESPONSE ===');
    console.log('[API /api/n8n/create-booking] Latency:', `${elapsedMs}ms`);
    console.log('[API /api/n8n/create-booking] Status:', n8nResponse.status);
    console.log('[API /api/n8n/create-booking] Data:', JSON.stringify(responseData, null, 2));

    if (!n8nResponse.ok) {
      const errorMessage =
        typeof responseData === 'object' && responseData && 'message' in responseData
          ? String((responseData as { message: unknown }).message)
          : `n8n webhook error (HTTP ${n8nResponse.status})`;

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          status: n8nResponse.status,
          raw: responseData,
        },
        { status: n8nResponse.status }
      );
    }

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    const elapsedMs = Math.round(performance.now() - startTime);
    console.error('[API /api/n8n/create-booking] Network / Forwarding Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reach n8n create-booking webhook',
        elapsedMs,
      },
      { status: 502 }
    );
  }
}
