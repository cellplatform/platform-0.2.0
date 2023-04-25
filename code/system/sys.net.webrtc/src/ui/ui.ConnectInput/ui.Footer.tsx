import { WebRtc } from '../../WebRtc';
import { Color, COLORS, css, t, DEFAULTS } from './common';
import { FooterConnect } from './ui.Footer.Connect';
import { FooterMe } from './ui.Footer.Me';

export type ConnectInputProps__ = {
  self?: t.Peer;
  remotePeer?: t.PeerId;
  showPeer?: boolean;
  showConnect?: boolean;
  isSpinning?: boolean;
  style?: t.CssValue;
  onLocalPeerCopied?: t.PeerCardLocalCopiedHandler;
  onRemotePeerChanged?: t.PeerCardRemoteChangedHandler;
  onConnectRequest?: t.PeerCardConnectRequestHandler;
};

export const Footer: React.FC<t.ConnectInputProps> = (props) => {
  const {
    self,
    showPeer = DEFAULTS.showPeer,
    showConnect = DEFAULTS.showConnect,
    spinning: isSpinning = DEFAULTS.spinning,
  } = props;

  const canConnect = Wrangle.canConnect(props);
  const isConnected = Wrangle.isConnected(props);
  const ids = Wrangle.ids(props);

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    me: css({ borderTop: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}` }),
  };

  const elConnect = showConnect && (
    <FooterConnect
      self={self}
      ids={ids}
      canConnect={canConnect}
      isConnected={isConnected}
      isSpinning={isSpinning}
      onRemotePeerChanged={props.onRemotePeerChanged}
      onConnectRequest={props.onConnectRequest}
    />
  );

  const elMe = showPeer && (
    <FooterMe self={self} style={styles.me} onLocalPeerCopied={props.onLocalPeerCopied} />
  );

  if (!elConnect && !elMe) return null;

  return (
    <div {...css(styles.base, props.style)}>
      {elConnect}
      {elMe}
    </div>
  );
};

/**
 * [Helpers]
 */

export const Wrangle = {
  ids(props: t.ConnectInputProps) {
    const local = (props.self?.id ?? '').trim();
    const remote = WebRtc.Util.asId(props.remotePeer ?? '');
    return { local, remote };
  },

  canConnect(props: t.ConnectInputProps) {
    if (!props.self || !props.showConnect) return false;

    const { local, remote } = Wrangle.ids(props);
    if (!remote) return false;
    if (local === remote) return false;
    if (Wrangle.isConnected(props)) return false;

    return true;
  },

  isConnected(props: t.ConnectInputProps) {
    const { remote } = Wrangle.ids(props);
    if (props.spinning) return false;
    return props.self?.connections.all.some((conn) => conn.peer.remote === remote) ?? false;
  },
};
