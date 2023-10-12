import { useEffect, useState } from 'react';

import { Wrangle } from './Wrangle';
import { DEFAULTS, Model, type t } from './common';
import { useItemEditController } from './use.Controller.Item.Edit';
import { useItemSelectionController } from './use.Controller.Item.Selection';

type Args = {
  index?: number;
  total?: number;
  useBehaviors?: t.LabelItemBehaviorKind[];
  enabled?: boolean;
  item?: t.LabelItemState;
  list?: t.LabelListState;
  handlers?: t.LabelItemPropsHandlers;
  onChange?: t.LabelItemStateChangeHandler;
};

/**
 * HOOK: roll-up of all controllers related to an <Item>.
 */
export function useItemController(args: Args) {
  const {
    index = DEFAULTS.index,
    total = DEFAULTS.total,
    useBehaviors = DEFAULTS.useBehaviors.defaults,
    item,
    list,
  } = args;
  const position = { index, total };
  const enabled =
    (args.enabled ?? true) && Wrangle.isUsing(useBehaviors, 'Item', 'Item.Selection', 'Item.Edit');

  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  const onChange: t.LabelItemStateChangeHandler = (e) => {
    dispatch.changed(e);
    args.onChange?.(e);
  };

  const selection = useItemSelectionController({
    enabled: enabled && Wrangle.isUsing(useBehaviors, 'Item', 'Item.Selection'),
    position,
    item,
    list,
    onChange,
    handlers: args.handlers ?? {}, // NB: passed in from prior controller (if there was one).
  });

  const edit = useItemEditController({
    enabled: enabled && Wrangle.isUsing(useBehaviors, 'Item', 'Item.Edit'),
    position,
    item,
    list,
    onChange,
    handlers: selection.handlers,
  });

  /**
   * Tap into component event handlers
   * and bubble through Observable
   */
  const dispatch = Model.commands(item);
  const base = edit.handlers;
  const handlers: t.LabelItemPropsHandlers = {
    ...base,
    onKeyDown(e) {
      dispatch.key.down(e);
      base.onKeyDown?.(e);
    },
    onKeyUp(e) {
      dispatch.key.up(e);
      base.onKeyUp?.(e);
    },
    onActionClick(e) {
      dispatch.action.invoke(e);
      base.onActionClick?.(e);
    },
    onClick(e) {
      dispatch.click(e);
      base.onClick?.(e);
    },
    onDoubleClick(e) {
      dispatch.click(e);
      base.onDoubleClick?.(e);
    },
    onLabelDoubleClick(e) {
      dispatch.click(e);
      base.onLabelDoubleClick?.(e);
    },
  };

  /**
   * Monitor commands.
   */
  useEffect(() => {
    const events = item?.events();
    if (events) events.cmd.redraw$.subscribe(redraw);
    return events?.dispose;
  }, [item?.instance]);

  /**
   * API
   */
  const api: t.LabelItemController<'controller:Item'> = {
    kind: 'controller:Item',
    enabled,
    handlers,
    get current() {
      return item?.current ?? DEFAULTS.data.item;
    },
  };
  return api;
}
