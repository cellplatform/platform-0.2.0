import type { t } from './common';

type Id = string;

/**
 * EVENTS (API)
 */
type E = TextInputEvents__;

export type TextInputEventsDisposable__ = t.Disposable & E & { clone(): E };
export type TextInputEvents__ = {
  toString(): string;
  instance: { bus: Id; id: Id };

  $: t.Observable<t.TextInputEvent__>;
  dispose$: t.Observable<void>;

  status: {
    req$: t.Observable<t.TextInputStatusReq>;
    res$: t.Observable<t.TextInputStatusRes>;
    get(options?: { timeout?: t.Milliseconds }): Promise<t.TextInputStatusRes>;
  };

  text: {
    changing$: t.Observable<t.TextInputChanging>;
    changed$: t.Observable<t.TextInputChanged>;
  };

  focus: {
    $: t.Observable<t.TextInputFocus>;
    fire(focus?: boolean): void;
  };

  select: {
    $: t.Observable<t.TextInputSelect>;
    fire(): void;
  };

  cursor: {
    $: t.Observable<t.TextInputCursor>;
    fire(action: t.TextInputCursorAction): void;
    start(): void;
    end(): void;
  };

  mouse: { labelDoubleClicked$: t.Observable<t.TextInputLabelDoubleClicked> };
};

/**
 * EVENT (Definitions)
 */
export type TextInputEvent__ =
  | TextInputStatusReqEvent
  | TextInputStatusResEvent
  | TextInputChangingEvent
  | TextInputChangedEvent
  | TextInputKeypressEvent
  | TextInputFocusEvent
  | TextInputLabelDoubleClickedEvent
  | TextInputSelectEvent
  | TextInputCursorEvent;

/**
 * Textbox status
 */
export type TextInputStatusReqEvent = {
  type: 'sys.ui.TextInput/Status:req';
  payload: TextInputStatusReq;
};
export type TextInputStatusReq = { instance: Id; tx: Id };

export type TextInputStatusResEvent = {
  type: 'sys.ui.TextInput/Status:res';
  payload: TextInputStatusRes;
};
export type TextInputStatusRes = {
  instance: Id;
  tx: Id;
  status?: t.TextInputStatus__;
  error?: string;
};

/**
 * Change.
 */
export type TextInputChangingEvent = {
  type: 'sys.ui.TextInput/Changing';
  payload: TextInputChanging;
};
export type TextInputChanging = TextInputChangeEvent & {
  instance: Id;
  isCancelled: boolean;
  cancel(): void;
};

export type TextInputChangedEvent = {
  type: 'sys.ui.TextInput/Changed';
  payload: TextInputChanged;
};
export type TextInputChanged = TextInputChangeEvent;

export type TextInputChangeEvent = {
  from: string;
  to: string;
  is: { max: boolean | null };
  modifierKeys: t.KeyboardModifierFlags;
  selection: t.TextInputSelection;
  diff: t.TextCharDiff[];
};

/**
 * Keypress
 */
export type TextInputKeypressEvent = {
  type: 'sys.ui.TextInput/Keypress';
  payload: TextInputKeypress;
};
export type TextInputKeypress = {
  instance: Id;
  pressed: boolean;
  key: t.TextInputKeyHandlerArgs['key'];
  event: t.TextInputKeyHandlerArgs;
};

/**
 * Focus
 */
export type TextInputFocusEvent = {
  type: 'sys.ui.TextInput/Focus';
  payload: TextInputFocus;
};
export type TextInputFocus = {
  instance: Id;
  focus: boolean;
};

/**
 * Mouse
 */
export type TextInputLabelDoubleClickedEvent = {
  type: 'sys.ui.TextInput/Label/DoubleClicked';
  payload: TextInputLabelDoubleClicked;
};
export type TextInputLabelDoubleClicked = {
  instance: Id;
  target: 'ReadOnly' | 'Placeholder';
  button: 'Left' | 'Right';
};

/**
 * Selection
 */
export type TextInputSelectEvent = {
  type: 'sys.ui.TextInput/Select';
  payload: TextInputSelect;
};
export type TextInputSelect = { instance: Id };

/**
 * Cursor
 */
export type TextInputCursorEvent = {
  type: 'sys.ui.TextInput/Cursor';
  payload: TextInputCursor;
};
export type TextInputCursor = {
  instance: Id;
  action: t.TextInputCursorAction;
};
