import type { RefObject } from 'react';
import { type t } from './common';

/**
 * The "ref={ ƒ }" API for manipulating the component
 * for things like focus/blur/select.
 */
export function TextInputRef(ref: RefObject<HTMLInputElement>): t.TextInputRef {
  const api: t.TextInputRef = {
    focus(select) {
      ref.current?.focus();
      if (select) api.selectAll();
    },

    blur() {
      ref.current?.blur();
    },

    selectAll() {
      ref.current?.select();
    },

    selectRange(start, end, direction) {
      ref.current?.setSelectionRange(start, end, direction);
    },

    caretToStart() {
      const el = ref.current as any;
      if (el) {
        el.focus();
        if (el.setSelectionRange) {
          // Modern browsers.
          el.setSelectionRange(0, 0);
        } else if (el.createTextRange) {
          // IE8 and below.
          const range = el.createTextRange();
          range.collapse(true);
          range.moveEnd('character', 0);
          range.moveStart('character', 0);
          range.select();
        }
      }
    },

    caretToEnd() {
      const el = ref.current as any;
      if (el) {
        el.focus();
        if (typeof el.selectionStart === 'number') {
          el.selectionStart = el.selectionEnd = el.value.length;
        } else if (typeof el.createTextRange !== 'undefined') {
          const range = el.createTextRange();
          range.collapse(false);
          range.select();
        }
      }
    },
  };

  return api;
}
