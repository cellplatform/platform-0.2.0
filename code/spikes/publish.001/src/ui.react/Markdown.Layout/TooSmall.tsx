import { useEffect, useRef, useState } from 'react';

import { css, FC, t } from '../common';

export type TooSmallProps = {
  style?: t.CssValue;
};

export const TooSmall: React.FC<TooSmallProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      Flex: 'center-center',
      backgroundColor: 0.3,
      backdropFilter: 'blur(18px)',
      userSelect: 'none',
    }),
    body: css({
      Flex: 'y-center-center',
      Padding: [0, 30],
    }),
    title: css({
      fontSize: 38,
      marginBottom: 5,
      '@media (max-width: 391px)': { marginBottom: 20 },
    }),
    detail: css({
      fontSize: 18,
      lineHeight: '1.4em',
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <div {...styles.title}>{'Screen too small.'}</div>
        <div {...styles.detail}>{'Please expand or view on your laptop/desktop.'}</div>
      </div>
    </div>
  );
};
