import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, rx, FC, type t } from '../common';

export type GroupVideoProps = {
  style?: t.CssValue;
};

export const GroupVideo: React.FC<GroupVideoProps> = (props) => {
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
      <div>{`🐷 GroupVideo`}</div>
    </div>
  );
};
