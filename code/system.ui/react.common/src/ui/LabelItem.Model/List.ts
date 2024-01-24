import { DEFAULTS, PatchState, type t } from './common';

import { array } from './List.array';
import { commands } from './List.commands';
import { events } from './List.events';
import { get } from './List.get';
import { getItem } from './List.getItem';
import { map } from './List.map';

type O = Record<string, unknown>;
const { toObject } = PatchState;

export const List = {
  toObject,
  commands,
  get,
  getItem,
  array,
  map,

  /**
   * Create a new observable <List> state object.
   */
  state<D extends O = O>(
    initial?: t.LabelList<D>,
    options: { typename?: string; dispose$?: t.UntilObservable } = {},
  ): t.LabelListState {
    type T = t.LabelList<D>;
    type E = t.LabelListEvents<D>;
    const { typename } = options;
    return PatchState.init<T, E>({
      initial: initial ?? (DEFAULTS.data.list as t.LabelList<D>),
      typename,
      events($, dispose$) {
        return events<D>($, [dispose$, options.dispose$]);
      },
    });
  },
} as const;
