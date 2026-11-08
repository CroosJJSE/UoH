const VIDEO_EXTENSION = /\.(mp4|webm|mov|m4v|ogg|ogv)(\?|$)/i;

export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('data:video/')) return true;
  if (url.includes('/video/upload/')) return true;
  return VIDEO_EXTENSION.test(url);
}

const CLOUDINARY_VIDEO = '/video/upload/';

function cloudinaryVideoParts(url: string): { prefix: string; rest: string } | null {
  const index = url.indexOf(CLOUDINARY_VIDEO);
  if (index === -1) return null;
  return { prefix: url.slice(0, index), rest: url.slice(index + CLOUDINARY_VIDEO.length) };
}

/** Ask Cloudinary to deliver a browser-playable rendition when the stored file is a video. */
export function videoPlaybackUrl(url: string): string {
  const parts = cloudinaryVideoParts(url);
  if (!parts) return url;
  if (parts.rest.startsWith('f_auto')) return url;
  return `${parts.prefix}${CLOUDINARY_VIDEO}f_auto,q_auto/${parts.rest}`;
}

/** First-frame still so list cards can show a video preview without playing. */
export function videoPosterUrl(url: string): string {
  const parts = cloudinaryVideoParts(url);
  if (!parts) return '';
  const rest = parts.rest.replace(/^(?:f_auto(?:,q_auto)?|so_0(?:,f_jpg)?)\/?/, '');
  const withoutExt = rest.replace(/\.[^./]+$/, '');
  return `${parts.prefix}${CLOUDINARY_VIDEO}so_0,f_jpg/${withoutExt}.jpg`;
}
