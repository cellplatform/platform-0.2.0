import { commands } from './List.commands';
import { events } from './List.events';
import { DEFAULTS, PatchState, type t } from './common';

type O = Record<string, unknown>;

export const List = {
  commands,

  /**
   * An observable list state.
   */
  state<D extends O = O>(initial?: t.LabelList<D>): t.LabelListState {
    type T = t.LabelList<D>;
    type E = t.LabelListEvents<D>;
    return PatchState.init<T, E>({
      initial: initial ?? (DEFAULTS.data.list as t.LabelList<D>),
      events,
    });
  },

  /**
   * Retrieve the item at the given index.
   */
  item<A extends t.LabelItemActionKind = string, D extends O = O>(
    state: t.LabelList | t.LabelListState,
    index: number,
  ) {
    const current = Wrangle.current(state);
    if (!current?.getItem || index > current.total - 1) return undefined;
    const res = current.getItem(index);
    return res ? (res as t.LabelItemState<A, D>) : undefined;
  },
} as const;

/**
 * Helpers
 */

export const Wrangle = {
  current<D extends O = O>(input: t.LabelList<D> | t.LabelListState<D>) {
    return PatchState.is.state(input) ? input.current : input;
  },
} as const;
