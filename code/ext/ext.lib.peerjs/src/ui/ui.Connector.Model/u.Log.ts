import { type t } from './common';
import { Data } from './u.Data';

export const Log = {
  /**
   * Log a list item to the console.
   */
  item(title: string, peer: t.PeerModel, item: t.ConnectorItemState) {
    const kind = Data.kind(item);

    console.group(title);
    console.info(`ListItem:`, item.current);

    if (kind === 'peer:self') {
      const data = Data.self(item);
      console.info('ListItem.data:', data);
    }

    if (kind === 'peer:remote') {
      const data = Data.remote(item);
      console.info('ListItem.data:', data);
      console.info('Connection (data):', peer.get.conn.item(data.connid));
      console.info('Connection (peerjs):', peer.get.conn.obj(data.connid));
    }

    console.info('Peer:', peer);
    console.groupEnd();
  },
} as const;
