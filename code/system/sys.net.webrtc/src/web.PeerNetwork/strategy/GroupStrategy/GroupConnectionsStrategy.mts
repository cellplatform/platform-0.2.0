import { slug, t, Module, UriUtil, rx } from '../common';

/**
 * Strategy for retrieving peer/connection details for members of the network.
 */
export async function GroupConnectionsStrategy(args: {
  netbus: t.PeerNetbus<t.GroupEvent>;
  events: { group: t.GroupEvents; peer: t.PeerEvents };
  isEnabled: () => boolean;
}) {
  const { netbus, events } = args;
  const module = Module.info;
  const self = netbus.self;
  const req$ = events.group.connections.req$.pipe(rx.filter(() => args.isEnabled()));
  const res$ = events.group.connections.res$.pipe(rx.filter(() => args.isEnabled()));

  const toConnectionUri = (input: string) => UriUtil.connection.parse(input, { throw: true });

  /**
   * Listen for local requests,
   * then broadcast event out to all connected peers.
   */
  req$.pipe(rx.filter((e) => e.source === self)).subscribe(async (payload) => {
    const tx = slug();
    const targets = netbus.connections.map((conn) => conn.peer.remote.id);
    const { targetted } = await netbus.target.remote({
      type: 'sys.net/group/connections:req',
      payload: { source: self, targets, tx },
    });

    const waitFor = targetted.map((uri) =>
      rx.firstValueFrom(
        res$.pipe(
          rx.filter((e) => e.tx === tx),
          rx.filter((e) => e.source === toConnectionUri(uri)?.peer),
          rx.timeout(5000),
        ),
      ),
    );

    type P = t.GroupPeer;
    const res = await Promise.all(waitFor);
    const peers = res.reduce((acc, next) => [...acc, ...next.peers], [] as P[]);
    netbus.target.local({
      type: 'sys.net/group/connections:res',
      payload: { tx: payload.tx || '', source: self, peers },
    });
  });

  /**
   * Listen for remote requests.
   */
  req$.pipe(rx.filter((e) => e.source !== self)).subscribe(async (payload) => {
    const tx = payload.tx || slug();
    const connections = netbus.connections.map(({ id, kind, parent }) => ({
      id,
      kind,
      parent,
    }));
    const peer: t.GroupPeer = { peer: self, module, connections };

    netbus.target
      .filter((e) => toConnectionUri(e.uri)?.peer === payload.source)
      .fire({
        type: 'sys.net/group/connections:res',
        payload: { tx, source: self, peers: [peer] },
      });
  });

  /**
   * Listen for connect instructions.
   */
  events.group.connect.$.pipe().subscribe(async (e) => {
    console.log('connect', e);

    const { kind } = e.target;

    /**
     * TODO 🐷
     * - clearn up
     * - don't auto start video by default
     */
    console.log('clean up');

    // const events = PeerNetwork.Events(bus);
    const remote = e.target.peer;
    const open = events.peer.connection(self, remote).open;

    if (kind === 'data') {
      const exists = netbus.connections
        .filter((conn) => conn.kind === 'data')
        .some((conn) => conn.peer.remote.id === remote);
      if (exists) return;

      const res = await open.data();
      console.log('open/data:', res);

      // open.media('media/video', { parent: res.connection?.id });
    }
    if (kind === 'media/screen' || kind === 'media/video') {
      // const parent = self.
      const res = await open.media(kind, {});
      console.log('open/media:', res);
    }
  });
}
