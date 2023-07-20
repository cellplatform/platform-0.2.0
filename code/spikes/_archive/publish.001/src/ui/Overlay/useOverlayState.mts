import React, { useEffect, useState } from 'react';
import { Text, State, t, Time } from '../common';

const ViewerImports = {
  'sys.ui.VideoDiagram': () => import('../Video.Diagram'),
};

export type DocDef = { viewer: string };

export type CommonProps = {
  instance: t.Instance;
  dimmed?: boolean;
  style?: t.CssValue;
};

/**
 * Hook for managing the loading data derived from an [OverlayDef].
 */
export function useOverlayState(instance: t.Instance, def: t.OverlayDef) {
  const [ready, setReady] = useState(false);
  const [content, setContent] = useState<t.StateOverlayContent | undefined>();
  const [Component, setComponent] = useState<React.FC<CommonProps> | undefined>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    const timer = Time.timer();
    const state = State.Bus.Events({ instance });
    const DELAY = 500; // Simulated latency.

    /**
     * TODO 🐷 REFACTOR
     * - Make more robust
     *    - input/yaml parsing failure
     *    - matching viewer not found (show warning screen)
     * - lookup rendering component via plugin.
     */
    const dynamicLoad = async (code: t.CodeBlock) => {
      const yaml = Text.Yaml.parse(code.text) as DocDef;
      if (yaml) {
        const ns = yaml.viewer;
        if (typeof ns === 'string' && Object.hasOwn(ViewerImports, ns)) {
          const loader = (ViewerImports as any)[ns];
          const Component = (await loader()).default;
          if (typeof Component === 'function') return Component;
        }
      }
      return undefined;
    };

    const processContent = async (overlay: t.StateOverlay) => {
      const content = overlay?.content;
      setContent(content);

      if (!content) return;
      if (timer.elapsed.msec < DELAY) await Time.wait(DELAY - timer.elapsed.msec);

      /**
       * TODO 🐷
       * - Move to consolidated "type" lookup index of some kind.
       */
      const md = content.md;
      const docDef = md.info.code.typed.find((e) => e.type.toLowerCase().startsWith('doc.def'));
      if (docDef) {
        const Component = await dynamicLoad(docDef);
        setComponent(() => Component);
      }

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
  }, [instance.id]);

  /**
   * API
   */
  return { ready, content, Component };
}
