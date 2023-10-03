import { DEFAULTS, type t } from './common';

import { Wrangle } from './Wrangle';
import { useListNavigationController } from './use.List.Navigation.Controller';

type Args = {
  enabled?: boolean;
  useBehaviors?: t.LabelItemBehaviorKind[];
  list?: t.LabelItemListState;
};

/**
 * HOOK: roll-up of all controllers related to a list of <Item>'s.
 */
export function useListController(args: Args) {
  const { list, useBehaviors = DEFAULTS.useBehaviors.defaults } = args;
  const enabled =
    (args.enabled ?? true) && Wrangle.isUsing(useBehaviors, 'List', 'List.Navigation');

  const navigation = useListNavigationController({
    enabled: enabled && Wrangle.isUsing(useBehaviors, 'List.Navigation'),
  });

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
    get data() {
      return list?.current ?? DEFAULTS.data.list;
    },
  } as const;

  return api;
}
