import { type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  isUsing(kinds: t.LabelItemBehaviorKind[], ...match: t.LabelItemBehaviorKind[]) {
    return match.some((kind) => kinds.includes(kind));
  },
} as const;
