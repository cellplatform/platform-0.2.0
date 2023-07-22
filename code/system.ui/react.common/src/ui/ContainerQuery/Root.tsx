import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export const ContainerQuery: React.FC<t.ContainerQueryProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 ContainerQuery`}</div>
    </div>
  );
};
