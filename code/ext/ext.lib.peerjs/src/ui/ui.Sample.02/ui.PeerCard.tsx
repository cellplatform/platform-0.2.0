import { useEffect, useState } from 'react';
import { MediaStream } from 'sys.ui.react.media';
import { COLORS, Color, Icons, ObjectView, Time, css, rx, type t } from './common';
import { Button } from './ui.Button';

export type PeerCardProps = {
  prefix?: string;
  peer: { self: t.PeerModel; remote: t.PeerModel };
  style?: t.CssValue;
};

export const PeerCard: React.FC<PeerCardProps> = (props) => {
  const self = props.peer.self;
  const selfid = self.id;
  const copyPeerId = () => {
    navigator.clipboard.writeText(selfid);
    setCopied(true);
    Time.delay(1500, () => setCopied(false));
  };

  const [copied, setCopied] = useState(false);
  const [_, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  useEffect(() => {
    const events = self.events();
    events.$.subscribe(redraw);

    events.cmd.data$.subscribe((e) => {
      const peer = e.connection.peer;
      console.log('data', e.data, `from "${peer.remote}" to "${peer.self}"`);
    });

    events.cmd.conn$.pipe(rx.filter((e) => Boolean(e.error))).subscribe((e) => {
      console.info('conn$.error:', e.error);
    });

    return events.dispose;
  }, []);

  /**
   * Handlers
   */
  const handlePurge = () => self?.purge();
  const handleConnectData = () => self?.connect.data(props.peer.remote.id);
  const handleConnectMedia = () => self?.connect.video(props.peer.remote.id);
  const handlePeerDispose = () => self.dispose();
  const handleCloseConnection = (connid: string) => self?.disconnect(connid);
  const handleSendData = (connid: string) => {
    const conn = self?.get.conn.data(connid);
    conn?.send('hello');
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
    title: css({ display: 'grid', gridTemplateColumns: '1fr auto' }),
    ul: css({ margin: 0, lineHeight: 1.5 }),
    connection: css({ display: 'grid', gridTemplateColumns: '1fr auto' }),
    connectionButtons: css({ Flex: 'x-center-center' }),
    video: css({ Size: 18, marginTop: 2, marginLeft: 10 }),
  };

  const button = (label: string, handler?: () => void) => {
    return (
      <li>
        <Button onClick={handler}>{label}</Button>
      </li>
    );
  };

  const elConnections = (self?.current.connections.length ?? 0) > 0 && (
    <div {...styles.section}>
      <ul {...styles.ul}>
        {(self?.current.connections ?? []).map((conn, i) => {
          const button = (label: string, handler?: () => void) => {
            return (
              <Button onClick={handler} style={{ Margin: [0, 0, 0, 10] }}>
                {label}
              </Button>
            );
          };

          const opacity = conn.open ? 1 : 0.3;
          const elSend = conn.kind === 'data' && button('send', () => handleSendData(conn.id));

          const stream = conn.stream?.remote;
          const elStream = stream && (
            <MediaStream.Video stream={stream} style={styles.video} borderRadius={4} muted={true} />
          );

          return (
            <li key={conn.id}>
              <div {...styles.connection}>
                <div style={{ opacity }}>{conn.id}</div>
                <div {...styles.connectionButtons}>
                  {elSend}
                  {elStream}
                  {button('close', () => handleCloseConnection(conn.id))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const prefix = props.prefix ?? 'peer:';

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.title}>
        <div>
          {`🌳 ${prefix} `}
          <Button onClick={copyPeerId}>{copied ? '(copied)' : selfid}</Button>
        </div>
        <Button style={{ marginRight: 0 }} onClick={copyPeerId}>
          <Icons.Copy size={16} />
        </Button>
      </div>
      <div {...styles.section}>
        <ul {...styles.ul}>
          {button('peer.connect.data', handleConnectData)}
          {button('peer.connect.media', handleConnectMedia)}
          {button('peer.dispose', handlePeerDispose)}
          {button('purge', handlePurge)}
        </ul>
      </div>
      {elConnections}
      <div {...styles.section}>
        <ObjectView data={self?.current} fontSize={11} expand={1} />
      </div>
    </div>
  );
};
