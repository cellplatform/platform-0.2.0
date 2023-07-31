import { useEffect, useRef, useState } from 'react';
import { PlayButton, Color, COLORS, css, DEFAULTS, FC, rx, type t, ProgressBar } from './common';

const View: React.FC<t.PlayBarProps> = (props) => {
  /**
   * [Render]
   */
  const height = DEFAULTS.height;
  const styles = {
    base: css({
      height,
      boxSizing: 'border-box',

      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      alignContent: 'center',
      columnGap: 10,
    }),
    button: css({}),
    bar: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <PlayButton style={styles.button} />
      <ProgressBar style={styles.bar} height={height} />
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const PlayBar = FC.decorate<t.PlayBarProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'PlayBar' },
);
