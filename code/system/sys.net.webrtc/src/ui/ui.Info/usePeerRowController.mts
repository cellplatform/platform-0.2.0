import { t } from './common';

type Args = {
  events?: t.WebRtcEvents;
  enabled?: boolean;
};

/**
 * Controller for a single peer.
 */
export function usePeerRowController(args: Args) {
  const { events } = args;
  const enabled = Boolean(events && (args.enabled ?? true));

  /**
   * TODO 🐷
   */
  console.log('usePeerRowController', { enabled, events });

  return {
    instance: events?.instance,
    enabled,
  };
}
