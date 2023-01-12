import { rx, MediaStream, PeerNetwork, t } from './DEV.libs';
import { EventBridge } from './DEV.EventBridge';

export const TEST = {
  SIGNAL: 'rtc.cellfs.com', // WebRTC "signal server" connection coordination end-point.

  /**
   * Establish a test network connection.
   */
  async createNetwork(options: { bus?: t.EventBus<any> } = {}) {
    const bus = options.bus ?? rx.bus();
    const signal = TEST.SIGNAL;
    const { network } = await PeerNetwork.start({ bus, signal });
    const self = network.netbus.self;

    MediaStream.Controller({ bus });
    EventBridge.startEventBridge({ self, bus });

    return network;
  },
};
