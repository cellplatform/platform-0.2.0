import type { t } from './common';

/**
 * Ready
 */
export type TextInputReadyHandler = (e: TextInputReadyHandlerArgs) => void;
export type TextInputReadyHandlerArgs = { ref: t.TextInputRef; input: HTMLInputElement };

/**
 * Label: double-click
 */
export type TextInputLabelDoubleClickHandler = (e: TextInputLabelDoubleClickHandlerArgs) => void;
export type TextInputLabelDoubleClickHandlerArgs = { target: t.TextInputLabelKind };

/**
 * Change
 */
export type TextInputChangeHandler = (e: t.TextInputChangeHandlerArgs) => void;
export type TextInputChangeHandlerArgs = {
  readonly from: string;
  readonly to: string;
  readonly is: { max: boolean | null };
  readonly modifierKeys: t.KeyboardModifierFlags;
  readonly selection: t.TextInputSelection;
  readonly diff: t.TextCharDiff[];
};

/**
 * Keyboard: Keypress
 */
type KeyboardEvent = React.KeyboardEvent<HTMLInputElement>;

export type TextInputKeyHandler = (e: TextInputKeyHandlerArgs) => void;
export type TextInputKeyHandlerArgs = KeyboardEvent & { modifierKeys: t.KeyboardModifierFlags };

/**
 * Keyboard: Tab
 */
export type TextInputTabHandler = (e: TextInputTabHandlerArgs) => void;
export type TextInputTabHandlerArgs = {
  readonly modifierKeys: t.KeyboardModifierFlags;
  readonly is: { cancelled: boolean };
  cancel(): void;
};

/**
 * Focus
 */
export type TextInputFocusHandler = (e: TextInputFocusHandlerArgs) => void;
export type TextInputFocusHandlerArgs = {
  readonly is: { focused: boolean };
  readonly event: React.FocusEvent<HTMLInputElement>;
};
