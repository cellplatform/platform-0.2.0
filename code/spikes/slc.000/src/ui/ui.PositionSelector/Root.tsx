import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Grid } from './common';

export const PositionSelector: React.FC<t.PositionSelectorProps> = (props) => {
  const { size = DEFAULTS.size } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      Size: size,
    }),
    grid: css({ Absolute: 0 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Grid
        style={styles.grid}
        config={{
          total: 3,
        }}
      />
    </div>
  );
};
