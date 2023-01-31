import { t, PeerEvents } from '../common';
import { AutoPergeStrategy } from './AutoPergeStrategy';
import { EnsureClosedStrategy } from './EnsureClosedStrategy';

/**
 * Handles strategies for connecting and disconnecting peers.
 */
export function PeerConnectionStrategy(args: {
  bus: t.EventBus<any>;
  netbus: t.PeerNetbus<any>;

  // Default enabled state.
  autoPurgeOnClose?: boolean;
  ensureClosed?: boolean;
}): t.PeerConnectionStrategy {
  const { netbus } = args;
  const bus = args.bus as t.EventBus<t.PeerEvent>;

  const events = PeerEvents(bus);
  const { dispose, dispose$ } = events;

  /**
   * Initialize sub-strategies.
   */
  AutoPergeStrategy({ netbus, events, isEnabled: () => strategy.autoPurgeOnClose });
  EnsureClosedStrategy({ netbus, events, isEnabled: () => strategy.ensureClosed });

  /**
   * API
   */
  const strategy = {
    dispose$,
    dispose,

    // Enabled state.
    autoPurgeOnClose: args.autoPurgeOnClose ?? true,
    ensureClosed: args.ensureClosed ?? true,
  };

  return strategy;
}
