import type { RefObject } from 'react';
import { type t } from './common';

export function Ref(ref: RefObject<t.TextInputRef>): t.LabelItemRef {
  return {
    focus: () => ref.current?.focus(),
    blur: () => ref.current?.blur(),
    selectAll: () => ref.current?.selectAll(),
    cursorToStart: () => ref.current?.caretToStart(),
    cursorToEnd: () => ref.current?.caretToEnd(),
  };
}
