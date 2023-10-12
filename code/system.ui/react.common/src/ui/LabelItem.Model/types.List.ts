import type { t } from './common';

type O = Record<string, unknown>;
type ItemId = string;

/**
 * List
 */

/**
 * Context for when an item exists
 * within the context of a list.
 */
export type LabeList<D extends O = O> = {
  selected?: ItemId;
  focused?: boolean;
  data?: D;
};

export type LabelListState = t.PatchState<t.LabeList>;
