import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common';

// import ClipLoader from 'react-spinners/ClipLoader';
import PuffLoader from 'react-spinners/PuffLoader';

export type SpinnerProps = {
  size?: number;
  style?: t.CssValue;
};

export const Spinner: React.FC<SpinnerProps> = (props) => {
  const { size = 48 } = props;
  const isLoading = true;
  const color = COLORS.DARK;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    inner: css({
      position: 'relative',
      top: -5,
      left: -5,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.inner}>
        <PuffLoader
          //
          color={color}
          loading={isLoading}
          size={size}
        />
      </div>
    </div>
  );
};
