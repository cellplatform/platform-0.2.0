import { RefObject } from 'react';
import type { t } from '../../common.t';

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

export const Wrangle = {
  args(focus: boolean): t.FocusHandlerArgs {
    const action = focus ? 'focus' : 'blur';
    const blur = !focus;
    return { action, focus, blur };
  },
};
