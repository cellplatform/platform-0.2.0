import { RefObject, useEffect, useRef, useState } from 'react';
import { css, DEFAULTS, Keyboard, rx, Style, useClickOutside, type t } from './common';

import { Label } from './ui.Label';
import { Left } from './ui.Root.Left';
import { Right } from './ui.Root.Right';
import { Wrangle } from './Wrangle';

type Props = t.LabelItemProps & { inputRef: RefObject<t.TextInputRef> };

export const View: React.FC<Props> = (props) => {
  const {
    inputRef,
    indent = DEFAULTS.indent,
    padding = DEFAULTS.padding,
    tabIndex = DEFAULTS.tabIndex,
    enabled = DEFAULTS.enabled,
    focused = DEFAULTS.focused,
    editing = DEFAULTS.editing,
    borderRadius = DEFAULTS.borderRadius,
    debug,
  } = props;
  const label = Wrangle.labelText(props);
  const ref = useRef<HTMLDivElement>(null);

  const [isOver, setOver] = useState(false);
  const over = (isOver: boolean) => () => setOver(isOver);

  const clickArgs = (): t.LabelItemClickHandlerArgs => {
    return { label: label.text, focused, editing };
  };

  useClickOutside({
    ref,
    callback(e) {
      if (editing) {
        inputRef.current?.blur();
        props.onEditClickAway?.(clickArgs());
      }
    },
  });

  /**
   * Handlers
   */
  const onFocusHandler = (focused: boolean) => {
    return () => {
      props.onFocusChange?.({
        focused,
        label: label.text,
      });
    };
  };

  const clickHandler = (handler?: t.LabelItemClickHandler) => {
    return () => handler?.(clickArgs());
  };

  /**
   * Lifecycle
   */
  useEffect(() => {
    // HACK: When editing stopped, if the item was focused (within the textbox)
    //       ensure that focus state is retained on the root DOM element.
    if (!editing && focused) ref.current?.focus();
  }, [editing]);

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    // NB: The "is editing" version of this event happens within the <TextInput> component.
    const fire = () => {
      if (!focused || editing) return;
      /**
       * TODO 🐷
       * - fire the "not editing" version of the event
       * - BUG: this currently causes a feedback loop.
       */
      // props.onEnter?.({ label: label.text, editing });
    };
    Keyboard.until(dispose$).on('Enter', fire);

    return dispose;
  }, [editing, focused]);

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      pointerEvents: enabled ? 'auto' : 'none',
      backgroundColor: Wrangle.backgroundColor(props),
      borderRadius,
      boxSizing: 'border-box',
      outline: 'none',
      opacity: enabled ? 1 : 0.4,
      filter: `blur(${enabled || isOver ? 0 : 1.5}px)`,
      transition: 'opacity 0.2s',
      ...Style.toPadding(props.padding ?? padding),
    }),
    body: css({
      boxSizing: 'border-box',
      marginLeft: indent,
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      columnGap: 3,
    }),
    focusBorder: css({
      Absolute: 0,
      pointerEvents: 'none',
      border: `solid 1px ${Wrangle.borderColor(props)}`,
    }),
    disabled: css({
      Absolute: 0,
      pointerEvents: !enabled ? 'auto' : 'none',
      opacity: !enabled ? 1 : 0,
      transition: 'opacity 0.2s',
    }),
  };

  const elFocusBorder = focused && <div {...styles.focusBorder} />;
  const elDisabled = <div {...styles.disabled} />;

  return (
    <div
      ref={ref}
      {...css(styles.base, props.style)}
      tabIndex={tabIndex}
      onFocus={onFocusHandler(true)}
      onBlur={onFocusHandler(false)}
      onMouseEnter={over(true)}
      onMouseLeave={over(false)}
      onMouseDown={clickHandler(props.onClick)}
    >
      <div {...styles.body}>
        <Left {...props} />
        <Label
          {...props}
          inputRef={inputRef}
          onDoubleClick={clickHandler(props.onLabelDoubleClick)}
          debug={debug}
        />
        <Right {...props} />
      </div>
      {elDisabled}
      {elFocusBorder}
    </div>
  );
};
