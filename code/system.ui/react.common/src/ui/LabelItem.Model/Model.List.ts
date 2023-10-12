import { commands } from './Model.List.commands';
import { events } from './Model.List.events';
import { DEFAULTS, PatchState, type t } from './common';

type O = Record<string, unknown>;

export const List = {
  commands,

  /**
   * An observable list state.
   */
  state<D extends O = O>(): t.LabelListState {
    const initial = DEFAULTS.data.list as t.LabelList<D>;
    return PatchState.init<t.LabelList<D>>({ initial });
  },
} as const;
