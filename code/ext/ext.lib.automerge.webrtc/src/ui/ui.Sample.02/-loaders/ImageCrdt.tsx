import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from '../common';

export type ImageCrdtProps = {
  store: t.Store;
  docuri: string;
  style?: t.CssValue;
};

export const ImageCrdt: React.FC<ImageCrdtProps> = (props) => {
  /**
   * Render
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 ImageCrdt`}</div>
    </div>
  );
};
