import { PeerEvents, GroupEvents, t } from '../common';
import { GroupConnectionsStrategy } from './GroupConnectionsStrategy';

/**
 * Handles strategies for working with a group of peers ("mesh" network).
 */
export function GroupStrategy(args: {
  bus: t.EventBus<any>;
  netbus: t.PeerNetbus<any>;
  connections?: boolean; // Default enabled state.
}): t.GroupStrategy {
  const { bus, netbus } = args;

  const events = {
    peer: PeerEvents(bus),
    group: GroupEvents(netbus),
  };

  /**
   * Initialize sub-strategies.
   */
  GroupConnectionsStrategy({ netbus, events, isEnabled: () => strategy.connections });

  /**
   * API
   */
  const strategy = {
    dispose$: events.group.dispose$,
    dispose() {
      events.group.dispose();
      events.peer.dispose();
    },

    // Enabled state.
    connections: args.connections ?? true,
  };

  return strategy;
}
