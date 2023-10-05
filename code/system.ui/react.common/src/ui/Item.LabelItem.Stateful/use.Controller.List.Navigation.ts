import { useEffect } from 'react';
import { Keyboard, rx, type t } from './common';
type Args<H extends HTMLElement = HTMLDivElement> = {
  ref: React.RefObject<H>;
  enabled?: boolean;
  list?: t.LabelItemListState;
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
    const { dispose, dispose$ } = rx.disposable();
    const keyboard = Keyboard.until(dispose$);

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

    const meta = (e: t.KeyMatchSubscriberHandlerArgs) => e.state.modifiers.meta;
    keyboard.on({
      ArrowUp: (e) => List.select(meta(e) ? 0 : List.index.selected - 1),
      ArrowDown: (e) => List.select(meta(e) ? List.index.last : List.index.selected + 1),
      Home: (e) => List.select(0),
      End: (e) => List.select(List.index.last),
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
