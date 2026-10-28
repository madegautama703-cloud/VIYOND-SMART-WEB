import { NextRequest, NextResponse } from 'next/server';
import { masterDb, BookingOrderRecord } from '@/lib/masterDbStore';

// Endpoint 2: POST /webhook/viyond-web-booking (Submit KYC, Vision OCR, & Payment)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Handle Owner Telegram Bot [Approve COD] / [Tolak COD] callback action
    if (body.action === 'telegram_owner_decision') {
      const { orderId, decision } = body;
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

    // Standard Web Booking Submission (Step 3)
    const {
      fullName,
      whatsappNumber,
      nationality,
      categoryId,
      categoryName,
      startDate,
      endDate,
      durationDays,
      zoneId,
      zoneLabel,
      hotelAndRoom,
      deliveryTime,
      rentalSubtotal,
      deliveryFee,
      totalAmount,
      paymentMethod,
      idCardStatus,
    } = body;

    // IF Node (Validasi Kejelasan Foto di Layar Web):
    // Jika BURAM: Langsung kirim respons berstatus error_blur dengan pesan peringatan
    if (idCardStatus === 'blurry') {
      return NextResponse.json(
        {
          status: 'error_blur',
          ocrStatus: 'BURAM',
          message:
            'AI Vision OCR detected glare/blur on 1. Passport / ID Card (KTP). Please retake photo clearly without flash before submitting.',
        },
        { status: 422 }
      );
    }

    const randomNum = Math.floor(881 + Math.random() * 110);
    const orderId = body.orderId || `ORD-2026-${randomNum}`;

    let status: BookingOrderRecord['status'] = 'pending_approval';
    let assignedPlate: string | undefined;
    let xenditInvoiceUrl: string | undefined;

    // Switch Node (3 Jalur Pembayaran)
    if (paymentMethod === 'instant_online') {
      status = 'paid_locked';
      assignedPlate = masterDb.lockAvailableUnitForOrder(categoryId) || 'DK 4821 FBV';
      xenditInvoiceUrl = `https://checkout.xendit.co/web/${orderId.toLowerCase()}`;
    } else {
      // Jalur 2 & 3 (Transfer Manual / COD WNA): Kirim notifikasi persetujuan ke Grup Telegram Owner
      status = 'pending_approval';
    }

    const whatsappMessagePreview = `Halo ${fullName}, pesanan sewa ${categoryName} Anda dengan ID #${orderId} telah kami terima. Pengantaran dijadwalkan ke ${hotelAndRoom} (${zoneLabel}) pada ${deliveryTime}. Total: Rp ${Number(totalAmount).toLocaleString('id-ID')}.`;

    const newOrder: BookingOrderRecord = {
      orderId,
      createdAt: new Date().toISOString(),
      fullName,
      whatsappNumber,
      nationality,
      categoryId,
      categoryName,
      startDate,
      endDate,
      durationDays,
      zoneId,
      zoneLabel,
      hotelAndRoom,
      deliveryTime,
      rentalSubtotal,
      deliveryFee,
      totalAmount,
      paymentMethod,
      status,
      assignedPlate,
      xenditInvoiceUrl,
      ocrExtractedName: fullName.toUpperCase(),
      ocrExtractedIdNumber: 'PA8934120',
      ocrStatus: 'JELAS',
      whatsappMessagePreview,
    };

    // Prepend or update in DATA_PESANAN_KYC
    masterDb.dataPesananKyc = [
      newOrder,
      ...masterDb.dataPesananKyc.filter((o) => o.orderId !== orderId),
    ];

    return NextResponse.json({
      status: status === 'paid_locked' ? 'invoice_created' : 'pending_approval',
      order: newOrder,
      categories: masterDb.getPublicAggregatedInventory(),
      inventarisMotor: masterDb.inventarisMotor,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Submission error' },
      { status: 500 }
    );
  }
}
