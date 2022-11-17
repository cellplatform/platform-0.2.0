import { useEffect, useState } from 'react';
import { State, t, Time } from '../common';

/**
 * Hook for managing the loading data derived from an [OverlayDef].
 */
export function useOverlayState(instance: t.StateInstance, def: t.OverlayDef) {
  const [ready, setReady] = useState(false);
  const [content, setContent] = useState<t.StateOverlayContent | undefined>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    const timer = Time.timer();
    const state = State.Bus.Events({ instance });
    const DELAY = 500; // Simulated latency.

    const processContent = async (overlay: t.StateOverlay) => {
      const content = overlay?.content;
      setContent(content);

      if (!content) return;
      if (timer.elapsed.msec < DELAY) await Time.wait(DELAY - timer.elapsed.msec);

      setReady(true);
    };

    /**
     * Look (or wait) for loaded content.
     */
    state.overlay.content$.subscribe((e) => processContent(e)); // NB: Catch delayed load results.
    state.info.get().then((e) => {
      const overlay = e.info?.current.overlay;
      if (overlay) processContent(overlay);
    });

    /**
     * Dispose.
     */
    return () => state.dispose();
  }, [instance.id, def.source]);

  /**
   * API
   */
  return { ready, content };
}
