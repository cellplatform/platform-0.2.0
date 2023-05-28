import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC, Switch } from '../common';

export type SpecRowProps = {
  style?: t.CssValue;
};

export const SpecRow: React.FC<SpecRowProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      display: 'grid',
      gridTemplateColumns: '1fr auto',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 SpecRow`}</div>
      <Switch height={12} />
    </div>
  );
};
