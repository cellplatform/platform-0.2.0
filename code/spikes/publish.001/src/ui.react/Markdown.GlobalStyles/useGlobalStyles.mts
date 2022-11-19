import { useEffect } from 'react';

import { DEFAULTS, Style } from '../common';
import { DocStyles } from './Styles.Doc.mjs';
import { VideoDiagramStyles } from './Styles.VideoDiagram.mjs';

const CLASS = DEFAULTS.MD.CLASS;
let _isAdded = false;

/**
 * Hook that adds the global markdown CSS styles (only once).
 */
export function useGlobalStyles() {
  useEffect(() => {
    if (!_isAdded) {
      _isAdded = true;

      Style.global(DocStyles, {
        prefix: `.${CLASS.ROOT} .${CLASS.BLOCK}`,
      });

      Style.global(VideoDiagramStyles, {
        prefix: `.${CLASS.ROOT} .${CLASS.BLOCK} .${CLASS.VIDEO_DIAGRAM}`,
      });
    }
  }, []);

  return { DocStyles };
}
