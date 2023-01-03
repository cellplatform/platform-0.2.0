import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';
import { Icons } from '../Icons.mjs';

export type ButtonIconProps = {
  isDown?: boolean;
  isOver?: boolean;
  icon?: t.IconRenderer;
  style?: t.CssValue;
};

export const ButtonIcon: React.FC<ButtonIconProps> = (props) => {
  const { isOver } = props;
  const Size = 22;
  const color = isOver ? COLORS.BLUE : Color.alpha(COLORS.DARK, 0.6);
  const Icon = props.icon ?? Icons.Method;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Size,
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'start',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Icon size={Size} color={color} />
    </div>
  );
};
