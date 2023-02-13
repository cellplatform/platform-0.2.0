import { useEffect } from 'react';

import { DEFAULTS, Style } from '../common';
import { TodoStyles } from './styles.Todo.mjs';

const CLASS = DEFAULTS.MD.CLASS;
let _isAdded = false;

/**
 * Hook that adds the global markdown CSS styles (only once).
 */
export function useGlobalStyles() {
  useEffect(() => {
    if (_isAdded) return;
    _isAdded = true;

    Style.global(TodoStyles, { prefix: `.${CLASS.TODO}` });
  }, []);

  return { TodoStyles };
}
