import { useEffect } from 'react';
import { Keyboard, rx, type t } from './common';
type Args<H extends HTMLElement = HTMLDivElement> = {
  ref: React.RefObject<H>;
  enabled?: boolean;
  list?: t.LabelListState;
  items?: t.LabelItemState[];
};

/**
 * HOOK: Selection behavior for a <List> of <Items>.
 */
export function useListNavigationController<H extends HTMLElement = HTMLDivElement>(args: Args<H>) {
  const { ref, enabled = true, list, items = [] } = args;

  /**
   * Keyboard.
   */
  useEffect(() => {
    const List = {
      is: {
        get focused() {
          return Boolean(list?.current.focused);
        },
        get editing() {
          return items.some((item) => item.current.editing);
        },
      },
      index: {
        get selected() {
          const selected = list?.current.selected;
          return items.findIndex((item) => item.instance === selected);
        },
        get last() {
          return items.length - 1;
        },
      },
      select(index: number) {
        if (!list || !List.is.focused || List.is.editing) return;
        index = Math.max(0, Math.min(index, items.length - 1));
        const item = items[index];
        list.change((d) => (d.selected = item?.instance));
      },
    } as const;

    const { dispose } = Keyboard.onKeydown((e) => {
      const index = List.index;
      if (e.key === 'ArrowUp') List.select(e.metaKey ? 0 : index.selected - 1);
      if (e.key === 'ArrowDown') List.select(e.metaKey ? index.last : index.selected + 1);
      if (e.key === 'Home') List.select(0);
      if (e.key === 'End') List.select(index.last);
    });

    if (!enabled) dispose();
    return dispose;
  }, [enabled, items, list]);

  /**
   * API
   */
  const api: t.LabelListController<'controller:List.Navigation', H> = {
    kind: 'controller:List.Navigation',
    ref,
    enabled,
  } as const;
  return api;
}
