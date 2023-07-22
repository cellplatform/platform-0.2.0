import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Grid } from '../common';

export const View: React.FC<t.ConceptPlayerProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      padding: 10,
    }),
    videoLayout: css({ Absolute: 0 }),
  };

  const elVideoLayout = <Grid style={styles.videoLayout} />;

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 ConceptPlayer`}</div>
      {elVideoLayout}
    </div>
  );
};
