import type { t } from './common';

type Id = string;
type Index = number;
type O = Record<string, unknown>;
type K = t.LabelItemActionKind;

/**
 * Helper for managing a set of items with a simple array.
 *
 * NOTE:
 *    Useful when the list is not very long and you
 *    do not need a complex structure like a cursor.
 */
export type LabelListArray<A extends K = string, D extends O = O> = {
  readonly items: t.LabelItemState<A, D>[];
  readonly getItem: t.GetLabelItem<A, D>;
  readonly length: number;
  readonly first: t.LabelItemState<A, D>;
  readonly last: t.LabelItemState<A, D>;

  map<T>(fn: t.LabelItemTransform<T, A, D>): T[];
  fill(total: number): LabelListArray<A, D>;
  remove(target?: Index | Id): LabelListArray<A, D>;
};

export type LabelItemTransform<T, A extends K = string, D extends O = O> = (
  item: t.LabelItemState<A, D>,
  index: number,
  array: t.LabelItemState<A, D>[],
) => T;
