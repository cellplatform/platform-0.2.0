import { useEffect } from 'react';
import { Keyboard, type t } from './common';

type Args<H extends HTMLElement = HTMLDivElement> = {
  ref: React.RefObject<H>;
  enabled?: boolean;
  list?: t.LabelListState;
};

/**
 * HOOK: Selection behavior for a <List> of <Items>.
 */
export function useListNavigationController<H extends HTMLElement = HTMLDivElement>(args: Args<H>) {
  const { ref, list, enabled = true } = args;

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
          return Boolean(list?.current.editing);
        },
      },
      index: {
        get selected() {
          const selected = list?.current.selected;
          return selected ? list?.current.getItem?.(selected)[1] ?? -1 : -1;
        },
        get last() {
          return (list?.current.length ?? 0) - 1;
        },
      },
      select(index: number) {
        if (!list || !List.is.focused || List.is.editing) return;
        index = Math.max(0, Math.min(index, list.current.length - 1));
        const item = list.current.getItem?.(index)[0];
        list.change((d) => (d.selected = item?.instance));
      },
    } as const;

    const { dispose } = Keyboard.onKeydown((e) => {
      if (List.is.editing) return;
      const select = (index: number) => {
        e.preventDefault(); // Prevent an overflowing DIV from scrolling on (↑↓) arrow keys.
        List.select(index);
      };
      const index = List.index;
      if (e.key === 'ArrowUp') select(e.metaKey ? 0 : index.selected - 1);
      if (e.key === 'ArrowDown') select(e.metaKey ? index.last : index.selected + 1);
      if (e.key === 'Home') select(0);
      if (e.key === 'End') select(index.last);
    });

    if (!enabled) dispose();
    return dispose;
  }, [enabled, list?.instance]);

  /**
   * API
   */
  return {
    ref,
    enabled,
  } as const;
}
