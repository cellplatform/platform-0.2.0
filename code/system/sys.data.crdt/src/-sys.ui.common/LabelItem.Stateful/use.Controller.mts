import { DEFAULTS, type t } from './common';
import { Wrangle } from './Wrangle.mjs';

import { useListSelectionController } from './use.List.SelectionController.mjs';

type Args = {
  useBehaviors?: t.LabelItemBehaviorKind[];
  enabled?: boolean;
  ctx?: t.LabelItemListCtxState;
  item?: t.LabelItemState;
  handlers?: t.LabelItemPropsHandlers;
  onChange?: t.LabelItemStateChangeHandler;
};

/**
 * HOOK: roll-up of all controllers related to a <LabelItem>.
 */
export function useController(args: Args) {
  const { ctx, item, onChange, useBehaviors = DEFAULTS.useBehaviors.defaults } = args;
  const enabled = args.enabled ?? true;

  const listSelection = useListSelectionController({
    enabled: enabled && Wrangle.isUsing(useBehaviors, 'List', 'List.Selection'),
  });

  /**
   * TODO 🐷
   * - handle list of <Item>'s.
   */

  /**
   * API
   */
  const api = {} as const;

  return api;
}
