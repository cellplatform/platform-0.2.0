import { useEffect, useState } from 'react';
import { t, State, Path, Time } from '../common';

/**
 * Hook for managing the loading data derived from an [OverlayDef].
 */
export function useOverlayDef(instance: t.StateInstance, def: t.OverlayDef) {
  const [ready, setReady] = useState(false);

  /**
   * Lifecycle
   */
  useEffect(() => {
    //

    // const { instance, def } = args;

    (async () => {
      console.log('def', def);

      // State.fe

      const path = Path.toAbsolutePath(Path.join(State.BundlePaths.data.md, def.source));
      console.log('path', path);

      const res = await State.Fetch.text(path);
      console.log('res', res);

      Time.delay(1200, () => setReady(true));
    })();

    return () => undefined;
  }, [instance.id, def.source]);

  /**
   * API
   */
  return {
    ready,
  };
}
