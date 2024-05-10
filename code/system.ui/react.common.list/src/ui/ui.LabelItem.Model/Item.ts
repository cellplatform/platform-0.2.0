import { commands } from './Item.commands';
import { events } from './Item.events';
import { DEFAULTS, PatchState, type t } from './common';

type O = Record<string, unknown>;
type K = t.LabelItemActionKind;
const { toObject } = PatchState;

export const Item = {
  toObject,
  commands,

  /**
   * An obvservable list item.
   */
  state<A extends t.LabelItemActionKind = string, D extends O = O>(
    initial: t.LabelItem<A, D> = DEFAULTS.data.item as t.LabelItem<A, D>,
    options: {
      typename?: string;
      onChange?: t.PatchChangeHandler<t.LabelItem<A, D>>;
      dispose$?: t.UntilObservable;
    } = {},
  ): t.LabelItemState<A, D> {
    type T = t.LabelItem<A, D>;
    type E = t.LabelItemEvents<A, D>;
    const { typename, onChange } = options;
    return PatchState.create<T, E>(initial, {
      typename,
      onChange,
      events($, dispose$) {
        return events<A, D>($, [dispose$, options.dispose$]);
      },
    });
  },

  /**
   * Retrieve the named action object.
   */
  action<A extends K = string>(
    input: t.LabelItem<A> | t.LabelItemState<A>,
    kind: A,
  ): t.LabelItemAction<A>[] {
    const current = PatchState.Is.state(input) ? input.current : input;
    const onKind = (action: t.LabelItemAction<A>) => action.kind === kind;
    const left = Wrangle.actionArray(current.left).filter(onKind);
    const right = Wrangle.actionArray(current.right).filter(onKind);
    return [...left, ...right].filter(Boolean);
  },

  /**
   * Increment the redraw count on the given item.
   */
  incrementRedraw(item: t.LabelItemState) {
    item.change((d) => (d.redraw = (d.redraw || (d.redraw = 0)) + 1));
  },
} as const;

/**
 * Helpers
 */
export const Wrangle = {
  actionArray<A extends K>(
    input?: t.LabelItemAction<A> | t.LabelItemAction<A>[] | null,
  ): t.LabelItemAction<A>[] {
    if (input === undefined || input === null) return [];
    return Array.isArray(input) ? input : [input];
  },
} as const;
