import { t } from '../common';
import { button } from '../DevTools.Button';

import type { DevButtonHandler } from '../DevTools.Button/types.mjs';

type O = Record<string, unknown>;

export const DevTools = {
  curry,
  button,
};

/**
 * [Helpers]
 */
export function curry<S extends O = O>(input: t.DevCtxInput, initial?: S) {
  const state = initial ?? ({} as S);
  return {
    button: (fn: DevButtonHandler<S>) => button<S>(input, state, fn),
  };
}
