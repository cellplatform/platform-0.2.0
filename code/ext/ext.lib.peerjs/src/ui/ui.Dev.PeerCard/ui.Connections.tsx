import { COLORS, Color, Video, css, type t } from './common';
import { Button } from './ui.Button';

export type ConnectionsProps = Pick<t.DevPeerCardProps, 'peer' | 'style'>;

export const Connections: React.FC<ConnectionsProps> = (props) => {
  const self = props.peer.self;
  const total = self?.current.connections.length ?? 0;

  /**
   * Handlers
   */
  const handleCloseConnection = (connid: string) => self?.disconnect(connid);
  const handleSendData = (connid: string) => {
    const conn = self?.get.conn.obj.data(connid);
    conn?.send('hello');
  };

  /**
   * Render
   */
  const styles = {
    base: css({ position: 'relative' }),
    ul: css({ margin: 0, lineHeight: 1.5 }),
    connection: css({ display: 'grid', gridTemplateColumns: '1fr auto' }),
    connectionButtons: css({ Flex: 'x-center-center' }),
    video: css({ Size: 18, marginTop: 2, marginLeft: 10 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <ul {...styles.ul}>
        {(self?.current.connections ?? []).map((conn) => {
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
            <Video stream={stream} style={styles.video} borderRadius={4} muted={true} />
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
};
