import { useEffect } from 'react';

import { DEFAULTS, Style } from '../common';
import { DocStyles } from './Styles.Doc.mjs';
import { VideoDiagramStyles, VideoDiagramRefsStyles } from './Styles.VideoDiagram.mjs';
import { TriggorPanelStyles } from './Styles.TriggorPanel.mjs';

const CLASS = DEFAULTS.MD.CLASS;
let _isAdded = false;

/**
 * Hook that adds the global markdown CSS styles (only once).
 */
export function useGlobalStyles() {
  useEffect(() => {
    if (!_isAdded) {
      _isAdded = true;

      Style.global(DocStyles as any, {
        prefix: `.${CLASS.ROOT} .${CLASS.BLOCK}`,
      });

      Style.global(VideoDiagramStyles, {
        prefix: `.${CLASS.ROOT}.${CLASS.VIDEO_DIAGRAM}`,
      });

      Style.global(VideoDiagramRefsStyles, {
        prefix: `.${CLASS.ROOT}.${CLASS.VIDEO_DIAGRAM_REFS}`,
      });

      Style.global(TriggorPanelStyles, {
        prefix: `.${CLASS.ROOT} .${CLASS.TIGGER_PANEL}`,
      });
    }
  }, []);

  return { DocStyles };
}
