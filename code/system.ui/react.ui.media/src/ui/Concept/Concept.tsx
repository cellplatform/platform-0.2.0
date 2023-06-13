import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, rx, FC, type t } from '../common';

export type ConceptProps = {
  style?: t.CssValue;
};

export const Concept: React.FC<ConceptProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 Concept`}</div>
    </div>
  );
};
