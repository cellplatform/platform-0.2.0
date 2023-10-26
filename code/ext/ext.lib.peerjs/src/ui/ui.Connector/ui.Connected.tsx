import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export type ConnectedProps = {
  ctx: t.GetConnectorCtx;
  selected?: boolean;
  focused?: boolean;
  style?: t.CssValue;
};

export const Connected: React.FC<ConnectedProps> = (props) => {
  /**
   * Render
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 `}</div>
    </div>
  );
};
