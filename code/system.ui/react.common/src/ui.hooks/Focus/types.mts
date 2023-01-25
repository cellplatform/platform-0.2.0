import type { RefObject } from 'react';

/**
 * Hook
 */
export type FocusHook<T extends HTMLElement> = {
  readonly ref: RefObject<T>;
  readonly containsFocus: boolean;
  readonly withinFocus: boolean;
  readonly directlyFocused: boolean;
};

export type FocusHandler = (e: FocusHandlerArgs) => void;
export type FocusHandlerArgs = { action: 'focus' | 'blur'; focus: boolean; blur: boolean };
export type ActiveElementChangedHandler = (e: FocusHandlerArgs) => void;
