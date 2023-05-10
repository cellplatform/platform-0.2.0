import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, DEFAULTS, Icons } from './common';
import { ToolButton } from './ui.ToolButton';

export type PeerControlBarProps = {
  camera?: MediaStream;
  screen?: MediaStream;
  style?: t.CssValue;
};

export const PeerControlBar: React.FC<PeerControlBarProps> = (props) => {
  const { camera, screen } = props;


  /**
   * [Render]
   */
  const styles = {
    base: css({
      userSelect: 'none',
      fontSize: DEFAULTS.fontSize,
      minHeight: DEFAULTS.minRowHeight,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(10px, 1fr))',
      // columnGap: 10,
    }),
    icoDoc: css({ marginLeft: 10 }),
  };

  const icoColor = Color.alpha(COLORS.DARK, 0.8);
  const elIconDoc = <Icons.Network.Docs size={15} color={icoColor} style={styles.icoDoc} />;

  const elTool = <ToolButton />;

  return (
    <div {...css(styles.base, props.style)}>
      {elTool}
      {elTool}
      {elTool}
    </div>
  );
};
