import { commands } from './List.commands';
import { events } from './List.events';
import { DEFAULTS, PatchState, type t } from './common';

type O = Record<string, unknown>;

export const List = {
  commands,

  /**
   * An observable list state.
   */
  state<D extends O = O>(): t.LabelListState {
    type T = t.LabelList<D>;
    type E = t.LabelListEvents<D>;
    const initial = DEFAULTS.data.list as t.LabelList<D>;
    return PatchState.init<T, E>({ initial, events });
  },
} as const;
