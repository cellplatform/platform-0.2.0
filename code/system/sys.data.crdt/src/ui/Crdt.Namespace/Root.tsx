import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, rx, FC, type t, DEFAULTS, CrdtLens } from './common';
import { NamespaceItem } from './ui.Namespace.Item';

const ns = CrdtLens.namespace;

const View: React.FC<t.CrdtNamespaceProps> = (props) => {
  const { enabled = DEFAULTS.enabled } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    item: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <NamespaceItem {...props} enabled={enabled} name={'foo'} style={styles.item} />
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  ns: typeof CrdtLens.namespace;
};
export const CrdtNamespace = FC.decorate<t.CrdtNamespaceProps, Fields>(
  View,
  { DEFAULTS, ns },
  { displayName: 'CrdtNamespace' },
);
