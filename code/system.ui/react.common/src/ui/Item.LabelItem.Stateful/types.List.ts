import type { t } from './common';

/**
 * List
 */
export type LabelItemListState = t.PatchState<t.LabelItemList>;

/**
 * Controller API's
 */

export type LabelListController<Kind extends string, H extends HTMLElement> = {
  readonly kind: Kind;
  readonly ref: React.RefObject<H>;
  readonly enabled: boolean;
};
