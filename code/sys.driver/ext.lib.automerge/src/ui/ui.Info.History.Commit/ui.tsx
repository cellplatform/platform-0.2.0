import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export const View: React.FC<t.HistoryCommitProps> = (props) => {
  const { theme, commit } = props;

  console.group('🌳 commit');
  console.log('change', commit?.change);
  console.log('snapshot', commit?.snapshot);
  console.groupEnd();

  /**
   * Render
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      display: 'grid',
      placeItems: 'center',
      padding: 5,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 ${DEFAULTS.displayName}`}</div>
    </div>
  );
};
