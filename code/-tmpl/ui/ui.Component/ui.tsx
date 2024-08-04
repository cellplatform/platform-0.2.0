import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

type P = t.RootProps;

export const View: React.FC<P> = (props) => {
  console.log(DEFAULTS.displayName, props); // TEMP 🐷

  /**
   * Render
   */
  const t = (ms: t.Msecs, ...attr: string[]) => attr.map((prop) => `${prop} ${ms}ms ease-in-out`);
  const transition = t(50, 'opacity');
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      color: theme.fg,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 ${DEFAULTS.name}`}</div>
    </div>
  );
};
