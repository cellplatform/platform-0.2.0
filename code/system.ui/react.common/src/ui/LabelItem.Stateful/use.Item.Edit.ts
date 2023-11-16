import { useEffect, useState } from 'react';
import { DEFAULTS, Keyboard, rx, type t, Model } from './common';

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
  const { item, list, position, enabled = true } = args;
  const dispatch = Model.Item.commands(item);

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
      dispatch.edited('accepted');
    },

    cancel() {
      if (!Edit.is.editing) return;
      change(
        'edit:cancel',
        (list) => (list.editing = undefined),
        (item) => {
          if (item._revert) item.label = item._revert.label;
          delete item._revert;
        },
      );
      dispatch.edited('cancelled');
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
      dispatch.edit('start');
      args.handlers?.onLabelDoubleClick?.(e);
    },

    onEditClickAway(e) {
      dispatch.edit('accept');
      args.handlers?.onEditClickAway?.(e);
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
        if (isSelected()) dispatch.edit('cancel');
      },
      Enter(e) {
        if (isSelected()) dispatch.edit('toggle');
      },
    });

    if (!enabled) dispose();
    return dispose;
  }, [enabled, ref, item?.instance]);

  /**
   * Command listener (Item).
   */
  useEffect(() => {
    const events = item?.events();
    events?.cmd.edit$.pipe(rx.filter((e) => enabled)).subscribe((e) => {
      if (e.action === 'start') Edit.start();
      if (e.action === 'accept') Edit.accept();
      if (e.action === 'cancel') Edit.cancel();
      if (e.action === 'toggle') {
        if (Edit.is.editing) {
          Edit.accept();
        } else {
          Edit.start();
        }
      }
    });
    return events?.dispose;
  }, [enabled, item?.instance]);

  /**
   * Command listener (List).
   */
  useEffect(() => {
    const events = list?.events();
    events?.cmd.edit$
      .pipe(
        rx.filter((e) => enabled),
        rx.filter((e) => e.item === item?.instance),
      )
      .subscribe((e) => dispatch.edit(e.action));
    return events?.dispose;
  }, [enabled, list?.instance]);

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
