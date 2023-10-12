import { RefObject, useEffect, useRef, useState } from 'react';
import { RenderCount } from '../RenderCount';
import { css, DEFAULTS, Keyboard, rx, Style, useClickOutside, type t } from './common';

import { Label } from './ui.Label';
import { Left } from './ui.Root.Left';
import { Right } from './ui.Root.Right';
import { Wrangle } from './Wrangle';

type Props = t.LabelItemProps & { inputRef: RefObject<t.TextInputRef> };

export const View: React.FC<Props> = (props) => {
  const {
    inputRef,
    index = DEFAULTS.index,
    total = DEFAULTS.total,
    indent = DEFAULTS.indent,
    padding = DEFAULTS.padding,
    tabIndex = DEFAULTS.tabIndex,
    focused = DEFAULTS.focused,
    selected = DEFAULTS.selected,
    borderRadius = DEFAULTS.borderRadius,
    item = {},
    debug,
  } = props;
  const { enabled = DEFAULTS.enabled, editing = DEFAULTS.editing } = item;
  const position = { index, total };
  const ref = useRef<HTMLDivElement>(null);

  const [isOver, setOver] = useState(false);
  const over = (isOver: boolean) => () => setOver(isOver);

  type ClickTarget = t.LabelItemClickHandlerArgs['target'];
  type ClickKind = t.LabelItemClickHandlerArgs['kind'];
  const clickArgs = (kind: ClickKind, target: ClickTarget): t.LabelItemClickHandlerArgs => {
    return { position, focused, selected, editing, target, kind };
  };

  useClickOutside({
    ref,
    callback(e) {
      if (editing) {
        inputRef.current?.blur();
        props.onEditClickAway?.(clickArgs('Single', 'Away'));
      }
    },
  });

  /**
   * Handlers
   */
  const onFocusHandler = (focused: boolean) => {
    return () => {
      props.onFocusChange?.({ position, focused });
    };
  };

  const clickHandler = (
    kind: ClickKind,
    target: ClickTarget,
    handler?: t.LabelItemClickHandler,
  ) => {
    return () => handler?.(clickArgs(kind, target));
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

    const fire = (e: t.KeyboardState, handler?: t.LabelItemKeyHandler) => {
      if (!e.last || !handler) return;
      const { is, keypress } = e.last;
      const code = keypress.code;
      handler({ position, focused, selected, editing, code, is, keypress });
    };

    const $ = Keyboard.until(dispose$).$.pipe(rx.filter(() => focused));
    const stage = (stage: t.KeyPressStage) => $.pipe(rx.filter((e) => e.last?.stage === stage));
    stage('Down').subscribe((e) => fire(e, props.onKeyDown));
    stage('Up').subscribe((e) => fire(e, props.onKeyUp));

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
      gridTemplateColumns: `${autoOrEmpty(item.left)} 1fr ${autoOrEmpty(item.right)}`,
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
      onMouseDown={clickHandler('Single', 'Item', props.onClick)}
      onDoubleClick={clickHandler('Double', 'Item', props.onDoubleClick)}
    >
      {props.renderCount && <RenderCount {...props.renderCount} />}
      <div {...styles.body}>
        {item.left !== null && <Left {...props} />}
        <Label
          {...props}
          inputRef={inputRef}
          onDoubleClick={clickHandler('Double', 'Item:Label', props.onLabelDoubleClick)}
          debug={debug}
        />
        {item.right !== null && <Right {...props} />}
      </div>
      {elDisabled}
      {elFocusBorder}
    </div>
  );
};

/**
 * [Helpers]
 */
function autoOrEmpty(value: any) {
  return value === null ? '' : 'auto';
}