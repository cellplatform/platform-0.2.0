import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from '../common';

export const ConceptPlayer: React.FC<t.ConceptPlayerProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      padding: 10,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 ConceptPlayer`}</div>
    </div>
  );
};
