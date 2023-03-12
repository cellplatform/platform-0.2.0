import { Color, COLORS, css, t, WebRTC } from '../common';
import { FooterConnect } from './ui.Footer.Connect';
import { FooterMe } from './ui.Footer.Me';

export type FooterProps = {
  self?: t.Peer;
  remotePeer?: t.PeerId;
  showPeer: boolean;
  showConnect: boolean;
  isSpinning?: boolean;
  style?: t.CssValue;
  onLocalPeerCopied?: t.PeerVideoLocalCopiedHandler;
  onRemotePeerChanged?: t.PeerVideoRemoteChangedHandler;
  onConnectRequest?: t.PeerVideoConnectRequestHandler;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const { self, showPeer, showConnect, isSpinning = false } = props;
  if (!showPeer && !showConnect) return null;

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

  const elConnect = (
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
  ids(props: FooterProps) {
    const local = (props.self?.id ?? '').trim();
    const remote = WebRTC.Util.asId(props.remotePeer ?? '');
    return { local, remote };
  },

  canConnect(props: FooterProps) {
    if (!props.self || !props.showConnect) return false;

    const { local, remote } = Wrangle.ids(props);
    if (!remote) return false;
    if (local === remote) return false;
    if (Wrangle.isConnected(props)) return false;

    return true;
  },

  isConnected(props: FooterProps) {
    const { remote } = Wrangle.ids(props);
    if (props.isSpinning) return false;
    return props.self?.connections.all.some((conn) => conn.peer.remote === remote) ?? false;
  },
};
