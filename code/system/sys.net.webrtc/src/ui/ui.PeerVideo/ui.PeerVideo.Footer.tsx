import { Color, COLORS, css, Icons, t, TextInput, WebRTC } from '../common';
import { PeerId } from '../ui.PeerId';
import { ConnectButton } from './ui.ConnectButton';

export type PeerVideoFooterProps = {
  self?: t.Peer;
  remotePeer?: t.PeerId;
  showPeer: boolean;
  showConnect: boolean;
  spinning?: boolean;
  style?: t.CssValue;
  onLocalPeerCopied?: t.PeerVideoLocalCopiedHandler;
  onRemotePeerChanged?: t.PeerVideoRemoteChangedHandler;
  onConnectRequest?: t.PeerVideoConnectRequestHandler;
};

export const PeerVideoFooter: React.FC<PeerVideoFooterProps> = (props) => {
  const { self, showPeer, showConnect, spinning = false } = props;
  if (!showPeer && !showConnect) return null;

  const canConnect = Wrangle.canConnect(props);
  const isConnected = Wrangle.isConnected(props);

  /**
   * [Handlers]
   */
  const handleCopyPeer = () => {
    const { local } = Wrangle.ids(props);
    props.onLocalPeerCopied?.({ local });
  };

  const handleConnect = () => {
    if (!self || !canConnect) return;
    const { local, remote } = Wrangle.ids(props);
    props.onConnectRequest?.({ local, remote });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    me: css({
      height: 32,
      boxSizing: 'border-box',
      display: 'grid',
      alignContent: 'center',
      paddingLeft: 8,
      borderTop: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
    }),
    input: {
      outer: css({
        Padding: [5, 2, 5, 5],
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
      }),
      textbox: css({
        display: 'grid',
        alignContent: 'center',
        marginRight: 5,
      }),
      edgeIcons: css({
        display: 'grid',
        justifyContent: 'center',
        alignContent: 'center',
        gridTemplateColumns: 'repeat(5, auto)',
        gap: '1px',
      }),
    },
    connectedThumbnail: css({
      Padding: [2, 5],
      display: 'grid',
      placeItems: 'center',
    }),
  };

  const elPeer = showPeer && (
    <div {...styles.me}>{<PeerId peer={self?.id} prefix={'me'} onClick={handleCopyPeer} />}</div>
  );

  const elConnect = showConnect && (
    <div {...styles.input.outer}>
      <div {...styles.input.edgeIcons}>
        {!isConnected && <Icons.Globe.Language size={22} opacity={0.3} color={COLORS.DARK} />}
        {isConnected && (
          <Icons.Globe.Lock
            size={22}
            opacity={1}
            color={COLORS.BLUE}
            tooltip={'Secure Connection'}
          />
        )}
      </div>
      <div {...styles.input.textbox}>
        <TextInput
          value={props.remotePeer}
          placeholder={'connect to remote peer'}
          valueStyle={{
            fontFamily: 'monospace',
            fontSize: 13,
            fontWeight: 'bold',
            color: Color.alpha(COLORS.DARK, 1),
          }}
          placeholderStyle={{
            fontFamily: 'sans-serif',
            fontSize: 13,
            opacity: 0.3,
            italic: true,
          }}
          focusAction={'Select'}
          spellCheck={false}
          onEnter={handleConnect}
          onChanged={(e) => props.onRemotePeerChanged?.({ local: self?.id ?? '', remote: e.to })}
        />
      </div>
      <div {...styles.input.edgeIcons}>
        {!isConnected && canConnect && (
          <ConnectButton canConnect={canConnect} spinning={spinning} onClick={handleConnect} />
        )}
      </div>
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elConnect}
      {elPeer}
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  canConnect(props: PeerVideoFooterProps) {
    if (!props.self || !props.showConnect) return false;
    const { local, remote } = Wrangle.ids(props);
    if (!remote) return false;
    if (local === remote) return false;
    if (Wrangle.isConnected(props)) return false;

    return true;
  },

  ids(props: PeerVideoFooterProps) {
    const local = props.self?.id ?? '';
    const remote = WebRTC.Util.asId(props.remotePeer ?? '');
    return { local, remote };
  },

  isConnected(props: PeerVideoFooterProps) {
    const { remote } = Wrangle.ids(props);
    if (props.spinning) return false;
    return props.self?.connections.all.some((conn) => conn.peer.remote === remote) ?? false;
  },
};
