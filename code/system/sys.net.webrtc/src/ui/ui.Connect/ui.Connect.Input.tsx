import { PeerInput } from '../ui.PeerInput';
import { COLORS, Color, DEFAULTS, css, type t } from './common';

export type ConnectInputProps = t.ConnectProps & {
  targetEdge: t.VEdge;
};

export const ConnectInput: React.FC<ConnectInputProps> = (props) => {
  const { targetEdge, edge = DEFAULTS.edge } = props;
  const data = props.info?.connect;
  const self = data?.self;
  const is = {
    top: edge === 'Top',
    bottom: edge === 'Bottom',
  };

  if (!data || !self) return null;
  if (edge !== targetEdge) return null;

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
        copiedMessage={props.copiedMessage}
        onLocalCopied={data.onLocalCopied}
        onRemoteChanged={data.onRemoteChanged}
        onConnectRequest={data.onConnectRequest}
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

  margin(props: ConnectInputProps) {
    const { showInfoAsCard = DEFAULTS.showInfoAsCard, showInfo = DEFAULTS.showInfo } = props;
    if (!showInfo) return 0;
    return showInfoAsCard ? 25 : 15;
  },

  border(props: ConnectInputProps) {
    const { showInfo = DEFAULTS.showInfo } = props;
    if (!showInfo) return undefined;
    return `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;
  },
};
