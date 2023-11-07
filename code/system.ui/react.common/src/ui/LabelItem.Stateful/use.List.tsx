import { useEffect, useRef } from 'react';
import { Wrangle } from './Wrangle';
import { DEFAULTS, ListContext, Model, rx, type t } from './common';
import { useListKeyboardController } from './use.List.Keyboard';
import { useListNavigationController } from './use.List.Navigation';
import { useListRedrawController } from './use.List.Redraw';

type Args = {
  enabled?: boolean;
  useBehaviors?: t.LabelItemBehaviorKind[];
  list?: t.LabelListState;
};

/**
 * HOOK: roll-up of all controllers related to a list of <Item>'s.
 */
export function useListController<H extends HTMLElement = HTMLDivElement>(args: Args) {
  const { useBehaviors } = args;
  const enabled = Wrangle.enabled(args, 'List', 'List.Navigation');

  const ref = useRef<H>(null);
  const dispatchRef = useRef<t.LabelListDispatch>();
  const listRef = useRef(args.list ?? Model.List.state());
  const list = listRef.current;

  /**
   * Monitor redraw triggers.
   */
  useListRedrawController(list);

  /**
   * Monitor item removal.
   */
  useEffect(() => {
    const events = list.events();
    const remove$ = events.cmd.remove$.pipe(
      rx.filter((e) => e.index >= 0),
      rx.filter((e) => e.index <= list.current.total - 1),
    );
    remove$.subscribe((e) => list.change((d) => (d.total -= 1)));
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
  useListKeyboardController({ list, useBehaviors });
  useListNavigationController({
    enabled: enabled && Wrangle.enabled(args, 'List', 'List.Navigation'),
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
