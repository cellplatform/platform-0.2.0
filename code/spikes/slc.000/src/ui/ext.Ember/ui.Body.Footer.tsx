import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export type FooterProps = {
  slug?: t.VideoConceptSlug;
  style?: t.CssValue;
};

export const Footer: React.FC<FooterProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({ padding: 5 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 Footer`}</div>
    </div>
  );
};
