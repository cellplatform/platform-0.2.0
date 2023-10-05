import type { MouseEventHandler } from 'react';
import type { t } from './common';

type Id = string;
type Milliseconds = number;
type Pixels = number;

export type TextInputRef = {
  focus(select?: boolean): void;
  blur(): void;
  selectAll(): void;
  cursorToStart(): void;
  cursorToEnd(): void;
};

export type TextInputLabelKind = 'ReadOnly' | 'Placeholder';
export type TextInputCursorAction = 'Cursor:Start' | 'Cursor:End';

export type TextInputStatus = {
  instance: { bus: Id; id: Id };
  focused: boolean;
  empty: boolean;
  value: string;
  size: { width: Pixels; height: Pixels };
  selection: TextInputSelection;
};

export type TextInputSelection = { start: number; end: number };

export type TextInputLabelDoubleClickHandler = (e: TextInputLabelDoubleClickHandlerArgs) => void;
export type TextInputLabelDoubleClickHandlerArgs = { target: TextInputLabelKind };

export type TextInputReadyHandler = (e: TextInputReadyHandlerArgs) => void;
export type TextInputReadyHandlerArgs = TextInputRef;

/**
 * Component
 */
export type TextInputValue = {
  value?: string;
  hint?: string | JSX.Element;
  maxLength?: number;
};

export type TextInputProps = t.TextInputFocusProps &
  t.TextInputEventHandlers &
  TextInputValue & {
    isEnabled?: boolean;
    isPassword?: boolean;
    isReadOnly?: boolean;

    disabledOpacity?: number;
    width?: number | string;
    minWidth?: number;
    maxWidth?: number;
    placeholder?: string | JSX.Element | boolean;

    spellCheck?: boolean;
    autoCapitalize?: boolean;
    autoCorrect?: boolean;
    autoComplete?: boolean;
    autoSize?: boolean;
    selectionBackground?: number | string;

    style?: t.CssValue;
    valueStyle?: t.TextInputStyle;
    placeholderStyle?: t.TextInputStyle & { offset?: [number, number] };
    className?: string;

    onReady?: TextInputReadyHandler;
    onClick?: MouseEventHandler;
    onDoubleClick?: MouseEventHandler;
    onMouseDown?: MouseEventHandler;
    onMouseUp?: MouseEventHandler;
    onMouseEnter?: MouseEventHandler;
    onMouseLeave?: MouseEventHandler;
    onLabelDoubleClick?: TextInputLabelDoubleClickHandler;
  };

/**
 * Style
 */
export type TextInputStyle = t.TextStyle & { disabledColor?: number | string };

/**
 * Input
 */
export type TextInputFocusAction = 'Select' | TextInputCursorAction;
export type TextInputFocusProps = {
  focusAction?: TextInputFocusAction;
  focusOnReady?: boolean;
  selectOnReady?: boolean;
};

/**
 * EVENTS (API)
 */
type E = TextInputEvents;
export type TextInputEventsDisposable = t.Disposable & E & { clone(): E };
export type TextInputEvents = {
  toString(): string;
  instance: { bus: Id; id: Id };

  $: t.Observable<t.TextInputEvent>;
  dispose$: t.Observable<void>;

  status: {
    req$: t.Observable<t.TextInputStatusReq>;
    res$: t.Observable<t.TextInputStatusRes>;
    get(options?: { timeout?: Milliseconds }): Promise<TextInputStatusRes>;
  };

  text: {
    changing$: t.Observable<TextInputChanging>;
    changed$: t.Observable<TextInputChanged>;
  };

  focus: {
    $: t.Observable<TextInputFocus>;
    fire(focus?: boolean): void;
  };

  select: {
    $: t.Observable<TextInputSelect>;
    fire(): void;
  };

  cursor: {
    $: t.Observable<TextInputCursor>;
    fire(action: TextInputCursorAction): void;
    start(): void;
    end(): void;
  };

  mouse: { labelDoubleClicked$: t.Observable<TextInputLabelDoubleClicked> };
};

/**
 * EVENT (Callback Definitions)
 */
export type TextInputChangeEventHandler = (e: TextInputChangeEvent) => void;

export type TextInputTabEvent = {
  modifierKeys: t.KeyboardModifierFlags;
  isCancelled: boolean;
  cancel(): void;
};
export type TextInputTabEventHandler = (e: TextInputTabEvent) => void;

export type TextInputKeyEvent = React.KeyboardEvent<HTMLInputElement> & {
  modifierKeys: t.KeyboardModifierFlags;
};
export type TextInputKeyEventHandler = (e: TextInputKeyEvent) => void;

export type TextInputEventHandlers = {
  onChanged?: TextInputChangeEventHandler;
  onKeyDown?: TextInputKeyEventHandler;
  onKeyUp?: TextInputKeyEventHandler;
  onEnter?: TextInputKeyEventHandler;
  onEscape?: TextInputKeyEventHandler;
  onTab?: TextInputTabEventHandler;
  onFocus?: React.EventHandler<React.FocusEvent<HTMLInputElement>>;
  onBlur?: React.EventHandler<React.FocusEvent<HTMLInputElement>>;
  onFocusChange?: TextInputFocusChangeHandler;
};

export type TextInputFocusChangeHandler = (e: TextInputFocusChangeHandlerArgs) => void;
export type TextInputFocusChangeHandlerArgs = {
  isFocused: boolean;
  event: React.FocusEvent<HTMLInputElement>;
};

/**
 * EVENT (Definitions)
 */
export type TextInputEvent =
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
  status?: TextInputStatus;
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
  isMax: boolean | null;
  modifierKeys: t.KeyboardModifierFlags;
  selection: TextInputSelection;
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
  key: TextInputKeyEvent['key'];
  event: TextInputKeyEvent;
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
  action: TextInputCursorAction;
};
