import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';

const URL = {
  FACE_1:
    'https://user-images.githubusercontent.com/185555/206095850-8b561843-50f3-4549-a5e3-dcfc6bae474d.png',
  FACE_2:
    'https://user-images.githubusercontent.com/185555/206325854-f418b496-cb14-4ff2-8f66-1c91d40ecb7a.png',
};

export type ImageProps = {
  width?: number;
  style?: t.CssValue;
};

export const Image: React.FC<ImageProps> = (props) => {
  const { width } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
    logo: css({
      width,
      borderRadius: 25,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <img src={URL.FACE_1} {...styles.logo} />
    </div>
  );
};
