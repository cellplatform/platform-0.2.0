import { type RefObject } from 'react';
import { LabelItem, type VirtuosoHandle, type t } from './common';

/**
 * API: Imperitive ref.
 */
export function VirtualListRef(args: {
  virtuosoRef: RefObject<VirtuosoHandle>;
  list?: t.LabelListState;
}): t.VirtualListRef {
  const { virtuosoRef } = args;
  const dispatch = LabelItem.Model.List.commands(args.list);

  const api: t.VirtualListRef = {
    scrollTo(location, options = {}) {
      const vlist = virtuosoRef.current;
      if (!vlist) return;

      const { align = 'center', behavior = 'smooth', offset } = options;

      if (typeof location === 'number') {
        vlist.scrollToIndex({ index: location, align, behavior, offset });
      }

      if (location === 'Last') {
        vlist.scrollToIndex({ index: 'LAST', align, behavior, offset });
      }
    },

    /**
     * List methods.
     */
    select: dispatch.select,
    edit: dispatch.edit,
    redraw: dispatch.redraw,
    remove: dispatch.remove,
    focus: dispatch.focus,
    blur: dispatch.blur,
  };

  return api;
}
