import { useEffect, useState } from 'react';
import { COLORS, Color, ObjectView, PeerModel, css, type t } from './common';
import { Button } from './ui.Button';

export type PeerCardProps = {
  peer: { self: t.PeerJs; remote: t.PeerJs };
  style?: t.CssValue;
};

export const PeerCard: React.FC<PeerCardProps> = (props) => {
  const [model, setModel] = useState<t.PeerModel>();
  const [_, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  useEffect(() => {
    const model = PeerModel.wrap(props.peer.self);
    setModel(model);

    const events = model.events();
    events.$.subscribe(redraw);

    return events.dispose;
  }, []);

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
    connection: css({
      display: 'grid',
      gridTemplateColumns: '1fr auto',
    }),
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
              <div {...styles.connection}>
                <div>{conn.id}</div>
                <Button onClick={() => handleCloseConnection(conn.id)}>close</Button>
              </div>
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
        <ObjectView data={model?.current} fontSize={11} expand={3} />
      </div>
    </div>
  );
};
