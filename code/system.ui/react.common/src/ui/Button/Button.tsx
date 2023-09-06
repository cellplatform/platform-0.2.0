import { useState } from 'react';
import { Spinner } from '../Spinner';
import { Wrangle } from './Wrangle.mjs';
import { COLORS, DEFAULTS, FC, Style, css, type t } from './common';

const View: React.FC<t.ButtonProps> = (props) => {
  const {
    enabled: isEnabled = DEFAULTS.enabled,
    block = DEFAULTS.block,
    disabledOpacity = DEFAULTS.disabledOpacity,
    userSelect = DEFAULTS.userSelect,
    pressedOffset = DEFAULTS.pressedOffset,
    spinning = DEFAULTS.spinning,
  } = props;

  const [isOver, setOver] = useState(false);
  const [isDown, setDown] = useState(false);

  const over = (isOver: boolean): React.MouseEventHandler => {
    return (e) => {
      setOver(isOver);
      if (!isOver && isDown) setDown(false);
      if (isEnabled) {
        if (isOver && props.onMouseEnter) props.onMouseEnter(e);
        if (!isOver && props.onMouseLeave) props.onMouseLeave(e);
      }
      props.onMouse?.({
        event: e,
        isOver,
        isDown: !isOver ? false : isDown,
        isEnabled,
        action: isOver ? 'MouseEnter' : 'MouseLeave',
      });
    };
  };

  const down = (isDown: boolean): React.MouseEventHandler => {
    return (e) => {
      setDown(isDown);
      if (isEnabled) {
        if (isDown && props.onMouseDown) props.onMouseDown(e);
        if (!isDown && props.onMouseUp) props.onMouseUp(e);
        if (!isDown && props.onClick) props.onClick(e);
      }
      props.onMouse?.({
        event: e,
        isOver,
        isDown,
        isEnabled,
        action: isDown ? 'MouseDown' : 'MouseUp',
      });
    };
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      ...Style.toMargins(props.margin),
      ...Style.toPadding(props.padding),
      position: 'relative',
      display: block ? 'block' : 'inline-block',
      minWidth: props.minWidth,
      maxWidth: props.maxWidth,
      opacity: isEnabled ? 1 : disabledOpacity,
      cursor: isEnabled && !spinning ? 'pointer' : 'default',
      color: Wrangle.color({ isEnabled, isOver }),
      userSelect: userSelect ? 'auto' : 'none',
    }),
    body: css({
      transform: Wrangle.pressedOffset({ isEnabled, isOver, isDown, pressedOffset }),
      opacity: spinning ? 0.15 : 1,
      filter: `blur(${spinning ? 3 : 0}px)`,
      transition: 'opacity 0.1s ease',
    }),
    label: css({}),
    spinner: css({ Absolute: 0, display: 'grid', placeItems: 'center' }),
  };

  const elSpinner = spinning && (
    <div {...styles.spinner}>
      <Spinner.Bar color={isEnabled ? COLORS.GREEN : COLORS.DARK} width={30} {...styles.spinner} />
    </div>
  );

  return (
    <div
      role={'button'}
      {...css(styles.base, props.style)}
      title={props.tooltip}
      onMouseEnter={over(true)}
      onMouseLeave={over(false)}
      onMouseDown={down(true)}
      onMouseUp={down(false)}
      onDoubleClick={props.onDoubleClick}
    >
      <div {...styles.body}>
        {props.label && <div {...styles.label}>{props.label}</div>}
        {props.children}
      </div>
      {elSpinner}
    </div>
  );
};

/**
 * [Export]
 */

type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const Button = FC.decorate<t.ButtonProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Button' },
);
