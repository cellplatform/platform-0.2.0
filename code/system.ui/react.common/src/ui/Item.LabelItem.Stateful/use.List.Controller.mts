import { DEFAULTS, type t } from './common';
import { Wrangle } from './Wrangle.mjs';

import { useListNavigationController } from './use.List.Navigation.Controller.mjs';

type Args = {
  enabled?: boolean;
  useBehaviors?: t.LabelItemBehaviorKind[];
  ctx?: t.LabelItemListState;
};

/**
 * HOOK: roll-up of all controllers related to a list of <Item>'s.
 */
export function useListController(args: Args) {
  const { ctx, useBehaviors = DEFAULTS.useBehaviors.defaults } = args;
  const enabled = args.enabled ?? true;

  const navigation = useListNavigationController({
    enabled: enabled && Wrangle.isUsing(useBehaviors, 'List', 'List.Navigation'),
  });

  console.log('useListNavigationController 💦', navigation);

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
