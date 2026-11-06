'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isCancelledRef = useRef<boolean>(false);

  // Stop camera tracks safely and clear video element
  const stopCamera = useCallback(() => {
    isCancelledRef.current = true;
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
  }, []);

  const startCamera = useCallback(
    async (mode: 'user' | 'environment' = 'environment') => {
      isCancelledRef.current = false;
      setIsLoading(true);
      setError(null);

      // Stop existing stream tracks first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {}
        });
        streamRef.current = null;
      }
      setStream(null);

      try {
        if (
          typeof navigator === 'undefined' ||
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {
          throw new Error(
            'Browser atau koneksi ini tidak mendukung akses kamera (pastikan website dibuka melalui HTTPS atau localhost).'
          );
        }

        let newStream: MediaStream;
        try {
          newStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: mode },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        } catch (initialErr: unknown) {
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

        // Memory leak check: if unmounted while getUserMedia was resolving
        if (isCancelledRef.current) {
          newStream.getTracks().forEach((track) => {
            try {
              track.stop();
            } catch {}
          });
          return;
        }

        streamRef.current = newStream;
        setStream(newStream);
        setFacingMode(mode);

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current.onloadedmetadata = () => {
            if (!isCancelledRef.current) {
              setIsLoading(false);
              videoRef.current?.play().catch(() => {});
            }
          };
          videoRef.current.play().catch(() => {});
        }

        setTimeout(() => {
          if (!isCancelledRef.current) {
            setIsLoading(false);
          }
        }, 1200);
      } catch (err: unknown) {
        if (isCancelledRef.current) return;

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
    },
    []
  );

  const toggleFacingMode = useCallback(() => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  }, [facingMode, startCamera]);

  const capturePhoto = useCallback((): string | null => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    return dataUrl;
  }, []);

  // Sync stream to video element whenever stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
      }
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  // Clean up tracks when hook unmounts
  useEffect(() => {
    return () => {
      isCancelledRef.current = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {}
        });
        streamRef.current = null;
      }
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
    };
  }, []);

  return {
    videoRef,
    stream,
    error,
    isLoading,
    facingMode,
    startCamera,
    stopCamera,
    toggleFacingMode,
    capturePhoto,
  };
}
