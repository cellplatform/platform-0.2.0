import { COLORS, Color, ObjectView, css, type t } from './common';
import { Button } from './ui.Button';
import { usePeer } from './usePeer';

export type PeerCardProps = {
  peer: { self: t.Peer; remote: t.Peer };
  style?: t.CssValue;
};

export const PeerCard: React.FC<PeerCardProps> = (props) => {
  const state = usePeer(props.peer.self);
  const { model } = state;

  /**
   * Handlers
   */
  const handleConnectData = () => {
    model?.connect.data(props.peer.remote.id);
  };

  const handlePeerDestroy = () => {
    props.peer.self.destroy();
  };

  const handleCloseConnection = (id: string) => {
    model?.disconnect(id);
  };

  const handlePurge = () => {
    model?.purge();
  };

  /**
   * Render
   */
  const styles = {
    base: css({
      width: 300,
      position: 'relative',
      boxSizing: 'border-box',
      fontSize: 14,
    }),
    section: css({
      marginTop: 8,
      paddingTop: 8,
      borderTop: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
    }),
    ul: css({ margin: 0, lineHeight: 1.5 }),
  };

  const button = (label: string, handler?: () => void) => {
    return (
      <li>
        <Button onClick={handler}>{label}</Button>
      </li>
    );
  };

  const elConnections = (model?.current.connections.length ?? 0) > 0 && (
    <div {...styles.section}>
      <ul {...styles.ul}>
        {(model?.current.connections ?? []).map((conn, i) => {
          return (
            <li key={conn.id}>
              {conn.id} <Button onClick={() => handleCloseConnection(conn.id)}>close</Button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 ${props.peer.self.id}`}</div>
      <div {...styles.section}>
        <ul {...styles.ul}>
          {button('peer.connect.data', handleConnectData)}
          {button('peer.destroy', handlePeerDestroy)}
          {button('purge', handlePurge)}
        </ul>
      </div>
      {elConnections}
      <div {...styles.section}>
        <ObjectView data={state.model?.current} fontSize={11} expand={3} />
      </div>
    </div>
  );
};
