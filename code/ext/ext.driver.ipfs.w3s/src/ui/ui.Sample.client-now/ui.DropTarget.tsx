import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export type DropTargetProps = {
  style?: t.CssValue;
};

export const DropTarget: React.FC<DropTargetProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      padding: 8,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 DropTarget`}</div>
    </div>
  );
};
