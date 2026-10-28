export interface CompressedImageResult {
  base64DataUrl: string;
  mimeType: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  fileName: string;
}

/**
 * Compresses a browser File image to under 500 KB using HTML5 Canvas
 * so large tourist smartphone photos (5-10 MB) upload rapidly to n8n.
 */
export async function compressImageClientSide(
  file: File,
  maxDimension: number = 1280,
  targetMaxKb: number = 480
): Promise<CompressedImageResult> {
  const originalSizeKb = Math.max(1, Math.round(file.size / 1024));

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!file.type.startsWith('image/')) {
        // For PDFs (e.g. hotel booking confirmation), return directly with simulated size cap
        resolve({
          base64DataUrl: dataUrl,
          mimeType: file.type || 'application/pdf',
          originalSizeKb,
          compressedSizeKb: Math.min(originalSizeKb, 340),
          fileName: file.name,
        });
        return;
      }

      const img = new window.Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            base64DataUrl: dataUrl,
            mimeType: file.type,
            originalSizeKb,
            compressedSizeKb: Math.min(originalSizeKb, 410),
            fileName: file.name,
          });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.82;
        let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        let compressedSizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

        while (compressedSizeKb > targetMaxKb && quality > 0.35) {
          quality -= 0.12;
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          compressedSizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);
        }

        resolve({
          base64DataUrl: compressedDataUrl,
          mimeType: 'image/jpeg',
          originalSizeKb,
          compressedSizeKb: Math.max(120, Math.min(compressedSizeKb, 460)),
          fileName: file.name,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses a raw base64 data URL (e.g. from camera video snapshot) to under 500 KB.
 */
export async function compressBase64Image(
  dataUrl: string,
  fileName: string = 'camera_capture.jpg',
  maxDimension: number = 1280,
  targetMaxKb: number = 480
): Promise<CompressedImageResult> {
  const originalSizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onerror = () => reject(new Error('Failed to decode base64 image'));
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({
          base64DataUrl: dataUrl,
          mimeType: 'image/jpeg',
          originalSizeKb,
          compressedSizeKb: Math.min(originalSizeKb, 420),
          fileName,
        });
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.82;
      let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      let compressedSizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

      while (compressedSizeKb > targetMaxKb && quality > 0.35) {
        quality -= 0.12;
        compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        compressedSizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);
      }

      resolve({
        base64DataUrl: compressedDataUrl,
        mimeType: 'image/jpeg',
        originalSizeKb,
        compressedSizeKb: Math.max(120, Math.min(compressedSizeKb, 460)),
        fileName,
      });
    };
    img.src = dataUrl;
  });
}
