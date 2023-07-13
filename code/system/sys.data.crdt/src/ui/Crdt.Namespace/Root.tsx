import { CrdtLens, DEFAULTS, FC, LabelItem, css, type t } from './common';

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
      {/* <CrdtNamespaceItem {...props} enabled={enabled} text={'foo'} style={styles.item} /> */}
      <LabelItem enabled={enabled} text={'foo 🐷'} style={styles.item} />
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  // Item: typeof CrdtNamespaceItem;
  ns: typeof CrdtLens.namespace;
};
export const CrdtNamespace = FC.decorate<t.CrdtNsProps, Fields>(
  View,
  { DEFAULTS, ns },
  { displayName: 'Crdt.Namespace' },
);
