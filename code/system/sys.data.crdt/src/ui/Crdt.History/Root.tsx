import { DEFAULTS, FC, css, type t } from './common';

export type CrdtHistoryProps = {
  style?: t.CssValue;
};

const View: React.FC<CrdtHistoryProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      padding: 10,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 CrdtHistory`}</div>
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const CrdtHistory = FC.decorate<CrdtHistoryProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Crdt.History' },
);
