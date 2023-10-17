import { useContext, useEffect, useState } from 'react';
import { DEFAULTS, ListContext, Model, type t } from './common';

import { Wrangle } from './Wrangle';
import { useBubbleEvents } from './use.ItemController.bubble';
import { useItemEditController } from './use.ItemEditController';
import { useItemSelectionController } from './use.ItemSelectionController';

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
  const dispatch = Model.Item.commands(item);
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

  const handlers = useBubbleEvents(edit.handlers, item);

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
  return {
    enabled,
    handlers,
    get current() {
      return item?.current ?? DEFAULTS.data.item;
    },
  };
}
