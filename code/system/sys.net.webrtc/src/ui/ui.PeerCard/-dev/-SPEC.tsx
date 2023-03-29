import { PeerCard, PeerCardProps } from '..';
import { COLORS, Crdt, Dev, Filesystem, MediaStream, rx, t, TEST, WebRtc } from './common';
import { PeerList } from '../../ui.PeerList';
import { DocShared, NetworkSchema } from './Schema.mjs';
import { SpecMonacoSync } from './-SPEC.Monaco';

const DEFAULTS = PeerCard.DEFAULTS;

type T = {
  remotePeer?: t.PeerId;
  spinning?: boolean;
  debug: { showBg: boolean; redraw: number };
};
const initial: T = {
  debug: { showBg: true, redraw: 0 },
};

type DocMe = { count: number; text?: string };
const initialMeDoc: DocMe = { count: 0 };

export default Dev.describe('PeerCard', async (e) => {
  e.timeout(1000 * 90);

  type LocalStore = { muted: boolean; showBg: boolean; showPeer?: boolean; showConnect?: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.PeerCard');
  const local = localstore.object({
    showBg: initial.debug.showBg,
    muted: DEFAULTS.muted,
    showPeer: DEFAULTS.showPeer,
    showConnect: DEFAULTS.showConnect,
  });

  let self: t.Peer | undefined;
  let docMe: t.CrdtDocRef<DocMe>;
  let docShared: t.CrdtDocRef<DocShared>;

  const SharedProps = {
    get current() {
      if (!docShared.current.tmp.props) SharedProps.change((d) => null); // NB: ensure the props object exists on the CRDT.
      return docShared.current.tmp.props as PeerCardProps;
    },
    change(fn: (draft: PeerCardProps) => void) {
      return docShared.change((d) => {
        const props = (d.tmp.props || {}) as PeerCardProps;
        fn(props);
        if (!d.tmp.props) d.tmp.props = props as t.JsonMap;
      });
    },
  };

  const bus = rx.bus();
  const fs = (await Filesystem.client({ bus })).fs;
  const dirs = {
    me: fs.dir('dev.doc.me'),
    shared: fs.dir('dev.doc.shared'),
  };

  async function initNetwork(ctx: t.DevCtx, doc: t.CrdtDocRef<DocShared>, state: t.DevCtxState<T>) {
    const { dispose$ } = ctx;
    const getStream = WebRtc.Media.singleton().getStream;
    const self = await WebRtc.peer(TEST.signal, { getStream, log: true });
    self.connections$.subscribe(() => ctx.redraw(true));

    const filedir = dirs.shared;
    WebRtc.Controller.listen(self, doc, {
      // filedir,
      dispose$,
      onConnectStart(e) {
        state.change((d) => (d.spinning = true));
      },
      onConnectComplete(e) {
        state.change((d) => (d.spinning = false));
      },
    });

    return self;
  }

  e.it('init:state', async (e) => {
    const ctx = Dev.ctx(e);
    const dispose$ = ctx.dispose$;
    const state = await ctx.state<T>(initial);
    const redraw = () => state.change((d) => d.debug.redraw++);

    await state.change((d) => {
      d.debug.showBg = local.showBg;
    });

    // Initialize CRDT documents.
    docMe = Crdt.Doc.ref<DocMe>(initialMeDoc, { dispose$ });
    docShared = NetworkSchema.genesis().doc;

    // Start file-persistence.
    await Crdt.Doc.file<DocMe>(dirs.me, docMe, { autosave: true, dispose$ });
    // await Crdt.Doc.file<DocShared>(dirs.shared, docShared, { autosave: true });

    // NB:
    // See: "init:network" (below) for network-sychronization-protocol startup (P2P).
    //      after the UI has been initiated.

    // Redraw when the CRDT document changes.
    docMe.$.subscribe(redraw);
    docShared.$.subscribe(redraw);

    SharedProps.change((d) => {
      d.muted = local.muted;
      d.showPeer = local.showPeer;
      d.showConnect = local.showConnect;
      d.fill = false;
    });
  });

  e.it('init:ui', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    const toggleMute = () => {
      return SharedProps.change((d) => (local.muted = d.muted = !d.muted));
    };

    ctx.host.footer.padding(0).render<T>(() => SpecMonacoSync(docShared));

    ctx.subject
      //
      .display('grid')
      .render<T>((e) => {
        const { showBg } = e.state.debug;
        const props = SharedProps.current;
        const fullscreen = props.fill;
        const camera = self?.connections.media.find((conn) => conn.metadata.input === 'camera');

        if (fullscreen && camera) {
          ctx.subject.size('fill');
        } else {
          ctx.subject.size([400, 320]);
        }

        if (fullscreen && camera) {
          return (
            <MediaStream.Video
              stream={camera?.stream.remote}
              muted={props.muted}
              style={{ Absolute: 0 }}
            />
          );
        }

        return (
          <PeerCard
            {...props}
            self={self}
            remotePeer={e.state.remotePeer}
            spinning={e.state.spinning}
            style={{ backgroundColor: showBg ? COLORS.WHITE : undefined }}
            onMuteClick={toggleMute}
            onRemotePeerChanged={(e) => state.change((d) => (d.remotePeer = e.remote))}
            onConnectRequest={async (e) => {
              if (!self) return;

              // NB: Updating the CRDT triggers to listening [Controller].
              docShared.change((d) => {
                const local = self!.id;
                const initiatedBy = local;
                WebRtc.Controller.Mutate.addPeer(d.network, local, e.remote, { initiatedBy });
              });
            }}
          />
        );
      });
  });

  e.it('init:network', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    self = await initNetwork(ctx, docShared, state);

    ctx.redraw();
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Environment', (dev) => {
      dev.button('redraw', (e) => e.change((d) => d.debug.redraw++));

      dev.boolean((btn) =>
        btn
          .label((e) => (e.state.debug.showBg ? 'background (white)' : 'background'))
          .value((e) => e.state.debug.showBg)
          .onClick((e) => {
            e.change((d) => (local.showBg = Dev.toggle(d.debug, 'showBg')));
          }),
      );

      dev.hr(-1, 5);

      dev.button('NetworkSchema (genesis)', (e) => {
        const { schema } = NetworkSchema.genesis();
        console.info('NetworkSchema.genesis', schema.sourceFile);
      });
    });

    dev.hr(5, 20);

    dev.section('Props', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `size${SharedProps.current.fill ? ' (fullscreen)' : ' (fixed)'}`)
          .value((e) => SharedProps.current.fill)
          .onClick((e) => {
            SharedProps.change((d) => Dev.toggle(d, 'fill'));
          }),
      );

      dev.boolean((btn) =>
        btn
          .label('showPeer')
          .value((e) => SharedProps.current.showPeer)
          .onClick((e) => {
            SharedProps.change((d) => (local.showPeer = Dev.toggle(d, 'showPeer')));
          }),
      );

      dev.boolean((btn) =>
        btn
          .label('showConnect')
          .value((e) => SharedProps.current.showConnect ?? PeerCard.DEFAULTS.showConnect)
          .onClick((e) => {
            SharedProps.change((d) => (local.showConnect = Dev.toggle(d, 'showConnect')));
          }),
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
      dev.textbox((txt) =>
        txt
          .label((e) => 'simple text string:')
          .value((e) => docMe.current.text)
          .placeholder('private text here...')
          .margin([0, 0, 15, 0])
          .onChange((e) => {
            console.log('e.next', e.next);
            docMe.change((d) => (d.text = e.next.to));
          })
          .onEnter((e) => {}),
      );

      count('count: increment', 1);
      count('count: decrement', -1);
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

    dev.section('(Debug)', (dev) => {
      dev.button((btn) =>
        btn
          .label('disconnect (all)')
          .enabled((e) => (self?.connections.length ?? 0) > 0)
          .right((e) => {
            if (!self) return '';
            return self.connections.length > 0 ? '←' : '';
          })
          .onClick(async (e) => {
            self?.connections.all.forEach((conn) => conn.dispose());
          }),
      );
    });

    dev.hr(5, [20, 50]);

    dev.row((e) => {
      return self ? <PeerList self={self} style={{ MarginX: 35 }} /> : null;
    });

    /**
     * Footer
     */
    dev.footer.border(-0.1).render<T>((e) => {
      const total = self?.connections.length ?? 0;

      return (
        <Dev.Object
          fontSize={11}
          name={'Me'}
          expand={{
            level: 1,
            paths: [
              //
              '$.Doc<Private>',
              '$.Doc<Public>',
              // '$.Doc<Public>.network',
              // '$.Doc<Public>.network.*',
              // '$.Doc<Public>.tmp',
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
  });
});
