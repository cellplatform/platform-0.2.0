import { RefObject, useEffect, useState } from 'react';

import { css, DEFAULTS, t, Time } from './common';
import { TextInputHint } from './ui.TextInput.Hint';
import { HtmlInput } from './ui.TextInput.Html';
import { Util } from './util.mjs';

import type { TextInputProps } from '../types.mjs';
export type { TextInputProps };

type Props = t.TextInputProps & {
  inputRef: RefObject<HTMLInputElement>;
};

/**
 * Component
 */
export const TextInputBase: React.FC<Props> = (props) => {
  const {
    inputRef,
    placeholder,
    maxLength,
    isPassword = DEFAULTS.prop.isPassword,
    isReadOnly = DEFAULTS.prop.isReadOnly,
    isEnabled = DEFAULTS.prop.isEnabled,
    valueStyle = DEFAULTS.prop.valueStyle,
    disabledOpacity = DEFAULTS.prop.disabledOpacity,
    placeholderStyle = {},
  } = props;

  const value = Util.value.format(props.value, maxLength);
  const hasValue = value.length > 0;

  const [width, setWidth] = useState<string | number>();

  /**
   * Lifecycle: Auto-size.
   */
  useEffect(() => {
    const { autoSize } = props;
    if (autoSize) Time.delay(0, async () => setWidth(await Util.css.toWidth(props))); // NB: Delay is so size measurement returns accurate number.
    if (!autoSize) setWidth(undefined);
  }, [value, props.autoSize]);

  /**
   * [Handlers]
   */
  const handleDoubleClick = (e: React.MouseEvent) => {
    // NB: When the <input> is dbl-clicked and there is no
    //     value it is deduced that the placeholder was clicked.
    if (!hasValue) {
      const handler = Wrangle.labelDoubleClickHandler(props, 'Placeholder');
      handler(e);
    }
  };

  const handleFocusChange = (
    event: React.FocusEvent<HTMLInputElement, Element>,
    isFocused: boolean,
  ) => {
    if (isFocused) props.onFocus?.(event);
    if (!isFocused) props.onBlur?.(event);
    props.onFocusChange?.({ event, isFocused });
  };

  /**
   * [Render]
   */
  const styles = {
    base: {
      position: 'relative',
      boxSizing: 'border-box',
      pointerEvents: isEnabled ? 'auto' : 'none',
      width,
    } as const,
    inner: { position: 'relative' } as const,
    placeholder: {
      Absolute: 0,
      opacity: isEnabled ? 1 : disabledOpacity,
      transition: `opacity 200ms`,

      paddingLeft: 2, // Ensure the placeholder does not bump into the input-caret.
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      userSelect: 'none',
      pointerEvents: 'none',

      transform: placeholderStyle.offset
        ? `translate(${placeholderStyle.offset[0]}px, ${placeholderStyle.offset[1]}px)`
        : undefined,

      display: 'grid',
      justifyContent: 'left',
      alignContent: 'center',
    } as const,
    readonly: {
      userSelect: 'auto',
      pointerEvents: isEnabled ? 'auto' : 'none',
    } as const,
    input: {
      visibility: isReadOnly ? 'hidden' : 'visible',
      pointerEvents: isReadOnly || !isEnabled ? 'none' : 'auto',
    } as const,
  };

  const elPlaceholder = !hasValue && placeholder && (
    <div
      {...css(styles.placeholder, Util.css.toPlaceholder(props))}
      onDoubleClick={Wrangle.labelDoubleClickHandler(props, 'Placeholder')}
    >
      {placeholder}
    </div>
  );

  const elReadOnly = isReadOnly && !elPlaceholder && (
    <div
      {...css(valueStyle as t.CssValue, styles.placeholder, styles.readonly)}
      onDoubleClick={Wrangle.labelDoubleClickHandler(props, 'ReadOnly')}
    >
      {value}
    </div>
  );

  const elHint = hasValue && props.hint && (
    <TextInputHint valueStyle={valueStyle} value={value} hint={props.hint} />
  );

  const elInput = (
    <HtmlInput
      inputRef={inputRef}
      style={styles.input}
      className={props.className}
      value={value}
      isEnabled={isEnabled}
      isPassword={isPassword}
      disabledOpacity={disabledOpacity}
      maxLength={props.maxLength}
      valueStyle={valueStyle}
      focusOnReady={props.focusOnReady}
      focusAction={props.focusAction}
      //
      spellCheck={props.spellCheck}
      autoCapitalize={props.autoCapitalize}
      autoCorrect={props.autoCorrect}
      autoComplete={props.autoComplete}
      selectionBackground={props.selectionBackground}
      //
      onFocus={(e) => handleFocusChange(e, true)}
      onBlur={(e) => handleFocusChange(e, false)}
      onKeyDown={props.onKeyDown}
      onKeyUp={props.onKeyUp}
      onChanged={(e) => props.onChanged?.(e)}
      onEnter={props.onEnter}
      onEscape={props.onEscape}
      onTab={props.onTab}
      onDoubleClick={handleDoubleClick}
    />
  );

  return (
    <div
      {...css(styles.base as t.CssValue, props.style)}
      className={'sys.ui.TextInput'}
      onClick={props.onClick}
      onDoubleClick={props.onDoubleClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {elHint}
      {elPlaceholder}
      {elReadOnly}
      {elInput}
    </div>
  );
};

/**
 * [Helpers]
 */

const Wrangle = {
  labelDoubleClickHandler(props: Props, target: t.TextInputLabelKind) {
    return (e: React.MouseEvent) => {
      const LEFT = 0;
      if (e.button === LEFT) {
        props.onLabelDoubleClick?.({ target });
      }
    };
  },
};
