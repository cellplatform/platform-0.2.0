import { useRef } from 'react';

import { useFocus } from '../../useFocus';
import { Color, css, DEFAULTS, R, t } from '../common';
import { Util } from '../util.mjs';

/**
 * Types
 */
export type HtmlInputProps = t.TextInputFocusAction &
  t.TextInputEventHandlers &
  t.TextInputValue & {
    className?: string;
    isEnabled?: boolean;
    isPassword?: boolean;
    disabledOpacity?: number;
    style?: t.CssValue;
    valueStyle?: t.TextInputStyle;
    selectionBackground?: number | string;
    spellCheck?: boolean;
    autoCapitalize?: boolean;
    autoCorrect?: boolean;
    autoComplete?: boolean;
    onDoubleClick?: React.MouseEventHandler;
  };

/**
 * Component
 */
export const HtmlInput: React.FC<HtmlInputProps> = (props) => {
  const {
    value = '',
    isEnabled = DEFAULTS.prop.isEnabled,
    disabledOpacity = DEFAULTS.prop.disabledOpacity,
    isPassword = DEFAULTS.prop.isPassword,
    maxLength,
    selectionBackground,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const focusState = useFocus(inputRef, { redraw: false });

  // const keyboard = Keyboard.useKeyboardState({ bus: props.instance.bus, instance });
  // const cloneModifierKeys = () => ({ ...keyboard.state.current.modifiers });
  const cloneModifierKeys = () => {
    /**
     * TODO 🐷
     */
    console.warn('cloneModifierKeys');
    return {
      shift: false,
      ctrl: false,
      alt: false,
      meta: false,
    };
  };

  /**
   * [Handlers]
   */
  const handleChange = (e: React.ChangeEvent) => {
    const { onChanged, maxLength, mask } = props;

    // Derive values.
    const from = value;
    let to = ((e.target as any).value as string) || '';
    to = Util.value.format(to, maxLength);
    const char = Util.value.getChangedChar(from, to);
    const isMax = maxLength === undefined ? null : to.length === maxLength;

    // Check whether an input-filter will mask the value.
    if (char && mask) {
      if (!mask({ text: to, char })) return; // Handled.
    }

    // Update state and alert listeners.
    if (from !== to) {
      const modifierKeys = cloneModifierKeys();
      onChanged?.({ from, to, isMax, char, modifierKeys });
    }
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { onKeyDown, onEscape, onTab } = props;
    const event = toKeyboardEvent(e);

    onKeyDown?.(event);
    if (onEscape && e.key === 'Escape') onEscape(event);

    if (onTab && e.key === 'Tab') {
      let isCancelled = false;
      onTab({
        modifierKeys: cloneModifierKeys(),
        get isCancelled() {
          return isCancelled;
        },
        cancel() {
          isCancelled = true;
          e.preventDefault();
        },
      });
    }
  };

  const handleKeyup = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const event = toKeyboardEvent(e);
    if (e.key === 'Enter') props.onEnter?.(event);
    props.onKeyUp?.(event);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { focusAction, onFocus } = props;

    if (focusAction === 'Select') selectAll();
    if (focusAction === 'Cursor:Start') cursorToStart();
    if (focusAction === 'Cursor:End') cursorToEnd();

    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    props.onBlur?.(e);
  };

  /**
   * [Utility]
   */

  const toKeyboardEvent = (e: React.KeyboardEvent<HTMLInputElement>): t.TextInputKeyEvent => {
    return {
      ...e,
      modifierKeys: cloneModifierKeys(),
      preventDefault: () => e.preventDefault(),
      stopPropagation: () => e.stopPropagation(),
    };
  };

  const focus = () => inputRef.current?.focus();
  const blur = () => inputRef.current?.blur();
  const selectAll = () => inputRef.current?.select();

  const cursorToStart = () => {
    const el = inputRef.current as any;

    if (el) {
      el.focus();
      if (el.setSelectionRange) {
        // Modern browsers.
        el.setSelectionRange(0, 0);
      } else if (el.createTextRange) {
        // IE8 and below.
        const range = el.createTextRange();
        range.collapse(true);
        range.moveEnd('character', 0);
        range.moveStart('character', 0);
        range.select();
      }
    }
  };

  const cursorToEnd = () => {
    const el = inputRef.current as any;
    if (el) {
      el.focus();
      if (typeof el.selectionStart === 'number') {
        el.selectionStart = el.selectionEnd = el.value.length;
      } else if (typeof el.createTextRange !== 'undefined') {
        const range = el.createTextRange();
        range.collapse(false);
        range.select();
      }
    }
  };

  /**
   * [Render]
   */

  const styles = {
    base: {
      position: 'relative',
      border: 'none',
      width: '100%',
      lineHeight: 0,
      outline: 'none',
      background: 'transparent',
      boxSizing: 'border-box',
      opacity: 1,
    } as t.CssValue,
  };

  if (selectionBackground) {
    styles.base = {
      ...styles.base,
      '::selection': { backgroundColor: Color.format(selectionBackground) },
    } as t.CssValue;
  }

  styles.base = R.mergeDeepRight(
    styles.base,
    Util.css.toTextInput(isEnabled, props.valueStyle ?? DEFAULTS.prop.valueStyle) as {},
  );
  styles.base = {
    ...styles.base,
    opacity: isEnabled ? 1 : disabledOpacity,
  };

  return (
    <input
      {...css(styles.base as t.CssValue, props.style)}
      className={props.className}
      ref={inputRef}
      type={isPassword ? 'password' : 'text'}
      disabled={!isEnabled}
      value={value}
      maxLength={maxLength}
      spellCheck={props.spellCheck}
      autoCapitalize={props.autoCapitalize === false ? 'off' : undefined}
      autoCorrect={props.autoCorrect === false ? 'off' : undefined}
      autoComplete={props.autoComplete === false ? 'off' : undefined}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeydown}
      onKeyUp={handleKeyup}
      onDoubleClick={props.onDoubleClick}
    />
  );
};
