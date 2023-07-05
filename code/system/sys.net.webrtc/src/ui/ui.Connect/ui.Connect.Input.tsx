import { PeerInput } from '../ui.PeerInput';
import { COLORS, Color, DEFAULTS, css, type t } from './common';

export type ConnectInputProps = t.ConnectProps & {
  targetEdge: t.VEdge;
};

export const ConnectInput: React.FC<ConnectInputProps> = (props) => {
  const { edge = DEFAULTS.edge, card = DEFAULTS.card, targetEdge } = props;
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

  const border = `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;
  const margin = card ? 25 : 15;
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
        fields={['Peer:Self', 'Peer:Remote']}
        spinning={data.spinning}
        copiedMessage={props.copiedMessage}
        onLocalCopied={data.onLocalCopied}
        onRemoteChanged={data.onRemoteChanged}
        onConnectRequest={data.onConnectRequest}
      />
    </div>
  );
};
