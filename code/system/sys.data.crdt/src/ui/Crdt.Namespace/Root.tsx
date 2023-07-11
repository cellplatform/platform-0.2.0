import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, rx, FC, type t, DEFAULTS, CrdtLens } from './common';
import { CrdtNamespaceItem } from '../Crdt.Namespace.Item';

const ns = CrdtLens.namespace;

const View: React.FC<t.CrdtNsProps> = (props) => {
  const { data = DEFAULTS.data, enabled = DEFAULTS.enabled } = props;
  if (!data) return '⚠️ Not set: { data }';
  if (data.ns?.disposed) return '⚠️ Disposed: { data: { ns } }';

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    item: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <CrdtNamespaceItem {...props} enabled={enabled} namespace={'foo'} style={styles.item} />
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Item: typeof CrdtNamespaceItem;
  ns: typeof CrdtLens.namespace;
};
export const CrdtNamespace = FC.decorate<t.CrdtNsProps, Fields>(
  View,
  { DEFAULTS, ns, Item: CrdtNamespaceItem },
  { displayName: 'CrdtNamespace' },
);
