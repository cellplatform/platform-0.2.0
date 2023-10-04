import type { RefObject } from 'react';

type FocusEventHandler = (e: FocusEvent) => void;

export const Focus = {
  containsFocus(ref: RefObject<HTMLElement>) {
    const active = document.activeElement;
    return active && ref.current ? ref.current.contains(active) : false;
  },

  withinFocus(ref: RefObject<HTMLElement>) {
    const active = document.activeElement;
    return active && ref.current ? active.contains(ref.current) : false;
  },

  listen<H extends HTMLElement = HTMLDivElement>(
    ref: RefObject<H>,
    handlers: { onFocus?: FocusEventHandler; onBlur?: FocusEventHandler } = {},
  ) {
    const { onFocus, onBlur } = handlers;
    const el = ref.current;
    if (el) {
      if (onFocus) el.addEventListener('focus', onFocus);
      if (onBlur) el.addEventListener('blur', onBlur);
    }
    return {
      dispose() {
        if (!el) return;
        if (onFocus) el.removeEventListener('focus', onFocus);
        if (onBlur) el.removeEventListener('blur', onBlur);
      },
    } as const;
  },
};
