import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export type EmptyProps = {
  text?: string;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const Empty: React.FC<EmptyProps> = (props) => {
  const { text = 'Nothing to display.', theme = DEFAULTS.theme } = props;

  /**
   * Render
   */
  const styles = {
    base: css({
      fontSize: 14,
      fontStyle: 'italic',
      display: 'grid',
      placeItems: 'center',
      color: theme === 'Light' ? Color.alpha(COLORS.DARK, 0.4) : Color.alpha(COLORS.WHITE, 0.6),
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{text}</div>
    </div>
  );
};
