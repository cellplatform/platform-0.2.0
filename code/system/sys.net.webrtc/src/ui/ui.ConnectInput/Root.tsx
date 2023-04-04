import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';
import { Footer } from './ui.Footer';

export const ConnectInput: React.FC<t.ConnectInputProps> = (props) => {
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
