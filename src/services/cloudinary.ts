import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '../lib/constants';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? '';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? '';

export function isCloudinaryConfigured(): boolean {
  return CLOUD_NAME.length > 0 && UPLOAD_PRESET.length > 0;
}

export async function uploadImage(file: File): Promise<string> {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Image uploads are not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.'
    );
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    throw new Error('Please choose a JPG, PNG, WebP, or GIF image.');
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Images must be 8 MB or smaller.');
  }

  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', UPLOAD_PRESET);
  body.append('folder', 'uoh-archive');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body,
  });

  const payload = (await response.json()) as { secure_url?: string; error?: { message?: string } };

  if (!response.ok || !payload.secure_url) {
    throw new Error(payload.error?.message || 'Image upload failed. Please try again.');
  }

  return payload.secure_url;
}
