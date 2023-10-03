import { DEFAULTS, type t } from './common';
import { Wrangle } from './Wrangle.mjs';

import { useListSelectionController } from './use.List.Selection.Controller.mjs';

type Args = {
  enabled?: boolean;
  useBehaviors?: t.LabelItemBehaviorKind[];
  ctx?: t.LabelItemListCtxState;
};

/**
 * HOOK: roll-up of all controllers related to a list of <Item>'s.
 */
export function useListController(args: Args) {
  const { ctx, useBehaviors = DEFAULTS.useBehaviors.defaults } = args;
  const enabled = args.enabled ?? true;

  const listSelection = useListSelectionController({
    enabled: enabled && Wrangle.isUsing(useBehaviors, 'List', 'List.Selection'),
  });

  console.log('useListController 💦', listSelection);

  /**
   * TODO 🐷
   * - handle list of <Item>'s.
   */

  /**
   * API
   */
  const api = {
    kind: 'controller:List',
    enabled,
    ctx,
  } as const;

  return api;
}
