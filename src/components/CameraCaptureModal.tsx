'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useCamera } from '@/hooks/use-camera';
import {
  compressBase64Image,
  compressImageClientSide,
  CompressedImageResult,
} from '@/lib/imageCompression';
import {
  X,
  Camera,
  RefreshCw,
  AlertCircle,
  Check,
  Upload,
  FolderOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  slotKey: string;
  initialFacingMode?: 'user' | 'environment';
  onCaptureComplete: (slotKey: string, result: CompressedImageResult) => void;
}

export function CameraCaptureModal({
  isOpen,
  onClose,
  title,
  slotKey,
  initialFacingMode = 'environment',
  onCaptureComplete,
}: CameraCaptureModalProps) {
  const {
    videoRef,
    stream,
    error,
    isLoading,
    facingMode,
    startCamera,
    stopCamera,
    toggleFacingMode,
    capturePhoto,
  } = useCamera();

  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [flashActive, setFlashActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Inisialisasi dan Binding Video Stream di dalam useEffect
  useEffect(() => {
    if (isOpen) {
      setPreviewDataUrl(null);
      startCamera(initialFacingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, initialFacingMode, startCamera, stopCamera]);

  // Pastikan stream ditempelkan ke videoRef.current.srcObject saat stream aktif
  useEffect(() => {
    if (videoRef.current && stream) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
      }
      videoRef.current.play().catch((playErr) => {
        console.warn('Video auto-play prevented or interrupted:', playErr);
      });
    }
  }, [stream, videoRef]);

  if (!isOpen) return null;

  // Tangkap foto dari video stream kamera
  const handleSnap = () => {
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 150);

    const dataUrl = capturePhoto();
    if (dataUrl) {
      setPreviewDataUrl(dataUrl);
      stopCamera();
    }
  };

  const handleRetake = () => {
    setPreviewDataUrl(null);
    startCamera(facingMode);
  };

  // Konfirmasi foto yang diambil dari kamera
  const handleConfirm = async () => {
    if (!previewDataUrl) return;
    setIsProcessing(true);
    try {
      const fileName = `${slotKey}_camera_${Date.now()}.jpg`;
      const compressed = await compressBase64Image(previewDataUrl, fileName);
      onCaptureComplete(slotKey, compressed);
      stopCamera();
      onClose();
    } catch {
      stopCamera();
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Fallback Manual: Upload File / Galeri jika kamera bermasalah atau pengguna ingin memilih file
  const handleManualFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const compressed = await compressImageClientSide(file);
      onCaptureComplete(slotKey, compressed);
      stopCamera();
      onClose();
    } catch (err) {
      console.error('Failed to compress selected file:', err);
    } finally {
      setIsProcessing(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Hidden file input untuk fallback manual (Galeri / Dokumen) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleManualFileSelect}
      />

      <div className="relative w-full max-w-md rounded-[32px] bg-[#081226] border border-blue-400/30 text-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-blue-400/20 bg-[#050b16]">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white truncate">{title}</h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
            aria-label="Tutup kamera"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewport / Preview Container */}
        <div className="relative aspect-[3/4] bg-black overflow-hidden flex items-center justify-center">
          {/* Flash animasi saat shutter ditekan */}
          {flashActive && (
            <div className="absolute inset-0 bg-white z-20 pointer-events-none" />
          )}

          {previewDataUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={previewDataUrl}
              alt="Snapshot"
              className="w-full h-full object-cover"
            />
          ) : error ? (
            /* 2. Tampilan Error Handling yang Jelas & Tidak Stuck Loading */
            <div className="absolute inset-3 sm:inset-4 bg-[#0a162e]/95 border border-rose-500/40 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3 z-30 shadow-2xl backdrop-blur-md">
              <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-400/30 flex items-center justify-center text-rose-300">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="text-base font-bold text-white">
                Kamera Tidak Dapat Dibuka
              </div>
              <p className="text-xs text-rose-100/90 leading-relaxed max-w-sm px-2">
                {error}
              </p>

              {/* 3. Tombol Fallback Manual Sangat Jelas */}
              <div className="w-full pt-2 space-y-2">
                <Button
                  variant="default"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>Upload File Manual / Pilih dari Galeri</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startCamera(facingMode)}
                  disabled={isProcessing}
                  className="w-full text-xs text-blue-200 border-white/20 hover:bg-white/10 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  <span>Coba Buka Kamera Lagi (Retry)</span>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* 1. Element Video Stream */}
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Target Overlay Frame */}
              <div className="absolute inset-6 sm:inset-8 rounded-2xl border-2 border-dashed border-white/40 pointer-events-none flex flex-col justify-between p-3">
                <div className="text-[10px] font-mono text-center bg-black/60 backdrop-blur-sm rounded-full py-0.5 px-3 mx-auto text-blue-200">
                  Posisikan dokumen dalam bingkai · Hindari pantulan cahaya
                </div>
                <div className="text-[10px] font-mono text-center bg-black/60 backdrop-blur-sm rounded-full py-0.5 px-3 mx-auto text-blue-200">
                  Kompresi otomatis &lt; 500 KB
                </div>
              </div>

              {/* State Loading: Menghubungkan Kamera + Tombol Pintas Fallback */}
              {isLoading && (
                <div className="absolute inset-0 bg-[#050b16]/85 backdrop-blur-sm flex flex-col items-center justify-center gap-2.5 text-xs text-blue-200 z-20 p-4 text-center">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                  <div className="font-semibold text-white">
                    Menghubungkan ke kamera...
                  </div>
                  <div className="text-[11px] text-blue-200/70">
                    Mohon izinkan akses kamera jika muncul permintaan browser
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 text-[11px] font-semibold text-cyan-300 hover:text-cyan-200 underline cursor-pointer"
                  >
                    Kamera lambat? Klik di sini untuk Upload File Manual
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Controls Bar */}
        <div className="p-4 bg-[#050b16] border-t border-blue-400/15 flex items-center justify-between gap-3">
          {previewDataUrl ? (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleRetake}
                disabled={isProcessing}
              >
                Foto Ulang
              </Button>
              <Button
                variant="success"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleConfirm}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Gunakan Foto</span>
              </Button>
            </>
          ) : error ? (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
              >
                Batal
              </Button>
              <Button
                variant="default"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 font-bold"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>Pilih File</span>
              </Button>
            </>
          ) : (
            <>
              {/* Tombol Balik Kamera (Front / Back) */}
              <Button
                variant="glass"
                size="icon"
                onClick={toggleFacingMode}
                disabled={isLoading || !stream}
                title="Ganti Kamera (Depan / Belakang)"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>

              {/* Tombol Shutter Ambil Foto */}
              <button
                type="button"
                onClick={handleSnap}
                disabled={isLoading || !stream}
                className="w-16 h-16 rounded-full border-4 border-white bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-lg shadow-blue-600/40 disabled:opacity-40"
                aria-label="Ambil foto"
              >
                <div className="w-12 h-12 rounded-full bg-white" />
              </button>

              {/* Tombol Pintas Pilih dari Galeri */}
              <Button
                variant="glass"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="flex items-center gap-1.5 text-xs text-blue-200 hover:text-white"
                title="Pilih foto dari galeri HP / file manual"
              >
                <FolderOpen className="w-4 h-4 text-cyan-300" />
                <span className="hidden sm:inline">Galeri</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
