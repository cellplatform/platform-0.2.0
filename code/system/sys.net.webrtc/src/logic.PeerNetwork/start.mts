import { PeerNetbus } from '../logic.PeerNetbus';
import { GroupEvents, PeerEvents } from '../logic.PeerNetwork.events';
import { cuid, t } from './common';
import { Controller } from './controller';
import { WebRuntimeBus } from '../logic.WebRuntimeBus';

type Milliseconds = number;
type DomainEndpoint = string; // eg "rtc.foo.org"

type StartArgs = {
  bus: t.EventBus<any>;
  signal: DomainEndpoint;
  self?: t.PeerId;
  timeout?: Milliseconds;
};

type StartRes = {
  network: t.PeerNetwork;
  error?: t.PeerError;
};

/**
 * Create and start a new peer-network.
 */
export async function start(args: StartArgs): Promise<StartRes> {
  const { bus, signal, timeout } = args;
  const self = args.self ?? cuid();

  const id = self;
  const instance = { bus, id };

  const peer = Controller({ bus });
  const netbus = PeerNetbus({ bus, self });
  const runtime = WebRuntimeBus.Controller({ instance, netbus });

  const events = {
    peer: PeerEvents(bus),
    group: GroupEvents(netbus),
    runtime,
  };

  const dispose = async () => {
    peer.dispose();
    runtime.dispose();
    events.peer.dispose();
    events.group.dispose();
    events.runtime.dispose();
  };

  const status = await events.peer.status(self).object();
  const network: t.PeerNetwork = {
    dispose,
    self,
    bus,
    netbus,
    events,
    status,
  };

  // Initialize the peer.
  const res = await events.peer.create(signal, { self, timeout });
  const error = res.error;

  // Finish up.
  if (error) await dispose();
  return { network, error };
}
