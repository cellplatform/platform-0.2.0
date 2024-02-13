import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export const List: React.FC<Y.ModuleNamespaceListProps> = (props) => {
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
      <div>{`🐷 ModuleNamespaceList`}</div>
    </div>
  );
};
