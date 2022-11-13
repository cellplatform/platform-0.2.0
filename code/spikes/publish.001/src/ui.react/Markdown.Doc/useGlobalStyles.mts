import { useEffect } from 'react';

import { DEFAULTS, Style } from '../common';
import { DocStyles } from './GlobalStyles.mjs';

let _isAdded = false;

/**
 * Hook that adds the global markdown CSS styles (only once).
 */
export function useGlobalStyles() {
  useEffect(() => {
    if (!_isAdded) {
      _isAdded = true;
      const CLASS = DEFAULTS.MD.CLASS;
      const prefix = `.${CLASS.ROOT} .${CLASS.BLOCK}`;
      Style.global(DocStyles, { prefix });
    }
  }, []);
}
