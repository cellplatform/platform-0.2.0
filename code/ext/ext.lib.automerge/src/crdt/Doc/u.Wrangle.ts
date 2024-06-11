import { type t } from './common';

type O = Record<string, unknown>;

/**
 * Value wrangling.
 */
export const Wrangle = {
  patchCallback(input?: t.ImmutableChangeOptions) {
    if (!input) return;
    if (typeof input === 'function') return input;
    if (typeof input.patches === 'function') return input.patches;
    return;
  },

  changeOptions<T extends O>(input?: t.ImmutableChangeOptions) {
    const fn = Wrangle.patchCallback(input);
    if (!fn) return;

    const patchCallback: t.A.PatchCallback<T> = (e) => fn(e);
    const options: t.A.ChangeOptions<T> = { patchCallback };
    return options;
  },
} as const;
