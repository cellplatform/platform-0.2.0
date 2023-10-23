import { useEffect, useState } from 'react';
import { rx, COLORS, Color, ObjectView, PeerModel, css, type t } from './common';
import { Button } from './ui.Button';

export type PeerProps = {
  peer: { self: t.PeerJs; remote: t.PeerJs };
  style?: t.CssValue;
};

export const Peer: React.FC<PeerProps> = (props) => {
  const [model, setModel] = useState<t.PeerModel>();
  const [_, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  useEffect(() => {
    const model = PeerModel.wrap(props.peer.self);
    setModel(model);
    const events = model.events();
    events.$.subscribe(redraw);

    events.cmd.data$.subscribe((e) => {
      const peer = e.connection.peer;
      console.log('data', e.data, `from "${peer.remote}" to "${peer.local}"`);
    });

    events.cmd.conn$.pipe(rx.filter((e) => Boolean(e.error))).subscribe((e) => {
      console.log('error', e.error);
    });

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

  const handleCloseConnection = (connid: string) => {
    model?.disconnect(connid);
  };

  const handleSendData = (connid: string) => {
    const conn = model?.get.dataConnection(connid);
    conn?.send('hello');
  };

  const handlePurge = () => {
    model?.purge();
  };

  const handleTmp = () => {
    //
    if (!model) return;
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
    connection: css({ display: 'grid', gridTemplateColumns: '1fr auto' }),
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
                <div>
                  <Button onClick={() => handleSendData(conn.id)}>send</Button>
                  <Button onClick={() => handleCloseConnection(conn.id)}>close</Button>
                </div>
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
          {button('tmp', handleTmp)}
        </ul>
      </div>
      {elConnections}
      <div {...styles.section}>
        <ObjectView data={model?.current} fontSize={11} expand={1} />
      </div>
    </div>
  );
};
