import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Hash } from './common';

export type MonoHashProps = {
  hash?: string;
  length?: number;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const MonoHash: React.FC<MonoHashProps> = (props) => {
  const { hash = '', theme, length = DEFAULTS.hash.length } = props;
  const short = Hash.shorten(hash, [0, length]);

  /**
   * Render
   */
  const color = Color.fromTheme(theme);
  const styles = {
    base: css({ color, Flex: 'x-center-center' }),
    mono: css(DEFAULTS.mono),
    pound: css({ color, opacity: 0.4, marginRight: 3 }),
  };

  return (
    <div {...css(styles.base, styles.mono, props.style)}>
      <span {...styles.pound}>{`#`}</span>
      <span>{short}</span>
    </div>
  );
};
