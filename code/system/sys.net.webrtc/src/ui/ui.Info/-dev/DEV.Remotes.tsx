import { useEffect, useState, useRef } from 'react';

import { rx, Button, Icons, PropList, Value, css, t } from '../common';

export type TDevRemote = {
  name: string;
  peer: t.Peer;
  controller: t.WebRtcController;
  events: t.WebRtcEvents;
};

export type DevRemotesProps = {
  self: t.WebRtcController;
  remotes?: TDevRemote[];
  style?: t.CssValue;
};

export const DevRemotes: React.FC<DevRemotesProps> = (props) => {
  const { remotes = [], self } = props;
  if (remotes.length === 0) return null;

  const styles = {
    base: css({
      position: 'relative',
      userSelect: 'none',
      fontSize: 14,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      {remotes.map((remote) => {
        const key = remote.peer.id;
        return <Row key={key} controller={self} remote={remote} />;
      })}
    </div>
  );
};

/**
 * List Item (Row)
 */
export type RowProps = {
  controller: t.WebRtcController;
  remote: TDevRemote;
  style?: t.CssValue;
};

export const Row: React.FC<RowProps> = (props) => {
  const { controller, remote } = props;
  const network = controller.state.current.network;
  const peer = remote.peer;

  const [isConnecting, setConnecting] = useState(false);
  const [_, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  const short = `peer:${Value.shortenHash(remote.peer.id, [5, 0])}`;
  const exists = Boolean(network.peers[remote.peer.id]);
  const reconnect = async () => {
    setConnecting(true);
    const events = controller.events();
    await events.connect.fire(remote.peer.id);
    events.dispose();
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
  };

  const elReconnect = (!exists || isConnecting) && (
    <Button onClick={reconnect} spinning={isConnecting}>
      {'reconnect →'}
    </Button>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}>
        <Icons.Person size={15} />
        {`${remote.name} (${peer.connections.length})`}
      </div>
      <div />
      <div {...styles.right}>
        {elReconnect}
        <PropList.Chip text={short} />
      </div>
    </div>
  );
};
