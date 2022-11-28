import { CSSProperties } from 'react';
import PuffLoader from 'react-spinners/PuffLoader';

import { COLORS, css, FC, t } from '../common';
import { Center } from '../ui.Center';

export type SpinnerProps = {
  size?: number;
  style?: t.CssValue;
};

const View: React.FC<SpinnerProps> = (props) => {
  const { size = 48 } = props;
  const isLoading = true;
  const color = COLORS.DARK;
  const cssOverride: CSSProperties = {};

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    inner: css({
      position: 'relative',
      top: -5,
      left: -5,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.inner}>
        <PuffLoader color={color} loading={isLoading} size={size} cssOverride={cssOverride} />
      </div>
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  Center: typeof Center;
};

export const Spinner = FC.decorate<SpinnerProps, Fields>(
  View,
  { Center },
  { displayName: 'Spinner' },
);
