import type { t } from '../common';

export type KeyListenerHandle = t.Lifecycle;

export type KeyPattern = string; // eg. "CMD + K"
export type KeyPressStage = 'Down' | 'Up';
export type KeyboardModifierEdges = [] | ['Left'] | ['Right'] | ['Left' | 'Right'];
export type KeyboardModifierKey = 'SHIFT' | 'CTRL' | 'ALT' | 'META';

export type KeyboardKeyFlags = {
  readonly os: { mac: boolean; windows: boolean };
  readonly down: boolean;
  readonly up: boolean;
  readonly modifier: boolean;
  readonly number: boolean;
  readonly letter: boolean;
  readonly enter: boolean;
  readonly escape: boolean;
  readonly arrow: boolean;
  readonly handled: boolean;
  readonly alt: boolean;
  readonly ctrl: boolean;
  readonly meta: boolean;
  readonly shift: boolean;
  readonly cut: boolean;
  readonly copy: boolean;
  readonly paste: boolean;
};

/**
 * Keyboard Monitor.
 */
export type KeyboardMonitor = KeyboardMonitorOn & {
  readonly $: t.Observable<t.KeyboardState>;
  readonly state: t.KeyboardState;
  readonly is: {
    readonly supported: boolean;
    readonly listening: boolean;
  };
  start(): KeyboardMonitor;
  stop(): void;
  subscribe(fn: (e: t.KeyboardState) => void): KeyListenerHandle;
  filter(fn: () => boolean): KeyboardMonitorOn;
};

export type KeyboardMonitorOn = {
  on(pattern: t.KeyPattern, fn: t.KeyMatchSubscriberHandler): KeyListenerHandle;
  on(patterns: KeyMatchPatterns): KeyListenerHandle;
};

/**
 * Key pattern matching.
 */
export type KeyMatchSubscriberHandler = (e: KeyMatchSubscriberHandlerArgs) => void;
export type KeyMatchSubscriberHandlerArgs = {
  readonly pattern: t.KeyPattern;
  readonly state: t.KeyboardStateCurrent;
  readonly event: t.KeyboardKeypress;
  handled(): void;
};

export type KeyMatchPatterns = {
  readonly [pattern: t.KeyPattern]: t.KeyMatchSubscriberHandler;
};

/**
 * State.
 */
export type KeyboardKey = { key: string; code: string; is: KeyboardKeyFlags; timestamp: number };
export type KeyboardState = {
  current: KeyboardStateCurrent;
  last?: KeyboardKeypress;
};

export type KeyboardStateCurrent = {
  modified: boolean;
  modifierKeys: KeyboardModifierKeys;
  modifiers: KeyboardModifierFlags;
  pressed: KeyboardKey[];
};

export type KeyboardModifierKeys = {
  shift: KeyboardModifierEdges;
  ctrl: KeyboardModifierEdges;
  alt: KeyboardModifierEdges;
  meta: KeyboardModifierEdges;
};
export type KeyboardModifierFlags = {
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
  meta: boolean;
};

/**
 * Keypress
 */
export type KeyboardKeypress = {
  readonly stage: KeyPressStage;
  readonly code: string;
  readonly keypress: KeyboardKeypressProps;
  readonly is: KeyboardKeyFlags;
  handled(): void;
};

export type KeyboardKeypressProps = {
  readonly code: string;
  readonly key: string;
  readonly isComposing: boolean;
  readonly location: number;
  readonly repeat: boolean;
  handled(): void;
} & t.UIEventBase &
  t.UIModifierKeys;
