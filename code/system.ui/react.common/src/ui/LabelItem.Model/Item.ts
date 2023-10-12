import { commands } from './Item.commands';
import { events } from './Item.events';
import { DEFAULTS, PatchState, type t } from './common';

type O = Record<string, unknown>;

export const Item = {
  commands,

  /**
   * An obvservable list item.
   */
  state<A extends t.LabelItemActionKind = string, D extends O = O>(
    initial: t.LabelItem<A, D> = DEFAULTS.data.item as t.LabelItem<A, D>,
    options: { onChange?: t.PatchChangeHandler<t.LabelItem<A, D>> } = {},
  ): t.LabelItemState<A, D> {
    type T = t.LabelItem<A, D>;
    type E = t.LabelItemStateEvents<A, D>;
    const { onChange } = options;
    return PatchState.init<T, E>({ initial, events, onChange });
  },
} as const;
