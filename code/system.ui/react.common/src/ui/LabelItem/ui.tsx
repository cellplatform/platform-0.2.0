import React, { RefObject, useRef, useState } from 'react';
import { DEFAULTS, Focus, RenderCount, Style, css, useClickOutside, type t } from './common';

import { Wrangle } from './Wrangle';
import { Label } from './ui.Label';
import { Left } from './ui.Root.Left';
import { Right } from './ui.Root.Right';
import { useKeyboard } from './use.Keyboard';
import { useListContext } from './use.ListContext';

type Props = t.LabelItemProps & { textboxRef: RefObject<t.TextInputRef> };

export const View: React.FC<Props> = (props) => {
  const {
    textboxRef,
    debug,
    id,
    index = DEFAULTS.index,
    total = DEFAULTS.total,
    indent = DEFAULTS.indent,
    padding = DEFAULTS.padding,
    tabIndex = DEFAULTS.tabIndex,
    focused = DEFAULTS.focused,
    selected = DEFAULTS.selected,
    editing = DEFAULTS.editing,
    borderRadius = DEFAULTS.borderRadius,
    item = {},
    onKeyDown,
    onKeyUp,
  } = props;
  const { enabled = DEFAULTS.enabled } = item;
  const position = { index, total };

  const ref = useRef<HTMLDivElement>(null);
  useListContext(ref, position, { id });
  useKeyboard({ position, selected, focused, editing, onKeyDown, onKeyUp });
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
      if (!editing) return;
      textboxRef.current?.blur();
      props.onEditClickAway?.(clickArgs('Single', 'Away'));
    },
  });

  /**
   * Handlers
   */
  const onFocusHandler = (focused: boolean) => {
    return () => props.onFocusChange?.({ position, focused });
  };

  const clickHandler = (
    kind: ClickKind,
    target: ClickTarget,
    handler?: t.LabelItemClickHandler,
  ) => {
    return (ev: any) => {
      const e = ev as React.MouseEvent;
      if (kind === 'Single' && target === 'Item') {
        // Ensure focused if this was not a "programmatically" enduced selection.
        // NOTE:
        //    Programmatic selection via command uses
        //    dispatches a synthetic mousedown event.
        const isProgrammaticSelect = e.detail === DEFAULTS.syntheticMousedownDetail;
        if (!isProgrammaticSelect && !Focus.containsFocus(ref)) ref.current?.focus();
      }
      handler?.(clickArgs(kind, target));
    };
  };

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
      data-id={Wrangle.dataid.item(props.id)}
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
          inputRef={textboxRef}
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
