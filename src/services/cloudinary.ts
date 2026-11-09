import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  VIDEO_TOO_LARGE_MESSAGE,
} from '../lib/constants';

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

  return postCloudinary(file, 'image');
}

export async function uploadMedia(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Media uploads are not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.'
    );
  }

  const video = ALLOWED_VIDEO_TYPES.includes(file.type as (typeof ALLOWED_VIDEO_TYPES)[number]);
  const image = ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number]);

  if (!video && !image) {
    throw new Error('Please choose a JPG, PNG, WebP, GIF, MP4, WebM, or MOV file.');
  }

  if (video && file.size > MAX_VIDEO_BYTES) {
    throw new Error(VIDEO_TOO_LARGE_MESSAGE);
  }

  if (image && file.size > MAX_IMAGE_BYTES) {
    throw new Error('Images must be 8 MB or smaller.');
  }

  return postCloudinary(file, video ? 'video' : 'image', onProgress);
}

function postCloudinary(
  file: File,
  resource: 'image' | 'video',
  onProgress?: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', UPLOAD_PRESET);
    body.append('folder', 'uoh-archive');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resource}/upload`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      try {
        const payload = JSON.parse(xhr.responseText) as {
          secure_url?: string;
          error?: { message?: string };
        };
        if (xhr.status >= 200 && xhr.status < 300 && payload.secure_url) {
          onProgress?.(100);
          resolve(payload.secure_url);
          return;
        }
        reject(new Error(payload.error?.message || 'Upload failed. Please try again.'));
      } catch {
        reject(new Error('Upload failed. Please try again.'));
      }
    };
    xhr.onerror = () => reject(new Error('Upload failed. Please try again.'));
    xhr.send(body);
  });
}
