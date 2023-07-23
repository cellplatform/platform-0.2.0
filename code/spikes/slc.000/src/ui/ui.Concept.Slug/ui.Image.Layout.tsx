import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from '../common';

export type ImageLayoutProps = {
  slug?: t.ConceptSlug;
  style?: t.CssValue;
};

export const ImageLayout: React.FC<ImageLayoutProps> = (props) => {
  const { slug } = props;

  console.log('slug/image', slug);

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
      <div>{`🐷 ImageLayout`}</div>
    </div>
  );
};
