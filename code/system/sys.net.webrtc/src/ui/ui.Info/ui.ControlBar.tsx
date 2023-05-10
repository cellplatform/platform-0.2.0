import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, DEFAULTS, Icons } from './common';

export type ControlBarProps = {
  camera?: MediaStream;
  screen?: MediaStream;
  style?: t.CssValue;
};

export const ControlBar: React.FC<ControlBarProps> = (props) => {
  const { camera, screen } = props;


  /**
   * [Render]
   */
  const styles = {
    base: css({
      fontSize: DEFAULTS.fontSize,
      userSelect: 'none',
      display: 'grid',
    }),
    icoDoc: css({ marginLeft: 10 }),
  };

  const icoColor = Color.alpha(COLORS.DARK, 0.8);

  const elIconDoc = <Icons.Network.Docs size={15} color={icoColor} style={styles.icoDoc} />;

  return <div {...css(styles.base, props.style)}>{elIconDoc}</div>;
};
