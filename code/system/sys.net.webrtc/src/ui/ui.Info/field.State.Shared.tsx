import { t, Value, Icons, COLORS, Color, Crdt, css, Filesize } from './common';
import { useSyncTraffic } from './useSyncTraffic.mjs';

export function FieldStateShared(
  fields: t.WebRtcInfoField[],
  data: t.WebRtcInfoData,
  info?: t.WebRtcInfo,
): t.PropListItem {
  const self = data.self;
  const peer = self?.peer;
  const shared = data.state?.shared ?? {};
  const label = shared.title ?? 'Shared State';

  return {
    label,
    value: {
      data: <Syncers info={info} />,
      onClick(e) {
        const doc = info?.state.current;
        const data = doc ? Crdt.toObject(doc.network) : undefined;
        console.info('shared/state.network', data);
      },
    },
  };
}

/**
 * Component
 */
export type SyncProps = {
  info?: t.WebRtcInfo;
  style?: t.CssValue;
};

export const Syncers: React.FC<SyncProps> = (props) => {
  const { syncers, bytes, messages } = useSyncTraffic(props.info);

  const isEmpty = syncers.length === 0;
  const size = Filesize(bytes, { round: 0 });
  const text = `${messages} ${Value.plural(messages, 'message', 'messages')}, ${size}`;

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    empty: css({ opacity: 0.3 }),
    icon: css({ position: 'relative', top: -1 }),
    body: css({
      display: 'grid',
      alignContent: 'center',
      gridTemplateColumns: '1fr auto auto',
      columnGap: 6,
    }),
  };

  const Icon = Icons.Network.Docs;
  const elIcon = <Icon size={15} color={Color.alpha(COLORS.DARK, 0.8)} style={styles.icon} />;
  const elEmpty = isEmpty && <div {...styles.empty}>{elIcon}</div>;
  const elBody = !isEmpty && (
    <div {...styles.body}>
      <div />
      <div>{text}</div>
      {elIcon}
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elEmpty}
      {elBody}
    </div>
  );
};
