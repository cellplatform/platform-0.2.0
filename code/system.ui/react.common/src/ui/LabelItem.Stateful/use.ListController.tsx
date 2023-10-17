import { useRef, useState } from 'react';
import { Wrangle } from './Wrangle';
import { DEFAULTS, ListContext, Model, type t } from './common';
import { useListNavigationController } from './use.ListNavigationController';

type Props = {
  enabled?: boolean;
  useBehaviors?: t.LabelItemBehaviorKind[];
  list?: t.LabelListState;
};

/**
 * HOOK: roll-up of all controllers related to a list of <Item>'s.
 */
export function useListController<H extends HTMLElement = HTMLDivElement>(props: Props) {
  const enabled = Wrangle.enabled(props, 'List', 'List.Navigation');

  const ref = useRef<H>(null);
  const dispatchRef = useRef<t.LabelListDispatch>();
  const listRef = useRef(props.list ?? Model.List.state());
  const list = listRef.current;

  /**
   * Hook into event handlers passed down to the <Item>.
   */
  const handlers: t.LabelItemPropsHandlers = {
    onFocusChange(e) {
      list?.change((d) => (d.focused = e.focused));
    },
  };

  /**
   * Sub-controllers.
   */
  useListNavigationController({
    enabled: enabled && Wrangle.enabled(props, 'List', 'List.Navigation'),
    ref,
    list,
  });

  /**
   * API
   */
  return {
    ref,
    enabled,
    handlers,
    list,
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
}
