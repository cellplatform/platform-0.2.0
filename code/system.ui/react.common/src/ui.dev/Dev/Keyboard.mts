import { DEFAULTS } from '../common';

export type EscapeAction = 'ReloadRootUrl';

export const KeyboardActions = {
  /**
   * Apply "escape key" trigger action.
   */
  onDoubleEscape(action?: EscapeAction | null) {
    if (action === 'ReloadRootUrl') {
      /**
       * Load the root URL.
       */
      const url = new URL(window.location.href);
      const params = url.searchParams;
      const namespace = params.get(DEFAULTS.QS.dev) ?? '';

      params.set(DEFAULTS.QS.dev, 'true');
      if (namespace && namespace !== 'true') params.set(DEFAULTS.QS.selected, namespace); // NB: hint to load with current selection

      window.history.pushState({}, '', url.href);
      window.location.reload();
    }
  },
};
