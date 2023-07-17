import { RefObject, useRef, useState } from 'react';
import { css, DEFAULTS, Style, useClickOutside, type t } from './common';

import { Label } from './ui.Label';
import { LeftAction } from './ui.Root.Left.Action';
import { RightActions } from './ui.Root.Right.Actions';
import { Wrangle } from './Wrangle';

type Props = t.LabelItemProps & { inputRef: RefObject<t.TextInputRef> };

export const View: React.FC<Props> = (props) => {
  const {
    inputRef,
    enabled = DEFAULTS.enabled,
    indent = DEFAULTS.indent,
    padding = DEFAULTS.padding,
    focused = DEFAULTS.focused,
    tabIndex = DEFAULTS.tabIndex,
    editing = DEFAULTS.editing,
  } = props;
  const label = Wrangle.labelText(props);

  const clickArgs = (): t.LabelItemClickHandlerArgs => {
    return { label: label.text, focused, editing };
  };

  const ref = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref,
    callback(e) {
      if (editing) props.onEditClickAway?.(clickArgs());
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
    return () => {
      handler?.(clickArgs());
    };
  };

  const [isOver, setOver] = useState(false);
  const over = (isOver: boolean) => () => setOver(isOver);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      pointerEvents: enabled ? 'auto' : 'none',
      backgroundColor: Wrangle.backgroundColor(props),
      boxSizing: 'border-box',
      outline: 'none',
      opacity: enabled ? 1 : 0.4,
      filter: `blur(${enabled || isOver ? 0 : 1.5}px)`,
      transition: 'opacity 0.2s',
      ...Style.toPadding(props.padding ?? padding),
    }),
    disabled: css({
      Absolute: 0,
      pointerEvents: !enabled ? 'auto' : 'none',
      opacity: !enabled ? 1 : 0,
      transition: 'opacity 0.2s',
    }),
    body: css({
      boxSizing: 'border-box',
      marginLeft: indent,
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      columnGap: 3,
    }),
    right: css({ marginLeft: 5 }),
    focusBorder: css({
      pointerEvents: 'none',
      Absolute: 0,
      border: `solid 1px ${Wrangle.borderColor(props)}`,
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
      onDoubleClick={clickHandler(props.onDoubleClick)}
    >
      <div {...styles.body}>
        <LeftAction {...props} />
        <Label {...props} inputRef={inputRef} />
        <RightActions {...props} style={styles.right} />
      </div>
      {elDisabled}
      {elFocusBorder}
    </div>
  );
};
