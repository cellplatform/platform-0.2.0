import { RefObject, useState, useEffect } from 'react';
import { DEFAULTS, Keyboard, RenderCount, Style, css, useClickOutside, type t } from './common';

import { Wrangle } from './Wrangle';
import { Label } from './ui.Label';
import { Left } from './ui.Root.Left';
import { Right } from './ui.Root.Right';
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
  } = props;
  const { enabled = DEFAULTS.enabled } = item;
  const position = { index, total };

  const { ref } = useListContext(position, { id });
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
    return () => handler?.(clickArgs(kind, target));
  };

  /**
   * Keyboard input
   */
  useEffect(() => {
    const isActive = selected && focused && !editing;
    const fire = (e: KeyboardEvent, handler?: t.LabelItemKeyHandler) => {
      const { is, handled, code } = Keyboard.toKeypress(e);
      handler?.({ position, focused, selected, editing, is, code, handled });
    };

    const onKeydown = (e: KeyboardEvent) => fire(e, props.onKeyDown);
    const onKeyup = (e: KeyboardEvent) => fire(e, props.onKeyUp);
    if (isActive) {
      document.addEventListener('keydown', onKeydown);
      document.addEventListener('keyup', onKeyup);
    }

    return () => {
      if (isActive) {
        document.removeEventListener('keydown', onKeydown);
        document.removeEventListener('keydown', onKeyup);
      }
    };
  }, [selected, focused, editing]);

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
