import { t, Spec } from '../common';
import { button } from '../DevTools.Button';
import { hr } from '../DevTools.Hr';

import type { DevButtonHandler } from '../DevTools.Button/types.mjs';

type O = Record<string, unknown>;

export const DevTools = {
  button,
  hr,

  /**
   * Curried initializtation.
   */
  init,
};

/**
 * [Helpers]
 */

function init<S extends O = O>(input: t.DevCtxInput, initial?: S) {
  const state = initial ?? ({} as S);
  const ctx = Spec.ctx(input);
  return {
    ctx,
    button: (fn: DevButtonHandler<S>) => button<S>(input, state, fn),
    hr: () => DevTools.hr(input),
  };
}
