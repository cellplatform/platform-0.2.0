import { useEffect, useRef } from 'react';
import { ActiveElement, DEFAULTS, Focus, ListContext, Model, type t } from './common';

import { Wrangle } from './Wrangle';
import { useListNavigationController } from './use.ListNavigationController';

type Args = {
  enabled?: boolean;
  useBehaviors?: t.LabelItemBehaviorKind[];
  list?: t.LabelListState;
  items?: t.LabelItemState[];
};

/**
 * HOOK: roll-up of all controllers related to a list of <Item>'s.
 */
export function useListController<H extends HTMLElement = HTMLDivElement>(args: Args) {
  const { items = [], useBehaviors = DEFAULTS.useBehaviors.defaults } = args;
  const enabled =
    (args.enabled ?? true) && Wrangle.isUsing(useBehaviors, 'List', 'List.Navigation');

  const ref = useRef<H>(null);
  const eventsRef = useRef<t.LabelListEvents>();
  const dispatchRef = useRef<t.LabelListDispatch>();
  const listRef = useRef(args.list ?? Model.List.state());
  const list = listRef.current;

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
   * Initialize
   */
  useEffect(() => {
    const events = (eventsRef.current = list.events());
    const dispatch = (dispatchRef.current = Model.List.commands(list));
    return events.dispose;
  }, []);

  /**
   * API
   */
  const api = {
    kind: 'controller:List',
    ref,
    enabled,
    items,
    get current() {
      return list?.current ?? DEFAULTS.data.list;
    },
    Provider(props: { children?: React.ReactNode }) {
      const Provider = ListContext.Provider;
      const value: t.LabelListContext = {
        dispatch: dispatchRef.current!,
        events: list.events,
        get list() {
          return list.current;
        },
      };
      return <Provider value={value}>{props.children}</Provider>;
    },
  } as const;
  return api;
}
