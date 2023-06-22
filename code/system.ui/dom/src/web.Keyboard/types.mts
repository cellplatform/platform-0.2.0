import type { t } from '../common.t';

export type KeyListenerHandle = t.Disposable;

export type KeyPattern = string; // eg. "CMD + K"
export type KeyPressStage = 'Down' | 'Up';
export type KeyboardModifierEdges = [] | ['Left'] | ['Right'] | ['Left' | 'Right'];
export type KeyboardModifierKey = 'SHIFT' | 'CTRL' | 'ALT' | 'META';

export type KeyboardKeyFlags = {
  readonly down: boolean;
  readonly up: boolean;
  readonly modifier: boolean;
  readonly number: boolean;
  readonly letter: boolean;
  readonly enter: boolean;
  readonly escape: boolean;
  readonly arrow: boolean;
  readonly handled: boolean;
};

/**
 * Keyboard Monitor.
 */
export type KeyboardMonitor = {
  readonly isSupported: boolean;
  readonly isListening: boolean;
  readonly $: t.Observable<t.KeyboardState>;
  readonly state: t.KeyboardState;
  start(): KeyboardMonitor;
  stop(): void;
  subscribe(fn: (e: t.KeyboardState) => void): KeyListenerHandle;
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
  readonly key: string;
  readonly keypress: KeyboardKeypressProps;
  readonly is: KeyboardKeyFlags;
  handled(): void;
};

export type KeyboardKeypressProps = t.UIEventBase &
  t.UIModifierKeys & {
    readonly code: string;
    readonly key: string;
    readonly isComposing: boolean;
    readonly location: number;
    readonly repeat: boolean;
  };
