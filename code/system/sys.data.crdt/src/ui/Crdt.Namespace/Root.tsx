import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, rx, FC, type t, DEFAULTS } from './common';

const View: React.FC<t.CrdtNamespaceProps> = (props) => {
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
      <div>{`🐷 CrdtNamespace`}</div>
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const CrdtNamespace = FC.decorate<t.CrdtNamespaceProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'CrdtNamespace' },
);
