import type { MouseEventHandler } from 'react';
import type { t } from './common';

export type * from './t.Events';

type Id = string;
type Pixels = number;

export type TextInputRef = {
  readonly current: string;
  readonly selection: TextInputSelection;
  focus(select?: boolean): void;
  blur(): void;
  caretToStart(): void;
  caretToEnd(): void;
  selectAll(): void;
  selectRange(
    start: number | null,
    end?: number | null,
    direction?: 'none' | 'forward' | 'backward',
  ): void;
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

export type TextInputSelection = { start: t.Index; end: t.Index };

export type TextInputLabelDoubleClickHandler = (e: TextInputLabelDoubleClickHandlerArgs) => void;
export type TextInputLabelDoubleClickHandlerArgs = { target: TextInputLabelKind };

export type TextInputReadyHandler = (e: TextInputReadyHandlerArgs) => void;
export type TextInputReadyHandlerArgs = { ref: TextInputRef; input: HTMLInputElement };

/**
 * <Component>
 */
export type TextInputValue = { value?: string; hint?: string | JSX.Element; maxLength?: number };
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
    placeholder?: string | JSX.Element | false | null;

    spellCheck?: boolean;
    autoCapitalize?: boolean;
    autoCorrect?: boolean;
    autoComplete?: boolean;
    autoSize?: boolean;
    selectionBackground?: number | string;

    theme?: t.CommonTheme;
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
 * EVENT (Callback Definitions)
 */
export type TextInputChangeEventHandler = (e: t.TextInputChangeEvent) => void;

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
  onChange?: TextInputChangeEventHandler;
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
