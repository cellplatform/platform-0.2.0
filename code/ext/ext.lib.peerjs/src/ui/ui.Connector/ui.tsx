import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export const View: React.FC<t.RootProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
    }),
  };

  return <div {...css(styles.base, props.style)}>{'🐷 Peer Connector'}</div>;
};
