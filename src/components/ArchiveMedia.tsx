import React from 'react';
import { isVideoUrl, videoPlaybackUrl, videoPosterUrl } from '../lib/media';

interface ArchiveMediaProps {
  src: string;
  alt: string;
  className?: string;
  /** Poster frames sit inside cards. Player is for the detail view and composer. */
  mode?: 'poster' | 'player';
  kind?: 'image' | 'video';
}

export const ArchiveMedia: React.FC<ArchiveMediaProps> = ({
  src,
  alt,
  className,
  mode = 'poster',
  kind,
}) => {
  const video = kind ? kind === 'video' : isVideoUrl(src);

  if (video) {
    const poster = videoPosterUrl(src);
    if (mode === 'poster' && poster) {
      return (
        <img
          src={poster}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          className={className}
        />
      );
    }
    return (
      <video
        src={videoPlaybackUrl(src)}
        poster={poster || undefined}
        className={mode === 'poster' ? `${className ?? ''} pointer-events-none` : className}
        muted={mode === 'poster'}
        playsInline
        preload={mode === 'poster' ? 'metadata' : 'auto'}
        controls={mode === 'player'}
        aria-label={alt}
      />
    );
  }

  return <img src={src} alt={alt} loading="lazy" referrerPolicy="no-referrer" className={className} />;
};
