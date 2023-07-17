import type { RefObject } from 'react';

export const Focus = {
  containsFocus(ref: RefObject<HTMLElement>) {
    const active = document.activeElement;
    return active && ref.current ? ref.current.contains(active) : false;
  },

  withinFocus(ref: RefObject<HTMLElement>) {
    const active = document.activeElement;
    return active && ref.current ? active.contains(ref.current) : false;
  },
};
