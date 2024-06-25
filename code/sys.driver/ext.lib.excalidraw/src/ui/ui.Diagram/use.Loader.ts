import type { Excalidraw } from '@excalidraw/excalidraw';

import { useEffect, useRef, useState } from 'react';
import { rx } from './common';

type Components = {
  Excalidraw?: typeof Excalidraw;
};

/**
 * Dynamic/code-splitting loader for the Excalidraw module.
 */
export function useLoader() {
  const [loading, setLoading] = useState(false);
  const ref = useRef<Components>({});

  useEffect(() => {
    const life = rx.lifecycle();
    setLoading(true);
    import('@excalidraw/excalidraw').then((m) => {
      if (life.disposed) return;
      ref.current.Excalidraw = m.Excalidraw;
      setLoading(false);
    });

    return life.dispose;
  }, []);

  /**
   * API
   */
  return {
    loading,
    Components: !loading ? ref.current : undefined,
  } as const;
}
