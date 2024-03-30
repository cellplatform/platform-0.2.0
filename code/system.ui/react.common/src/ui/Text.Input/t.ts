import type { MouseEventHandler } from 'react';
import type { t } from './common';

export type * from './t.Events';
export type * from './t.Event$';

/**
 * A reference to the <Input> acting as an API
 * for manipulating the non-data-stateful state
 * such as focus/caret/selection etc.
 */
export type TextInputRef = {
  readonly current: string;
  readonly selection: TextInputSelection;
  events(dispose?: t.UntilObservable): t.TextInputEvents;
  focus(select?: boolean): void;
  blur(): void;
  caretToStart(): void;
  caretToEnd(): void;
  selectAll(): void;
  select(
    start: number | null,
    end?: number | null,
    direction?: 'none' | 'forward' | 'backward',
  ): void;
};

export type TextInputLabelKind = 'ReadOnly' | 'Placeholder';
export type TextInputCursorAction = 'Cursor:Start' | 'Cursor:End';
export type TextInputSelection = { start: t.Index; end: t.Index };

/**
 * Component: <TextInput>
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

    onReady?: t.TextInputReadyHandler;
    onClick?: MouseEventHandler;
    onDoubleClick?: MouseEventHandler;
    onMouseDown?: MouseEventHandler;
    onMouseUp?: MouseEventHandler;
    onMouseEnter?: MouseEventHandler;
    onMouseLeave?: MouseEventHandler;
    onLabelDoubleClick?: t.TextInputLabelDoubleClickHandler;
  };

/**
 * Component: <TextInput>:Style
 */
export type TextInputStyle = t.TextStyle & { disabledColor?: number | string };

/**
 * Component: <TextInput>:Input
 */
export type TextInputFocusAction = 'Select' | TextInputCursorAction;
export type TextInputFocusProps = {
  focusAction?: TextInputFocusAction;
  focusOnReady?: boolean;
  selectOnReady?: boolean;
};
