import { COLORS, css, Icons, type t } from '../common';

export type NetworkProps = {
  syncDoc?: t.CrdtDocSync<any>;
  style?: t.CssValue;
};

const MSG = {
  NOT_SYNCING: `not connected →`,
};

export const Network: React.FC<NetworkProps> = (props) => {
  const { syncDoc } = props;
  const isSyncing = Boolean(syncDoc);

  /**
   * [Render]
   */
  const styles = {
    base: css({ Flex: 'x-center-center' }),
    msg: css({ marginRight: 6, opacity: isSyncing ? 1 : 0.3 }),
    networkIcon: css({ opacity: isSyncing ? 1 : 0.2 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      {!isSyncing && <div {...styles.msg}>{MSG.NOT_SYNCING}</div>}
      <Icons.Network.Antenna size={15} color={COLORS.DARK} style={styles.networkIcon} />
    </div>
  );
};
