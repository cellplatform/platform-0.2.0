import { useEffect, useState } from 'react';
import { type t } from './common';

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

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [length]);

  /**
   * API
   */
  return { src, url };
}
