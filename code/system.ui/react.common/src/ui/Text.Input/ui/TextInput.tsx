import { useEffect, useState } from 'react';

import { Event } from '../../Event';
import { css, DEFAULT, FC, rx, t, Time } from '../common';
import { TextInputEvents, TextInputMasks } from '../logic';
import { TextInputHint } from './TextInput.Hint';
import { HtmlInput } from './TextInput.Html';
import { Util } from '../util.mjs';

import type { TextInputProps } from '../types.mjs';

/**
 * Component
 */
const View: React.FC<t.TextInputProps> = (props) => {
  const {
    isPassword = false,
    isReadOnly = false,
    isEnabled = true,
    placeholder,
    valueStyle = DEFAULT.TEXT.STYLE,
    disabledOpacity = DEFAULT.DISABLED_OPACITY,
    maxLength,
  } = props;

  const instance: t.TextInputInstance = props.instance ?? { bus: rx.bus(), id: 'default' };
  const [width, setWidth] = useState<string | number | undefined>();

  const events = Event.useEventsRef(() => TextInputEvents({ instance }));
  const value = Util.value.format(props.value, maxLength);
  const hasValue = value.length > 0;

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const { autoSize } = props;
    if (autoSize) Time.delay(0, async () => setWidth(await Util.css.toWidth(props))); // NB: Delay is so size measurement returns accurate number.
    if (!autoSize) setWidth(undefined);
  }, [value, props.autoSize]); // eslint-disable-line

  /**
   * [Handlers]
   */
  const fire = (e: t.TextInputEvent) => instance.bus.fire(e);

  const handleChange = (e: t.TextInputChangeEvent) => {
    // Fire the BEFORE event.
    let isCancelled = false;
    fire({
      type: 'sys.ui.TextInput/Changing',
      payload: {
        ...e,
        get isCancelled() {
          return isCancelled;
        },
        cancel() {
          isCancelled = true;
        },
      },
    });

    if (isCancelled) return;

    // Fire AFTER event.
    fire({ type: 'sys.ui.TextInput/Changed', payload: e });
    props.onChange?.(e);
  };

  const handleInputDblClick = (e: React.MouseEvent) => {
    // NB: When the <input> is dbl-clicked and there is no value
    //     it is deduced that the placeholder was clicked.
    if (!hasValue) labelDoubleClickHandler('Placeholder')(e);
  };

  const labelDoubleClickHandler = (target: t.TextInputLabelDoubleClicked['target']) => {
    return (e: React.MouseEvent) => {
      const button = e.button === 2 ? 'Left' : 'Right';
      fire({
        type: 'sys.ui.TextInput/Label/DoubleClicked',
        payload: { instance: instance.id, target, button },
      });
    };
  };

  /**
   * [Render]
   */

  const styles = {
    base: {
      position: 'relative',
      boxSizing: 'border-box',
      lineHeight: 0,
      width,
    } as const,
    inner: { position: 'relative' } as const,
    placeholder: {
      Absolute: 0,
      opacity: isEnabled ? 1 : disabledOpacity,
      transition: `opacity 200ms`,
      Flex: 'x-center-start',
      paddingLeft: 2, // Ensure the placeholder does not bump into the input-caret.
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      userSelect: 'none',
      pointerEvents: 'none',
    } as const,
    readonly: { userSelect: 'auto' } as const,
    input: {
      visibility: isReadOnly ? 'hidden' : 'visible',
      pointerEvents: isReadOnly ? 'none' : 'auto',
    } as const,
  };

  const elPlaceholder = !hasValue && placeholder && (
    <div
      {...css(styles.placeholder, Util.css.toPlaceholder(props))}
      onDoubleClick={labelDoubleClickHandler('Placeholder')}
    >
      {placeholder}
    </div>
  );

  const elReadOnly = isReadOnly && !elPlaceholder && (
    <div
      {...css(valueStyle as t.CssValue, styles.placeholder, styles.readonly)}
      onDoubleClick={labelDoubleClickHandler('ReadOnly')}
    >
      {value}
    </div>
  );

  const elHint = hasValue && props.hint && (
    <TextInputHint valueStyle={valueStyle} value={value} hint={props.hint} />
  );

  const elInput = (
    <HtmlInput
      instance={instance}
      events={events}
      style={styles.input}
      className={props.className}
      isEnabled={isEnabled}
      isPassword={isPassword}
      disabledOpacity={disabledOpacity}
      value={value}
      maxLength={props.maxLength}
      mask={props.mask}
      valueStyle={valueStyle}
      focusOnLoad={props.focusOnLoad}
      focusAction={props.focusAction}
      onKeyDown={props.onKeyDown}
      onKeyUp={props.onKeyUp}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onChange={handleChange}
      onEnter={props.onEnter}
      onEscape={props.onEscape}
      onTab={props.onTab}
      onDoubleClick={handleInputDblClick}
      spellCheck={props.spellCheck}
      autoCapitalize={props.autoCapitalize}
      autoCorrect={props.autoCorrect}
      autoComplete={props.autoComplete}
      selectionBackground={props.selectionBackground}
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
 * Export
 */
type Fields = {
  Events: typeof TextInputEvents;
  Masks: typeof TextInputMasks;
};
export const TextInput = FC.decorate<TextInputProps, Fields>(
  View,
  { Events: TextInputEvents, Masks: TextInputMasks },
  { displayName: 'TextInput' },
);
