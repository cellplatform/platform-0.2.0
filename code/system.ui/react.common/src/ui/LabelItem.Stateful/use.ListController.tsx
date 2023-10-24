import { useEffect, useRef, useState } from 'react';
import { Wrangle } from './Wrangle';
import { DEFAULTS, ListContext, Model, type t, rx } from './common';
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

  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  /**
   * Monitor redraws.
   */
  useEffect(() => {
    const events = list.events();
    events.cmd.redraw$.pipe(rx.filter((e) => !e.item)).subscribe(redraw);
    events.total$.subscribe(redraw);
    return events.dispose;
  }, []);

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
