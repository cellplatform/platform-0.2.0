import { t, PeerEvents } from '../common';
import { PeerConnectionStrategy } from '../PeerConnectionStrategy';

/**
 * Single combined set of network strategies.
 */
export function PeerStrategy(args: {
  bus: t.EventBus<any>;
  netbus: t.PeerNetbus<any>;
}): t.PeerStrategy {
  const bus = args.bus as t.EventBus<t.PeerEvent>;
  const events = PeerEvents(bus);

  const { dispose$ } = events;
  const dispose = () => {
    events.dispose();
    connection.dispose();
  };

  const connection = PeerConnectionStrategy(args);

  return { connection, dispose$, dispose };
}
