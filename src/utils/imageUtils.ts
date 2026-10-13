// Downscale & JPEG-compress photos so they fit comfortably in localStorage (~5MB total)
const MAX_DIMENSION = 800;
const JPEG_QUALITY = 0.85;

interface ReadImageOptions {
  maxDimension?: number;
  // 'png' keeps transparency (logos); 'jpeg' is much smaller (photos)
  format?: 'jpeg' | 'png';
}

export function readImageAsDataUrl(
  file: File,
  { maxDimension = MAX_DIMENSION, format = 'jpeg' }: ReadImageOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('not-an-image'));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      // SVGs without width/height report 0x0; render them at the max size instead of blank
      const width = img.naturalWidth || maxDimension;
      const height = img.naturalHeight || maxDimension;
      const scale = Math.min(1, maxDimension / Math.max(width, height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('canvas-unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(format === 'png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', JPEG_QUALITY));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('image-load-failed'));
    };
    img.src = objectUrl;
  });
}
