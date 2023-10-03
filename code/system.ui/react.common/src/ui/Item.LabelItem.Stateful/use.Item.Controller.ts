import { DEFAULTS, type t } from './common';
import { Wrangle } from './Wrangle';

import { useItemEditController } from './use.Item.Edit.Controller';
import { useItemSelectionController } from './use.Item.Selection.Controller';

type Args = {
  useBehaviors?: t.LabelItemBehaviorKind[];
  enabled?: boolean;
  ctx?: t.LabelItemListState;
  item?: t.LabelItemState;
  handlers?: t.LabelItemPropsHandlers;
  onChange?: t.LabelItemStateChangeHandler;
};

/**
 * HOOK: roll-up of all controllers related to an <Item>.
 */
export function useItemController(args: Args) {
  const { ctx, item, onChange, useBehaviors = DEFAULTS.useBehaviors.defaults } = args;
  const enabled =
    (args.enabled ?? true) && Wrangle.isUsing(useBehaviors, 'Item', 'Item.Selection', 'Item.Edit');

  const selection = useItemSelectionController({
    enabled: enabled && Wrangle.isUsing(useBehaviors, 'Item', 'Item.Selection'),
    ctx,
    item,
    onChange,
    handlers: args.handlers ?? {}, // NB: passed in from prior controller (if there was one).
  });

  const edit = useItemEditController({
    enabled: enabled && Wrangle.isUsing(useBehaviors, 'Item', 'Item.Edit'),
    item,
    onChange,
    handlers: selection.handlers,
  });

  /**
   * API
   */
  const api: t.LabelItemController<'controller:Item'> = {
    kind: 'controller:Item',
    enabled,
    handlers: edit.handlers,
    get data() {
      return item?.current ?? DEFAULTS.data;
    },
  };

  return api;
}
