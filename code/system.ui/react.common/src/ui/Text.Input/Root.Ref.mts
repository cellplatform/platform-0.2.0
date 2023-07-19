import type { RefObject } from 'react';
import { type t } from './common';

/**
 * The "ref={...}" API for manipulating the component
 * for things like focus/blur/select.
 */
export function TextInputRef(ref: RefObject<HTMLInputElement>): t.TextInputRef {
  return {
    focus() {
      ref.current?.focus();
    },

    blur() {
      ref.current?.blur();
    },

    selectAll() {
      ref.current?.select();
    },

    cursorToStart() {
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

    cursorToEnd() {
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
}
