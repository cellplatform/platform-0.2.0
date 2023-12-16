import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export const View: React.FC<t.PeerRepoListProps> = (props) => {
  /**
   * Render
   */
  const styles = {
    base: css({
      padding: 5,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 ${PeerRepoList.displayName}`}</div>
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const PeerRepoList = FC.decorate<t.PeerRepoListProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: DEFAULTS.displayName },
);
