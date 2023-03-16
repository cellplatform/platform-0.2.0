import { PeerCard, PeerCardProps } from '..';
import { COLORS, Crdt, Dev, Filesystem, rx, t, TestNetwork, Time, WebRtc } from '../../../test.ui';
import { PeerList } from '../../ui.PeerList';

import type { TestNetworkP2P } from '../../../test.ui';

import { initialSharedDoc } from './-schema.mjs';
import type { DocShared } from './-schema.mjs';

const DEFAULTS = PeerCard.DEFAULTS;

type T = {
  props: PeerCardProps;
  debug: { showBg: boolean; redraw: number };
};
const initial: T = {
  props: {
    showPeer: DEFAULTS.showPeer,
    showConnect: DEFAULTS.showConnect,
  },
  debug: { showBg: true, redraw: 0 },
};

type DocMe = { count: number };
const initialMeDoc: DocMe = { count: 0 };

export default Dev.describe('PeerCard', async (e) => {
  e.timeout(1000 * 30);

  type LocalStore = { muted: boolean; showBg: boolean; showPeer?: boolean; showConnect?: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.PeerCard');
  const local = localstore.object({
    muted: true,
    showBg: initial.debug.showBg,
    showPeer: initial.props.showPeer,
    showConnect: initial.props.showConnect,
  });

  let network: TestNetworkP2P;
  let self: t.Peer | undefined;
  let docMe: t.CrdtDocRef<DocMe>;
  let docShared: t.CrdtDocRef<DocShared>;

  const byteArray = Crdt.Schema.toByteArray<DocShared>({ count: 0, network: { peers: {} } });
  console.info('CODE FILE (schema.mts):');
  console.info(byteArray.toString());

  const bus = rx.bus();
  const fs = (await Filesystem.client({ bus })).fs;
  const dirs = {
    me: fs.dir('dev.doc.me'),
    shared: fs.dir('dev.doc.shared'),
  };

  async function initNetwork(state: t.DevCtxState<T>, dispose$: t.Observable<any>) {
    const updateSelf = () => state.change((d) => (d.props.self = self));

    network = await TestNetwork.init({ log: true });
    self = network.peerA;
    self.connections$.subscribe(updateSelf);
    updateSelf();

    const filedir = dirs.shared;
    WebRtc.Controller.listen(self, docShared, {
      filedir,
      dispose$,
      onConnectStart(e) {
        state.change((d) => (d.props.spinning = true));
      },
      onConnectComplete(e) {
        state.change((d) => (d.props.spinning = false));
      },
    });
  }

  e.it('init:crdt', async (e) => {
    const ctx = Dev.ctx(e);
    const dispose$ = ctx.dispose$;
    const state = await ctx.state<T>(initial);
    const redraw = () => state.change((d) => d.debug.redraw++);

    // Initialize CRDT documents.
    docMe = Crdt.Doc.ref<DocMe>(initialMeDoc, { dispose$ });
    docShared = Crdt.Doc.ref<DocShared>(initialSharedDoc, { dispose$ });

    console.log('initialSharedDoc', initialSharedDoc);

    console.log(Crdt.toObject(docShared));

    // Start file-persistence.
    await Crdt.Doc.file<DocMe>(dirs.me, docMe, { autosave: true, dispose$ });
    await Crdt.Doc.file<DocMe>(dirs.shared, docShared, { autosave: true });

    // NB:
    // See: "init:network" (below) for network-sychronization-protocol startup (P2P).
    //      after the UI has been initiated.

    // Listen.
    docMe.$.subscribe(redraw);
    docShared.$.subscribe(redraw);
    redraw();
  });

  e.it('init:ui', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.debug.showBg = local.showBg;
      d.props.muted = local.muted;
      d.props.showPeer = local.showPeer;
      d.props.showConnect = local.showConnect;
    });

    const toggleMute = () => {
      return state.change((d) => (local.muted = d.props.muted = !d.props.muted));
    };

    ctx.subject
      .display('grid')
      .size(400, null)
      .render<T>((e) => {
        const { showBg } = e.state.debug;
        return (
          <PeerCard
            {...e.state.props}
            self={self}
            style={{ backgroundColor: showBg ? COLORS.WHITE : undefined }}
            onMuteClick={toggleMute}
            onRemotePeerChanged={(e) => state.change((d) => (d.props.remotePeer = e.remote))}
            onConnectRequest={async (e) => {
              if (!self) return;
              docShared.change((d) => {
                const local = self!.id;
                const initiatedBy = local;

                console.log('-------------------------------------------');
                console.log('self', self);
                console.log('initiatedBy', initiatedBy);

                WebRtc.Controller.Mutate.addPeer(d.network, local, e.remote, { initiatedBy });
              });
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer.border(-0.1).render<T>((e) => {
      const self = network?.peerA;
      const total = self?.connections.length ?? 0;

      return (
        <Dev.Object
          fontSize={11}
          name={'Me'}
          expand={{
            level: 1,
            paths: [
              //
              '$.Doc<Public>',
              '$.Doc<Public>.network',
              '$.Doc<Public>.network.*',
            ],
          }}
          data={{
            [`WebRtc.Peer[${total}]`]: self,
            'Doc<Private>': docMe?.current,
            'Doc<Public>': docShared?.current,
          }}
        />
      );
    });

    // Debug
    dev.section((dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => (e.state.debug.showBg ? 'background (white)' : 'background'))
          .value((e) => e.state.debug.showBg)
          .onClick((e) => e.change((d) => (local.showBg = Dev.toggle(d.debug, 'showBg')))),
      );

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label('show peer-id')
          .value((e) => e.state.props.showPeer)
          .onClick((e) => e.change((d) => (local.showPeer = Dev.toggle(d.props, 'showPeer')))),
      );

      dev.boolean((btn) =>
        btn
          .label('show connect')
          .value((e) => e.state.props.showConnect ?? PeerCard.DEFAULTS.showConnect)
          .onClick((e) =>
            e.change((d) => (local.showConnect = Dev.toggle(d.props, 'showConnect'))),
          ),
      );
    });

    dev.hr(5, 20);

    dev.section('Doc<Private>', (dev) => {
      const count = (label: string, by: number) => {
        dev.button((btn) =>
          btn
            .label(label)
            .right(by > 0 ? '++' : '--')
            .onClick((e) => docMe.change((d) => (d.count += by))),
        );
      };
      count('count: increment', 1);
      count('count: decrement', -1);
      // dev.hr(-1, 5);
      // dev.button('reset (destroy)', (e) =>
      //   docMe.change((d) => {
      //     d.count = 0;
      //   }),
      // );
    });

    dev.hr(5, 20);

    dev.section('Doc<Public> (Shared)', (dev) => {
      const count = (label: string, by: number) => {
        dev.button((btn) =>
          btn
            .label(label)
            .right(by > 0 ? '++' : '--')
            .onClick((e) => docShared.change((d) => (d.count += by))),
        );
      };
      count('count: increment', 1);
      count('count: decrement', -1);
      dev.hr(-1, 5);
      dev.button('reset', (e) =>
        docShared.change((d) => {
          d.count = 0;
          d.network.peers = {};
        }),
      );
    });

    dev.hr(5, 20);

    dev.section('(Debug) Programmatic Peer Connection', (dev) => {
      dev.button((btn) =>
        btn
          .label('connect')
          .enabled((e) => (self?.connections.length ?? 0) === 0)
          .right((e) => {
            if (!self) return '';
            return self.connections.length === 0 ? '←' : '';
          })
          .onClick(async (e) => {
            await e.change((d) => {
              d.props.spinning = true;
              d.props.remotePeer = network.peerB.id;
            });
            await network.connect();
            await e.change(async (d) => {
              await Time.wait(500); // NB: [HACK] Wait for media to be ready before hiding spinner.
              d.props.spinning = false;
            });
          }),
      );

      dev.button((btn) =>
        btn
          .label('disconnect (kill all)')
          .enabled((e) => (self?.connections.length ?? 0) > 0)
          .right((e) => {
            if (!self) return '';
            return self.connections.length > 0 ? '←' : '';
          })
          .onClick(async (e) => {
            network.peerA.connections.all.forEach((conn) => conn.dispose());
          }),
      );
    });

    dev.hr(5, [20, 50]);

    dev.row((e) => {
      return self ? <PeerList self={self} style={{ MarginX: 35 }} /> : null;
    });
  });

  e.it('init:network', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await initNetwork(state, ctx.dispose$);
  });
});
