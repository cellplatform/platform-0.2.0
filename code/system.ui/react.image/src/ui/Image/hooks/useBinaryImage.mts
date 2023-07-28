import { useEffect, useState } from 'react';
import { type t } from '../common';

/**
 * Hook to prepare a binary image for rendering.
 */
export function useBinaryImage(src?: t.ImageBinary | null) {
  const length = src?.data?.length || 0;
  const [url, setUrl] = useState('');

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (typeof src === 'object' && src !== null) {
      const data = new Blob([src.data], { type: src.mimetype });
      setUrl(URL.createObjectURL(data));
    }

    if (src === undefined || src === null) {
      setUrl('');
      URL.revokeObjectURL(url);
    }

    return () => URL.revokeObjectURL(url);
  }, [length, src]);

  /**
   * API
   */
  return { src, url } as const;
}
