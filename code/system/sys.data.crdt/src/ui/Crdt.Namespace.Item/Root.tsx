import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from '../common';

const View: React.FC<t.CrdtNamespaceItemProps> = (props) => {
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
      <div>{`🐷 CrdtNamespace:Item`}</div>
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const CrdtNamespaceItem = FC.decorate<t.CrdtNamespaceItemProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Crdt.Namespace.Item' },
);
