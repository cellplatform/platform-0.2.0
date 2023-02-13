import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, Icons } from '../common';

export type MediaControlsProps = {
  self: t.Peer;
  muted?: boolean;
  style?: t.CssValue;
};

export const MediaControls: React.FC<MediaControlsProps> = (props) => {
  const { muted = false } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: Color.format(0.6),
      backdropFilter: 'blur(10px)',
      Padding: [5, 15],
      borderRadius: 5,
      display: 'grid',
      placeItems: 'center',
    }),
    icon: css({}),
  };

  const Icon = muted ? Icons.Mic.Off : Icons.Mic.On;

  return (
    <div {...css(styles.base, props.style)}>
      <Icon style={styles.icon} />
    </div>
  );
};
