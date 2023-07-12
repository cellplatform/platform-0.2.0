import type { RefObject } from 'react';
import { type t } from './common';

export function Ref(ref: RefObject<t.TextInputRef>): t.CrdtNamespaceItemRef {
  return {
    focus: () => ref.current?.focus(),
    blur: () => ref.current?.blur(),
    selectAll: () => ref.current?.selectAll(),
    cursorToStart: () => ref.current?.cursorToStart(),
    cursorToEnd: () => ref.current?.cursorToEnd(),
  };
}
