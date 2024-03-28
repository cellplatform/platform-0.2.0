import { useEffect, useState } from 'react';
import { Button, Icons, PropList, Value, css, rx, type t } from './common';

/**
 * List Item (Row)
 */
export type DevRowProps = {
  controller: t.WebRtcController;
  remote: t.TDevRemote;
  style?: t.CssValue;
};

export const DevRow: React.FC<DevRowProps> = (props) => {
  const { controller, remote } = props;
  const network = controller.state.current.network;
  const peer = remote.peer;

  const [isConnecting, setConnecting] = useState(false);
  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  const short = `peer:${Value.shortenHash(remote.peer.id, [5, 0])}`;
  const exists = Boolean(network.peers[remote.peer.id]);
  const isReconnectRequired = !exists || isConnecting;

  const reconnect = async () => {
    setConnecting(true);
    await controller.withClient((client) => client.connect.fire(remote.peer.id));
    setConnecting(false);
  };

  /**
   * Lifecycle
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    peer.connections$.pipe(rx.takeUntil(dispose$)).subscribe((e) => redraw);
    return dispose;
  }, [remote.peer.id]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      placeItems: 'center',
      marginBottom: 5,
      ':last-child': { marginBottom: 0 },
    }),
    left: css({
      display: 'grid',
      gridTemplateColumns: 'repeat(2, auto)',
      placeItems: 'center',
      columnGap: 5,
    }),
    right: css({
      display: 'grid',
      gridTemplateColumns: 'repeat(2, auto)',
      placeItems: 'center',
      columnGap: 5,
    }),
    reconnect: css({ Flex: 'x-center-center' }),
    label: css({ opacity: isReconnectRequired ? 0.3 : 1 }),
  };

  const elReconnect = isReconnectRequired && (
    <Button onClick={reconnect} spinning={isConnecting}>
      <div {...styles.reconnect}>
        <Icons.Refresh size={15} />
        <Icons.Cable size={15} />
      </div>
    </Button>
  );

  const total = peer.connections.length;
  const totalConns = `${total} ${Value.plural(total, 'connection', 'connections')}`;

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left} title={totalConns}>
        <Icons.Person size={15} />
        <span {...styles.label}>{`${remote.name} (${total})`}</span>
      </div>
      <div />
      <div {...styles.right}>
        {elReconnect}
        <PropList.Chip text={short} />
      </div>
    </div>
  );
};
