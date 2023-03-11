import { PeerVideo, PeerVideoProps } from '.';
import {
  rx,
  COLORS,
  Dev,
  t,
  TestNetwork,
  TestNetworkP2P,
  Time,
  Crdt,
  Filesystem,
  WebRTC,
} from '../../test.ui';
import { PeerList } from '../ui.PeerList';

const DEFAULTS = PeerVideo.DEFAULTS;

type T = {
  props: PeerVideoProps;
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

type DocShared = { count: number };
const initialSharedDoc: DocShared = { count: 0 };

export default Dev.describe('PeerVideo', async (e) => {
  e.timeout(9999);

  type LocalStore = { muted: boolean; showBg: boolean; showPeer?: boolean; showConnect?: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.PeerVideo');
  const local = localstore.object({
    muted: true,
    showBg: initial.debug.showBg,
    showPeer: initial.props.showPeer,
    showConnect: initial.props.showConnect,
  });

  let network: TestNetworkP2P;
  let docMe: t.CrdtDocRef<DocMe>;
  let docShared: t.CrdtDocRef<DocShared>;

  const bus = rx.bus();
  const fs = (await Filesystem.client({ bus })).fs;
  const dirs = {
    me: fs.dir('dev.doc.me'),
    shared: fs.dir('dev.doc.shared'),
  };

  e.it('init:crdt', async (e) => {
    const ctx = Dev.ctx(e);
    const dispose$ = ctx.dispose$;
    const state = await ctx.state<T>(initial);
    const redraw = () => state.change((d) => d.debug.redraw++);

    docMe = Crdt.Doc.ref<DocMe>(initialMeDoc, { dispose$ });
    docShared = Crdt.Doc.ref<DocShared>(initialSharedDoc, { dispose$ });

    await Crdt.Doc.file<DocMe>(dirs.me, docMe, { autosave: true, dispose$ });
    // await Crdt.Doc.file<DocMe>(dirs.shared, docShared, { autosave: true });

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
          <PeerVideo
            {...e.state.props}
            style={{ backgroundColor: showBg ? COLORS.WHITE : undefined }}
            onMuteClick={toggleMute}
            onRemotePeerChanged={(e) => state.change((d) => (d.props.remotePeer = e.remote))}
            onConnectRequest={async (e) => {
              const self = network.peerA;
              state.change((d) => (d.props.spinning = true));

              await Promise.all([
                self.data(e.remote), //             <== Start (data).
                // self.media(e.remote, 'camera'), //  <== Start (camera).
              ]);

              state.change((d) => (d.props.spinning = false));
            }}
          />
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer.border(-0.1).render<T>((e) => {
      const self = e.state.props.self;
      const total = self?.connections.length ?? 0;

      return (
        <Dev.Object
          fontSize={11}
          name={'PeerVideo'}
          expand={{ level: 1, paths: ['$.Doc<Shared>'] }}
          data={{
            [`Peer<Self>[${total}]`]: self,
            'Doc<Me>': docMe?.current,
            'Doc<Shared>': docShared?.current,
          }}
        />
      );
    });

    // Debug
    dev.section((dev) => {
      dev.boolean((btn) =>
        btn
          .label('white background')
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
          .value((e) => e.state.props.showConnect ?? PeerVideo.DEFAULTS.showConnect)
          .onClick((e) =>
            e.change((d) => (local.showConnect = Dev.toggle(d.props, 'showConnect'))),
          ),
      );

      dev.hr(-1, 5);
      const count = (label: string, by: number) => {
        dev.button((btn) =>
          btn
            .label(label)
            .right(by > 0 ? '(+)' : '(-)')
            .onClick((e) => docShared.change((d) => (d.count += by))),
        );
      };
      count('count: increment', 1);
      count('count: decrement', -1);
    });

    dev.hr(5, 20);

    dev.section('(Debug) Programmatic Peer Connection', (dev) => {
      dev.button((btn) =>
        btn
          .label('connect')
          .enabled((e) => (e.state.props.self?.connections.length ?? 0) === 0)
          .right((e) => {
            const self = e.state.props.self;
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
          .label('disconnect')
          .enabled((e) => (e.state.props.self?.connections.length ?? 0) > 0)
          .right((e) => {
            const self = e.state.props.self;
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
      const self = e.state.props.self;
      return self ? <PeerList self={self} style={{ MarginX: 35 }} /> : null;
    });
  });

  e.it('init:network', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    const updateSelf = () => state.change((d) => (d.props.self = network.peerA));

    network = await TestNetwork.init();

    const self = network.peerA;
    self.connections$.subscribe(updateSelf);
    updateSelf();

    const changed = WebRTC.Util.connections.changed(self, ctx.dispose$);
    const added$ = changed.data.added$;
    const removed$ = changed.data.removed$;

    /**
     * Setup "sync protocol" on newly added data-connections.
     */
    added$.subscribe((conn) => {
      const dispose$ = removed$.pipe(rx.filter((e) => e.id === conn.id));
      const filedir = dirs.shared;
      Crdt.Doc.sync<DocShared>(conn.bus(), docShared, { filedir, dispose$ });
    });
  });
});
