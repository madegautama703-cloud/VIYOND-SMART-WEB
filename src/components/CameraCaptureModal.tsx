'use client';

import React, { useEffect, useState, useRef } from 'react';
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
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(initialFacingMode);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [flashActive, setFlashActive] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper untuk menghentikan seluruh track kamera secara aman
  const stopCameraTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      streamRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const activeVideoSrc = videoRef.current.srcObject as MediaStream;
      if (activeVideoSrc && typeof activeVideoSrc.getTracks === 'function') {
        activeVideoSrc.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {}
        });
      }
      videoRef.current.srcObject = null;
    }

    setStream(null);
    setIsLoading(false);
  };

  // 1. Inisialisasi navigator.mediaDevices.getUserMedia di dalam useEffect dengan Cleanup Function
  useEffect(() => {
    // Jika modal tidak terbuka, pastikan seluruh track kamera dalam keadaan mati
    if (!isOpen) {
      stopCameraTracks();
      return;
    }

    setPreviewDataUrl(null);
    setIsLoading(true);
    setError(null);

    let activeStream: MediaStream | null = null;
    let isCancelled = false;

    const startCamera = async () => {
      try {
        if (
          typeof navigator === 'undefined' ||
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {
          throw new Error(
            'Browser atau protokol ini tidak mendukung akses kamera (pastikan website dibuka melalui HTTPS atau localhost).'
          );
        }

        let newStream: MediaStream;
        try {
          newStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: facingMode },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        } catch (initialErr: unknown) {
          // Fallback ke resolusi standar jika perangkat menolak ideal constraints
          const isConstraintErr =
            initialErr &&
            typeof initialErr === 'object' &&
            'name' in initialErr &&
            ((initialErr as { name: string }).name === 'OverconstrainedError' ||
              (initialErr as { name: string }).name === 'ConstraintNotSatisfiedError');

          if (isConstraintErr) {
            newStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false,
            });
          } else {
            throw initialErr;
          }
        }

        // PENCEGAHAN MEMORY LEAK: Jika pengguna sudah menutup modal/pindah halaman sebelum getUserMedia selesai
        if (isCancelled) {
          newStream.getTracks().forEach((track) => {
            try {
              track.stop();
            } catch {}
          });
          return;
        }

        activeStream = newStream;
        streamRef.current = newStream;
        setStream(newStream);

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current.onloadedmetadata = () => {
            if (!isCancelled) {
              setIsLoading(false);
              videoRef.current?.play().catch(() => {});
            }
          };
          videoRef.current.play().catch(() => {});
        }

        // Safety timeout agar tidak stuck loading
        setTimeout(() => {
          if (!isCancelled) {
            setIsLoading(false);
          }
        }, 1200);
      } catch (err: unknown) {
        if (isCancelled) return;

        let userFriendlyMessage =
          'Gagal mengakses kamera. Silakan pilih opsi unggah manual dari galeri file.';

        if (err && typeof err === 'object' && 'name' in err) {
          const errName = (err as { name: string }).name;
          if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
            userFriendlyMessage =
              'Akses kamera ditolak (NotAllowedError). Mohon izinkan akses kamera di pengaturan browser Anda, atau gunakan tombol unggah manual dari galeri di bawah ini.';
          } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
            userFriendlyMessage =
              'Perangkat kamera tidak ditemukan (NotFoundError). Silakan gunakan tombol unggah foto manual dari galeri.';
          } else if (errName === 'NotReadableError' || errName === 'TrackStartError') {
            userFriendlyMessage =
              'Kamera sedang digunakan aplikasi lain (NotReadableError). Tutup aplikasi lain atau gunakan opsi unggah manual.';
          } else if (
            errName === 'OverconstrainedError' ||
            errName === 'ConstraintNotSatisfiedError'
          ) {
            userFriendlyMessage =
              'Resolusi atau mode kamera tidak didukung (OverconstrainedError). Silakan gunakan tombol unggah manual.';
          } else if (errName === 'SecurityError') {
            userFriendlyMessage =
              'Akses kamera diblokir oleh kebijakan keamanan (SecurityError). Pastikan website dibuka via HTTPS atau gunakan unggah foto manual.';
          } else if (err instanceof Error && err.message) {
            userFriendlyMessage = `${err.message}`;
          }
        } else if (err instanceof Error && err.message) {
          userFriendlyMessage = err.message;
        }

        setError(userFriendlyMessage);
        setIsLoading(false);
      }
    };

    startCamera();

    // =========================================================================
    // FUNGSI PEMBERSIHAN (CLEANUP FUNCTION) DI DALAM useEffect
    // Mengambil objek stream video dan menjalankan stream.getTracks().forEach(track => track.stop())
    // Saat komponen di-unmount, modal ditutup, atau facingMode berganti.
    // =========================================================================
    return () => {
      isCancelled = true;

      // 1. Matikan seluruh track pada activeStream lokal sesi ini
      if (activeStream) {
        activeStream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {}
        });
        activeStream = null;
      }

      // 2. Matikan seluruh track pada streamRef
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {}
        });
        streamRef.current = null;
      }

      // 3. Putus sambungan srcObject pada videoRef
      if (videoRef.current && videoRef.current.srcObject) {
        const vidStream = videoRef.current.srcObject as MediaStream;
        if (vidStream && typeof vidStream.getTracks === 'function') {
          vidStream.getTracks().forEach((track) => {
            try {
              track.stop();
            } catch {}
          });
        }
        videoRef.current.srcObject = null;
      }

      setStream(null);
      setIsLoading(false);
    };
  }, [isOpen, facingMode]);

  // Sinkronisasi ulang srcObject ke videoRef jika elemen video ter-render ulang
  useEffect(() => {
    if (videoRef.current && stream) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
      }
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  if (!isOpen) return null;

  // Tangkap foto dari video stream kamera
  const handleSnap = () => {
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 150);

    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    if (dataUrl) {
      setPreviewDataUrl(dataUrl);
      stopCameraTracks();
    }
  };

  const handleRetake = () => {
    setPreviewDataUrl(null);
    setFacingMode((prev) => prev); // memicu re-init jika diperlukan
  };

  // Konfirmasi foto yang diambil dari kamera
  const handleConfirm = async () => {
    if (!previewDataUrl) return;
    setIsProcessing(true);
    try {
      const fileName = `${slotKey}_camera_${Date.now()}.jpg`;
      const compressed = await compressBase64Image(previewDataUrl, fileName);
      onCaptureComplete(slotKey, compressed);
      stopCameraTracks();
      onClose();
    } catch {
      stopCameraTracks();
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  // Fallback Manual: Upload File / Galeri jika kamera bermasalah atau pengguna ingin memilih file
  const handleManualFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const compressed = await compressImageClientSide(file);
      onCaptureComplete(slotKey, compressed);
      stopCameraTracks();
      onClose();
    } catch (err) {
      console.error('Failed to compress selected file:', err);
    } finally {
      setIsProcessing(false);
      if (e.target) e.target.value = '';
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleModalClose = () => {
    stopCameraTracks();
    onClose();
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
            onClick={handleModalClose}
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
            /* Tampilan Error Handling yang Jelas & Tidak Stuck Loading */
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

              {/* Tombol Fallback Manual Sangat Jelas */}
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
                  onClick={() => {
                    setError(null);
                    setFacingMode((prev) => prev);
                  }}
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
              {/* Element Video Stream */}
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
                onClick={handleModalClose}
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
