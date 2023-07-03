import { ConnectInput } from '../../ui.ConnectInput';
import { COLORS, Color, css, type t } from '../common';

export type Edge = Extract<t.WebRtcInfoField, 'Connect.Top' | 'Connect.Bottom'>;

export type ConnectProps = {
  edge: Edge;
  fields: t.WebRtcInfoField[];
  data: t.WebRtcInfoData;
  style?: t.CssValue;
};

export const Connect: React.FC<ConnectProps> = (props) => {
  const data = props.data.connect;
  const self = data?.self;
  if (!self) return null;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      borderTop: Wrangle.border(props, 'Connect.Bottom'),
      borderBottom: Wrangle.border(props, 'Connect.Top'),
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <ConnectInput
        self={self}
        remote={data.remote}
        fields={['Peer:Self', 'Peer:Remote']}
        spinning={data.spinning}
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
  hasOthers(fields: t.WebRtcInfoField[]) {
    return fields.some((field) => field !== 'Connect.Top' && field !== 'Connect.Bottom');
  },

  border(props: ConnectProps, edge: Edge) {
    if (props.edge !== edge) return;
    if (!Wrangle.hasOthers(props.fields)) {
      if (props.fields.length === 1) return;
      if (edge === 'Connect.Bottom') return;
    }
    return `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;
  },
};
