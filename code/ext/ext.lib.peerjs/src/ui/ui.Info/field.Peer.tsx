import { Icons, PeerUri, Value, Webrtc, css, type t } from './common';

type P = t.PropListItem;

const styles = {
  conn: css({ Flex: 'x-center-center' }),
  icon: css({ marginLeft: 5 }),
};

export function fieldPeer(data: t.InfoData, fields: t.InfoField[]) {
  const self = data.peer?.self;
  const peer = self;
  const current = peer?.current;
  const showRemotes = fields.includes('Peer.Remotes');

  /**
   * Root Peer (Self)
   */
  const root: P = {
    label: peer ? `Peer (${peer.id})` : 'Peer',
    value: {
      data: Wrangle.rootLabel(current),
      opacity: current?.open ? 1 : 0.3,
    },
  };
  if (!peer) return root;

  /**
   * Remote Peers
   */
  const remotes: P[] = [];
  if (showRemotes) {
    const peers = peer.get.conn.remotes;
    Object.keys(peers).forEach((remoteid) => {
      remotes.push({
        indent: 20,
        label: PeerUri.prepend(remoteid, 'peer'),
        value: (
          <div {...styles.conn}>
            <div>{Wrangle.remotesLabel(peers[remoteid])}</div>
            <Icons.Plug size={14} style={styles.icon} />
          </div>
        ),
      });
    });
  }

  return [root, ...remotes];
}

/**
 * Helpers
 */
const Wrangle = {
  rootLabel(peer?: t.Peer) {
    return !peer ? '-' : Wrangle.connections(peer.connections.length);
  },

  connections(total: number) {
    return `${total} ${Value.plural(total, 'connection', 'connections')}`;
  },

  remotesLabel(input: t.PeerConnection[]) {
    const conns = {
      data: input.filter((m) => Webrtc.Is.kindData(m.kind)),
      media: input.filter((m) => Webrtc.Is.kindMedia(m.kind)),
    };
    const data = `${conns.data.length} data`;
    const media = conns.media.length > 0 ? `${conns.media.length} media` : '';
    return [data, media].filter(Boolean).join(', ');
  },
} as const;
