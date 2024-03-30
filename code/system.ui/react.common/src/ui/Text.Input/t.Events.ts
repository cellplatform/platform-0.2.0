import type { t } from './common';

export type TextInputBus = t.EventBus<t.TextInputEvent>;

/**
 * Component: <TextInput>: event callbacks(ƒ)
 */
export type TextInputEventHandlers = {
  onChange?: t.TextInputChangeHandler;

  onKeyDown?: t.TextInputKeyHandler;
  onKeyUp?: t.TextInputKeyHandler;
  onEnter?: t.TextInputKeyHandler;
  onEscape?: t.TextInputKeyHandler;
  onTab?: t.TextInputTabHandler;

  onFocus?: t.TextInputFocusHandler;
  onBlur?: t.TextInputFocusHandler;
  onFocusChange?: t.TextInputFocusHandler;
};

/**
 * Events API.
 */
export type TextInputEvents = t.Lifecycle & {
  readonly $: t.Observable<TextInputEvent>;
  readonly change$: t.Observable<t.TextInputChangeArgs>;
  readonly focus$: t.Observable<t.TextInputFocusArgs>;
  readonly key$: t.Observable<t.TextInputKeyEventPayload>;
  readonly tab$: t.Observable<t.TextInputTabArgs>;

  onChange(fn: t.TextInputChangeHandler): void;
  onKeyDown(fn: t.TextInputKeyHandler): void;
  onKeyUp(fn: t.TextInputKeyHandler): void;
  onEnter(fn: t.TextInputKeyHandler): void;
  onEscape(fn: t.TextInputKeyHandler): void;
  onTab(fn: t.TextInputTabHandler): void;
  onFocus(fn: t.TextInputFocusHandler): void;
  onBlur(fn: t.TextInputFocusHandler): void;
  onFocusChange(fn: t.TextInputFocusHandler): void;
};

/**
 * Event Definitions
 */
export type TextInputEvent =
  | TextInputChangeEvent
  | TextInputFocusEvent
  | TextInputTabEvent
  | TextInputKeyEvent;

export type TextInputChangeEvent = { type: 'sys.TextInput:Change'; payload: t.TextInputChangeArgs };
export type TextInputFocusEvent = { type: 'sys.TextInput:Focus'; payload: t.TextInputFocusArgs };
export type TextInputTabEvent = { type: 'sys.TextInput:Tab'; payload: t.TextInputTabArgs };
export type TextInputKeyEvent = { type: 'sys.TextInput:Key'; payload: TextInputKeyEventPayload };
export type TextInputKeyEventPayload = {
  action: 'KeyDown' | 'KeyUp' | 'Enter' | 'Escape';
  event: t.TextInputKeyArgs;
};
