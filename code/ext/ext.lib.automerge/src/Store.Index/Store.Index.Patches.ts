import { type t } from './common';

type P = t.A.Patch;

/**
 * JSON Patch analysis of changes within a store/index.
 */
export const Patches = {
  docs: {
    added(patches: P[]) {
      const first = patches[0];
      if (!first || first.action !== 'insert') return false;
      return first.path[0] === 'docs' && typeof first.path[1] === 'number';
    },

    deleted(patches: P[]) {
      const first = patches[0];
      if (!first || first.action !== 'del') return false;
      return first.path[0] === 'docs' && typeof first.path[1] === 'number';
    },
  },
} as const;
