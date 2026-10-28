'use client';

import React, { useEffect, useState } from 'react';
import { useCamera } from '@/hooks/use-camera';
import { compressBase64Image, CompressedImageResult } from '@/lib/imageCompression';
import { X, Camera, RefreshCw, AlertCircle, Check } from 'lucide-react';
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

  if (!isOpen) return null;

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

  const handleConfirm = async () => {
    if (!previewDataUrl) return;
    setIsProcessing(true);
    try {
      const fileName = `${slotKey}_camera_${Date.now()}.jpg`;
      const compressed = await compressBase64Image(previewDataUrl, fileName);
      onCaptureComplete(slotKey, compressed);
      onClose();
    } catch {
      // Fallback
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-[32px] bg-[#081226] border border-blue-400/30 text-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-blue-400/20 bg-[#050b16]">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white truncate">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
            aria-label="Close camera"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewport / Preview */}
        <div className="relative aspect-[3/4] bg-black overflow-hidden flex items-center justify-center">
          {/* Flash animation */}
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
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Target Overlay */}
              <div className="absolute inset-8 rounded-2xl border-2 border-dashed border-white/40 pointer-events-none flex flex-col justify-between p-3">
                <div className="text-[10px] font-mono text-center bg-black/60 backdrop-blur-sm rounded-full py-0.5 px-3 mx-auto text-blue-200">
                  Align document within frame · Avoid glare & flash
                </div>
                <div className="text-[10px] font-mono text-center bg-black/60 backdrop-blur-sm rounded-full py-0.5 px-3 mx-auto text-blue-200">
                  Auto-compressed to &lt; 500 KB
                </div>
              </div>

              {isLoading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 text-xs text-blue-200">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                  <span>Accessing camera...</span>
                </div>
              )}

              {error && (
                <div className="absolute inset-6 bg-rose-950/90 border border-rose-500/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-rose-400" />
                  <div className="text-xs font-bold text-rose-200">
                    Camera Permission Error
                  </div>
                  <p className="text-[11px] text-rose-100/80 leading-relaxed">
                    {error}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startCamera(facingMode)}
                    className="mt-2 text-white border-white/30"
                  >
                    Retry Permission
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 bg-[#050b16] border-t border-blue-400/15 flex items-center justify-between gap-3">
          {previewDataUrl ? (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleRetake}
                disabled={isProcessing}
              >
                Retake
              </Button>
              <Button
                variant="success"
                className="flex-1 flex items-center gap-2"
                onClick={handleConfirm}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Use Photo</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="glass"
                size="icon"
                onClick={toggleFacingMode}
                disabled={isLoading || !stream}
                title="Switch Camera (Front / Back)"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>

              <button
                type="button"
                onClick={handleSnap}
                disabled={isLoading || !stream}
                className="w-16 h-16 rounded-full border-4 border-white bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-lg shadow-blue-600/40 disabled:opacity-50"
                aria-label="Capture photo"
              >
                <div className="w-12 h-12 rounded-full bg-white" />
              </button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-xs"
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
