import { PeerInput } from '../ui.PeerInput';
import { COLORS, Color, DEFAULTS, css, type t } from './common';

export type ConnectInputEdgeProps = t.ConnectProps & {
  targetEdge: t.VEdge;
};

export const ConnectInputEdge: React.FC<ConnectInputEdgeProps> = (props) => {
  const { targetEdge, edge = DEFAULTS.edge } = props;
  const data = props.info?.connect;
  const self = data?.self;
  const is = {
    top: edge === 'Top',
    bottom: edge === 'Bottom',
  } as const;

  if (!data || !self) return null;
  if (edge !== targetEdge) return null;

  const handleToggleClick = () => {
    const showing = Boolean(props.showInfo);
    props.onInfoToggle?.({ showing });
  };

  /**
   * [Render]
   */
  const border = Wrangle.border(props);
  const margin = Wrangle.margin(props);
  const styles = {
    base: css({ boxSizing: 'border-box' }),
    top: css({
      borderBottom: border,
      marginBottom: margin,
    }),
    bottom: css({
      borderTop: border,
      marginTop: margin,
    }),
  };

  return (
    <div {...css(styles.base, is.top && styles.top, is.bottom && styles.bottom)}>
      <PeerInput
        self={self}
        remote={data.remote}
        fields={Wrangle.fields(targetEdge)}
        spinning={data.spinning}
        config={Wrangle.configButton(props)}
        copiedMessage={props.copiedMessage}
        onLocalCopied={data.onLocalCopied}
        onRemoteChanged={data.onRemoteChanged}
        onConnectRequest={data.onConnectRequest}
        onConfigClick={handleToggleClick}
      />
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  fields(edge: t.VEdge): t.PeerInputField[] {
    const res = ['Peer:Self', 'Peer:Remote'] as t.PeerInputField[];
    if (edge === 'Bottom') res.reverse();
    return res;
  },

  margin(props: ConnectInputEdgeProps) {
    const { showInfoAsCard = DEFAULTS.showInfoAsCard, showInfo = DEFAULTS.showInfo } = props;
    if (!showInfo) return 0;
    return showInfoAsCard ? 20 : 15;
  },

  border(props: ConnectInputEdgeProps) {
    const { showInfo = DEFAULTS.showInfo } = props;
    if (!showInfo) return undefined;
    return `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;
  },

  configButton(props: ConnectInputEdgeProps): t.PeerInputConfigButton | undefined {
    const { showInfo = DEFAULTS.showInfo, showInfoToggle = DEFAULTS.showInfoToggle } = props;
    if (!showInfoToggle) return undefined;
    return { visible: true, selected: showInfo };
  },
};
