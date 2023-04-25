import { useEffect, useRef, useState } from 'react';
import { FC, Color, COLORS, css, t, rx, DEFAULTS } from './common';
import { Footer } from './ui.Footer';

const View: React.FC<t.ConnectInputProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      // backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  /**
   * TODO 🐷
   */

  const elBody = props.self && (
    <Footer
      {...props}
      // self={props.self}
      // showPeer={props.showPeer}
      // showConnect={props.showConnect}
      // isSpinning={props.isSpinning}
    />
  );

  return <div {...css(styles.base, props.style)}>{elBody}</div>;
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const ConnectInput = FC.decorate<t.ConnectInputProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'ConnectInput' },
);
