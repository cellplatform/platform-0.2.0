import { useEffect, useState } from 'react';
import { DEFAULTS, Keyboard, rx, type t } from './common';

type RevertibleItem = t.LabelItem & { _revert?: { label?: string } };
type ChangeItem = t.ImmutableNext<RevertibleItem>;
type ChangeList = t.ImmutableNext<t.LabelList>;

type Args = {
  position: t.LabelItemPosition;
  enabled?: boolean;
  item?: t.LabelItemState;
  list?: t.LabelListState;
  handlers?: t.LabelItemPropsHandlers;
  onChange?: t.LabelItemStateChangedHandler;
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
  const change = (action: A, changeList: ChangeList, changeItem: ChangeItem) => {
    if (!(enabled && list && item)) return;
    list.change(changeList);
    item.change(changeItem);
    fire(action);
    redraw();
  };

  const Edit = {
    is: {
      get editing() {
        return Boolean(item?.instance === list?.current.editing);
      },
      get editable() {
        return item?.current?.editable ?? DEFAULTS.editable;
      },
    },

    start() {
      if (Edit.is.editing || !Edit.is.editable) return;
      change(
        'edit:start',
        (list) => (list.editing = item?.instance),
        (item) => ((item._revert || (item._revert = {})).label = item.label),
      );
    },

    accept() {
      if (!Edit.is.editing) return;
      change(
        'edit:accept',
        (list) => (list.editing = undefined),
        (item) => delete item._revert,
      );
    },

    cancel() {
      if (!Edit.is.editing) return;

      change(
        'edit:accept',
        (list) => (list.editing = undefined),
        (item) => {
          if (item._revert) item.label = item._revert.label;
          delete item._revert;
        },
      );
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
      change(
        'ready',
        (list) => null,
        (item) => null,
      );
      args.handlers?.onReady?.(e);
    },

    onEditChange(e) {
      change(
        'label',
        (list) => null,
        (item) => (item.label = e.label),
      );

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
        if (isSelected()) Edit.cancel();
      },
      Enter(e) {
        if (isSelected()) Edit.toggle();
      },
    });

    if (!enabled) dispose();
    return dispose;
  }, [enabled, ref]);

  /**
   * API
   */
  const api = {
    enabled,
    handlers,
    get current() {
      return item?.current ?? DEFAULTS.data.item;
    },
  } as const;
  return api;
}
