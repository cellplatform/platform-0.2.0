import { t } from './common';

type Args = {
  peerid: t.PeerId;
  events?: t.WebRtcEvents;
  enabled?: boolean;
  isSelf?: boolean;
};

/**
 * Controller for a single peer.
 */
export function usePeerRowController(args: Args) {
  const { peerid, events, isSelf = false } = args;
  const enabled = Boolean(events && (args.enabled ?? true));

  const spinning: t.WebRtcInfoPeerFacet[] = [];
  const disabled: t.WebRtcInfoPeerFacet[] = [];
  const off: t.WebRtcInfoPeerFacet[] = ['Video', 'Mic', 'Screen'];

  const onCtrlClick: t.WebRtcInfoPeerCtrlsClickHandler = async (e) => {
    if (!enabled || !events) return;


    if (e.kind === 'Close' && !isSelf) {
      await events.close.fire(peerid);
    }
  };

  /**
   * API
   */
  return {
    instance: events?.instance,
    enabled,
    spinning,
    disabled,
    off,
    onCtrlClick,
  };
}
