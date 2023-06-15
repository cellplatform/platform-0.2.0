import { useEffect, useState } from 'react';
import { type t } from '../common';

/**
 * Hook to prepare a binary image for rendering.
 */
export function useBinaryImage(src?: t.ImageBinary) {
  const length = src?.data?.length || 0;
  const [url, setUrl] = useState('');

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (typeof src === 'object') {
      const data = new Blob([src.data], { type: src.mimetype });
      setUrl(URL.createObjectURL(data));
    }

    if (src === undefined) {
      setUrl('');
      URL.revokeObjectURL(url);
    }

    return () => URL.revokeObjectURL(url);
  }, [length, src]);

  /**
   * API
   */
  return { src, url };
}
