import { useEffect, useState } from 'react';
import { Wrangle } from './Wrangle';
import { DEFAULTS, Keyboard, rx, type t } from './common';

type Revertible = t.LabelItem & { _revert?: { label?: string } };
type RevertibleNext = t.ImmutableNext<Revertible>;

type Args = {
  position: t.LabelItemPosition;
  enabled?: boolean;
  item?: t.LabelItemState;
  list?: t.LabelListState;
  handlers?: t.LabelItemPropsHandlers;
  onChange?: t.LabelItemStateChangeHandler;
};

/**
 * HOOK: edit behavior controller for a single <Item>.
 */
export function useItemEditController(args: Args) {
  const { item, list, enabled = true, position } = args;

  const [ref, setRef] = useState<t.LabelItemRef>();
  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  /**
   * Handlers.
   */
  type A = t.LabelItemChangeAction;
  const fire = (action: A) => args.onChange?.({ action, position, item: api.current });
  const change = (action: A, fn: RevertibleNext) => {
    if (!item || !enabled) return;
    item.change(fn);
    fire(action);
    redraw();
  };

  const Edit = {
    is: {
      get editing() {
        return Boolean(item?.current.editing);
      },

      get editable() {
        return item?.current?.editable ?? DEFAULTS.editable;
      },
    },

    start() {
      if (Edit.is.editing || !Edit.is.editable) return;
      change('edit:start', (draft) => {
        draft.editing = true;
        (draft._revert || (draft._revert = {})).label = draft.label;
      });
    },

    accept() {
      if (!Edit.is.editing) return;
      change('edit:accept', (draft) => {
        draft.editing = false;
        delete draft._revert;
      });
    },

    cancel() {
      if (!Edit.is.editing) return;
      change('edit:cancel', (draft) => {
        if (draft._revert) draft.label = draft._revert.label;
        draft.editing = false;
      });
    },

    toggle() {
      if (Edit.is.editing) {
        Edit.accept();
      } else {
        Edit.start();
      }
    },
  };

  /**
   * View component events.
   */
  const handlers: t.LabelItemPropsHandlers = {
    ...args.handlers,

    onReady(e) {
      setRef(e.ref);
      args.handlers?.onReady?.(e);
      change('ready', (d) => null);
    },

    onEditChange(e) {
      change('label', (draft) => (draft.label = e.label));
      args.handlers?.onEditChange?.(e);
    },

    onLabelDoubleClick(e) {
      Edit.start();
      args.handlers?.onLabelDoubleClick?.(e);
    },

    onEditClickAway(e) {
      Edit.cancel();
      args.handlers?.onEditClickAway?.(e);
    },

    onFocusChange(e) {
      args.handlers?.onFocusChange?.(e);
    },
  };

  /**
   * Reset when state instance changes.
   */
  useEffect(() => redraw(), [item?.instance]);

  /**
   * Keyboard.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    const keyboard = Keyboard.until(dispose$);
    const isSelected = () => list && item && list?.current.selected === item?.instance;

    keyboard.on({
      Escape(e) {
        if (!isSelected()) return;
        Edit.cancel();
      },
      Enter(e) {
        if (!isSelected()) return;
        Edit.toggle();
      },
    });

    if (!enabled) dispose();
    return dispose;
  }, [enabled, ref]);

  /**
   * API
   */
  const api: t.LabelItemController<'controller:Item.Edit'> = {
    kind: 'controller:Item.Edit',
    enabled,
    handlers,
    get current() {
      return item?.current ?? DEFAULTS.data.item;
    },
  };
  return api;
}
