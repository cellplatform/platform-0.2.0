import { useState } from 'react';

import { COLORS, css, FC, Style, t } from '../common';
import { DEFAULT } from './DEFAULT.mjs';

export type ButtonProps = {
  children?: JSX.Element | string | number;
  label?: string;
  isEnabled?: boolean;
  block?: boolean;
  tooltip?: string;

  style?: t.CssValue;
  margin?: t.CssEdgesInput;
  padding?: t.CssEdgesInput;
  minWidth?: number;
  maxWidth?: number;
  disabledOpacity?: number;
  userSelect?: boolean;
  pressedOffset?: [number, number];

  onClick?: React.MouseEventHandler;
  onMouseDown?: React.MouseEventHandler;
  onMouseUp?: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
  onDoubleClick?: React.MouseEventHandler;
};

const View: React.FC<ButtonProps> = (props) => {
  const {
    isEnabled = DEFAULT.isEnabled,
    block = DEFAULT.block,
    disabledOpacity = DEFAULT.disabledOpacity,
    userSelect = DEFAULT.userSelect,
    pressedOffset = DEFAULT.pressedOffset,
  } = props;

  const [isOver, setIsOver] = useState(false);
  const [isDown, setIsDown] = useState(false);

  const over = (isOver: boolean): React.MouseEventHandler => {
    return (e) => {
      setIsOver(isOver);
      if (!isOver && isDown) setIsDown(false);
      if (isEnabled) {
        if (isOver && props.onMouseEnter) props.onMouseEnter(e);
        if (!isOver && props.onMouseLeave) props.onMouseLeave(e);
      }
    };
  };

  const down = (isDown: boolean): React.MouseEventHandler => {
    return (e) => {
      setIsDown(isDown);
      if (isEnabled) {
        if (isDown && props.onMouseDown) props.onMouseDown(e);
        if (!isDown && props.onMouseUp) props.onMouseUp(e);
        if (!isDown && props.onClick) props.onClick(e);
      }
    };
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      ...Style.toMargins(props.margin),
      ...Style.toPadding(props.padding),
      display: block ? 'block' : 'inline-block',
      minWidth: props.minWidth,
      maxWidth: props.maxWidth,
      opacity: isEnabled ? 1 : disabledOpacity,
      cursor: isEnabled ? 'pointer' : 'default',
      color: Wrangle.color({ isEnabled, isOver }),
      userSelect: userSelect ? 'default' : 'none',
      transform: Wrangle.pressedOffset({ isEnabled, isOver, isDown, pressedOffset }),
    }),
    label: css({}),
  };

  return (
    <div
      {...css(styles.base, props.style)}
      title={props.tooltip}
      onMouseEnter={over(true)}
      onMouseLeave={over(false)}
      onMouseDown={down(true)}
      onMouseUp={down(false)}
      onDoubleClick={props.onDoubleClick}
    >
      {props.label && <div {...styles.label}>{props.label}</div>}
      {props.children}
    </div>
  );
};

/**
 * [Helpers]
 */

const Wrangle = {
  color(args: { isEnabled: boolean; isOver: boolean }) {
    const { isEnabled, isOver } = args;
    if (!isEnabled) return COLORS.DARK;
    return isOver ? COLORS.BLUE : COLORS.DARK;
  },
  pressedOffset(args: {
    isEnabled: boolean;
    isOver: boolean;
    isDown: boolean;
    pressedOffset: [number, number];
  }) {
    const { isEnabled, isOver, isDown, pressedOffset } = args;
    if (!isEnabled) return undefined;
    if (!isOver) return undefined;
    if (!isDown) return undefined;
    return `translateX(${pressedOffset[0]}px) translateY(${pressedOffset[1]}px)`;
  },
};

/**
 * [Export]
 */

type Fields = {
  DEFAULT: typeof DEFAULT;
};
export const Button = FC.decorate<ButtonProps, Fields>(
  View,
  { DEFAULT },
  { displayName: 'Button' },
);
