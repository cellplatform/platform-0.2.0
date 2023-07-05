import { PeerInput } from '../ui.PeerInput';
import { WebRtcInfo } from '../ui.Info';
import { COLORS, Color, DEFAULTS, css, type t } from './common';

export const Connect: React.FC<t.ConnectProps> = (props) => {
  const { fields = DEFAULTS.fields } = props;
  const isCard = props.card ?? DEFAULTS.card;

  /**
   * [Render]
   */
  const styles = {
    base: css({ boxSizing: 'border-box' }),
    info: css({
      marginLeft: 32,
      marginRight: isCard ? 32 : 15,
    }),
  };

  const elTop = Wrangle.ConnectComponent(props, 'Top');
  const elBottom = Wrangle.ConnectComponent(props, 'Bottom');

  const elInfo = (
    <WebRtcInfo
      fields={fields}
      client={props.client}
      data={props.info}
      style={styles.info}
      card={isCard}
    />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elTop}
      {elInfo}
      {elBottom}
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  is(props: t.ConnectProps) {
    const { edge = DEFAULTS.edge } = props;
    return {
      edge: {
        top: edge === 'Top',
        bottom: edge === 'Bottom',
      },
    };
  },

  ConnectComponent(props: t.ConnectProps, targetEdge: t.VEdge) {
    const data = props.info?.connect;
    const self = data?.self;
    const { edge = DEFAULTS.edge, card = DEFAULTS.card } = props;

    if (!data || !self) return null;
    if (edge !== targetEdge) return null;

    const is = Wrangle.is(props);
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
      <div {...css(styles.base, is.edge.top && styles.top, is.edge.bottom && styles.bottom)}>
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
  },
};
