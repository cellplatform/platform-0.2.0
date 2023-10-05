import { useEffect, useRef } from 'react';
import { ActiveElement, DEFAULTS, Focus, type t } from './common';

import { Wrangle } from './Wrangle';
import { useListNavigationController } from './use.Controller.List.Navigation';

type Args = {
  enabled?: boolean;
  useBehaviors?: t.LabelItemBehaviorKind[];
  list?: t.LabelItemListState;
  items?: t.LabelItemState[];
};

/**
 * HOOK: roll-up of all controllers related to a list of <Item>'s.
 */
export function useListController<H extends HTMLElement = HTMLDivElement>(args: Args) {
  const { list, items = [], useBehaviors = DEFAULTS.useBehaviors.defaults } = args;
  const enabled =
    (args.enabled ?? true) && Wrangle.isUsing(useBehaviors, 'List', 'List.Navigation');

  const ref = useRef<H>(null);

  /**
   * Monitor and sync the list's focus state.
   */
  useEffect(() => {
    const isFocused = () => Focus.containsFocus(ref);
    const monitor = ActiveElement.listen(() => list?.change((d) => (d.focused = isFocused())));
    return monitor.dispose;
  }, [ref.current]);

  /**
   * Sub-controllers.
   */
  useListNavigationController({
    ref,
    enabled: enabled && Wrangle.isUsing(useBehaviors, 'List', 'List.Navigation'),
    items,
    list,
  });

  /**
   * API
   */
  return {
    kind: 'controller:List',
    ref,
    enabled,
    items,
    get data() {
      return list?.current ?? DEFAULTS.data.list;
    },
  } as const;
}
