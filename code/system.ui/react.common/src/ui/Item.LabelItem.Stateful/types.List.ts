import type { t } from './common';

type ItemId = string;

/**
 * List
 */

/**
 * Context for when an item exists
 * within the context of a list.
 */
export type LabeList = {
  selected?: ItemId;
  focused?: boolean;
};

export type LabelListState = t.PatchState<t.LabeList>;

/**
 * Controller API's
 */

export type LabelListController<Kind extends string, H extends HTMLElement> = {
  readonly kind: Kind;
  readonly ref: React.RefObject<H>;
  readonly enabled: boolean;
};
