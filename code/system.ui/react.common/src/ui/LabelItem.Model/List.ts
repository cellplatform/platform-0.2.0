import { DEFAULTS, PatchState, type t } from './common';

import { array } from './List.array';
import { commands } from './List.commands';
import { events } from './List.events';
import { getItem } from './List.getItem';
import { map } from './List.map';

type O = Record<string, unknown>;

export const List = {
  commands,
  getItem,
  array,
  map,

  /**
   * Create a new observable <List> state object.
   */
  state<D extends O = O>(initial?: t.LabelList<D>): t.LabelListState {
    type T = t.LabelList<D>;
    type E = t.LabelListEvents<D>;
    return PatchState.init<T, E>({
      initial: initial ?? (DEFAULTS.data.list as t.LabelList<D>),
      events,
    });
  },
} as const;
