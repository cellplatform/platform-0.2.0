import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export const View: React.FC<t.RepoListVirtualProps> = (props) => {
  /**
   * Render
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      padding: 5,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 ${DEFAULTS.displayName}`}</div>
    </div>
  );
};
