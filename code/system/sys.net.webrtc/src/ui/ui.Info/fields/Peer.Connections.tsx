import { DEFAULTS, css, type t } from '../common';

const { indent } = DEFAULTS;

export function FieldPeerConnections(args: {
  fields: t.WebRtcInfoField[];
  data: t.WebRtcInfoData;
  info?: t.WebRtcInfo;
}): t.PropListItem[] {
  const { info } = args;
  const peer = info?.peer;

  if (!peer) return [];

  return peer.connections.all.map((conn) => {
    return {
      label: `local:p:${p(conn.peer.local, 5)} →`,
      value: <PeerValue conn={conn} />,
      indent,
    };
  });
}

/**
 * Components
 */
export type PeerValueProps = {
  conn: t.PeerConnection;
  style?: t.CssValue;
};

export const PeerValue: React.FC<PeerValueProps> = (props) => {
  const { conn } = props;
  const remote = {
    peer: `p:${p(conn.peer.remote, 5)}:`,
    // conn: `${conn.kind}:${p(conn.id, 8)}`,
    conn: `${p(conn.id, 8)}`,
  };

  const styles = {
    base: css({ Flex: 'x-center-center' }),
    peer: css({ opacity: 0.3 }),
    conn: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <span {...styles.peer}>{remote.peer}</span>
      <span {...styles.conn}>{remote.conn}</span>
    </div>
  );
};

/**
 * Helpers
 */
const p = (text: string, length: number) => text.slice(0, length);
