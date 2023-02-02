import { MediaStream, PeerNetwork, rx, t } from '../libs.mjs';
import { EventBridge } from './DEV.EventBridge';

export const TEST = {
  signal: 'rtc.cellfs.com', // WebRTC "signal server" connection coordination end-point.

  /**
   * Establish a test network connection.
   */
  async createNetwork(options: { bus?: t.EventBus<any> } = {}) {
    const bus = options.bus ?? rx.bus();
    const signal = TEST.signal;
    const { network } = await PeerNetwork.start({ bus, signal });
    const self = network.self;

    MediaStream.Controller({ bus });
    EventBridge.startEventBridge({ self, bus });

    return network;
  },
} as const;
