import { RefObject } from 'react';

/**
 * [Helpers]
 */

export function containsFocus(ref: RefObject<HTMLElement>) {
  const active = document.activeElement;
  return active && ref.current ? ref.current.contains(active) : false;
}

export function withinFocus(ref: RefObject<HTMLElement>) {
  const active = document.activeElement;
  return active && ref.current ? active.contains(ref.current) : false;
}
