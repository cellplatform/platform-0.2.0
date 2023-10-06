import { Wrangle as ItemWrangle } from '../Item.LabelItem/Wrangle';
import { type t } from './common';

const { valuesOrDefault } = ItemWrangle;

/**
 * Helpers
 */
export const Wrangle = {
  valuesOrDefault,

  isUsing(kinds: t.LabelItemBehaviorKind[], ...match: t.LabelItemBehaviorKind[]) {
    return match.some((kind) => kinds.includes(kind));
  },
} as const;
