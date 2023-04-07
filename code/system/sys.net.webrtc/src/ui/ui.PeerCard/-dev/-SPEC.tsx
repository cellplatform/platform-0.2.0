import { PeerCard, PeerCardProps } from '..';
import { PeerList } from '../../ui.PeerList';
import { SpecMonacoSync } from './-SPEC.Monaco';
import {
  COLORS,
  Crdt,
  Dev,
  Filesystem,
  Keyboard,
  MediaStream,
  rx,
  t,
  TEST,
  WebRtc,
} from './common';
import { FileCard } from './FileCard';
import { DocShared, NetworkSchema } from './Schema.mjs';

const DEFAULTS = PeerCard.DEFAULTS;

type T = {
  remotePeer?: t.PeerId;
  spinning?: boolean;
  debug: { showBg: boolean };
};
const initial: T = {
  debug: { showBg: true },
};

type DocMe = { count: number; text?: string };
const initialMeDoc: DocMe = { count: 0 };

export default Dev.describe('PeerCard', async (e) => {
  e.timeout(1000 * 90);

  type LocalStore = {
    muted: boolean;
    showBg: boolean;
    showFooter: boolean;
    showPeer?: boolean;
    showConnect?: boolean;
    sidepanelWidth?: number;
  };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.PeerCard');
  const local = localstore.object({
    muted: DEFAULTS.muted,
    showBg: initial.debug.showBg,
    showFooter: true,
    showPeer: DEFAULTS.showPeer,
    showConnect: DEFAULTS.showConnect,
    sidepanelWidth: 400,
  });

  let self: t.Peer | undefined;
  let docMe: t.CrdtDocRef<DocMe>;
  let docMeFile: t.CrdtDocFile<DocMe>;
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
  const getFs = (path: string) => ({ path, fs: fs.dir(path) });
  const fsdirs = {
    me: getFs('dev.doc.me'),
    shared: getFs('dev.doc.shared'),
  };

  async function initNetwork(ctx: t.DevCtx, doc: t.CrdtDocRef<DocShared>, state: t.DevCtxState<T>) {
    const { dispose$ } = ctx;
    const getStream = WebRtc.Media.singleton().getStream;
    const self = await WebRtc.peer(TEST.signal, { getStream, log: true });
    self.connections$.subscribe(() => ctx.redraw());

    const filedir = fsdirs.shared.fs;
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

  e.it('init:keyboard', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    /**
     * Keyboard shortcut actions.
     */
    const keyboard = Keyboard.on({
      /**
       * Show/hide right-hand side panel.
       */
      'CMD + Backslash'(e) {
        e.cancel();

        const before = dev.ctx.toObject().props.debug.width;
        const next = before === 0 ? 400 : 0;
        dev.ctx.debug.width(next);
        const after = dev.ctx.toObject().props.debug.width;

        local.sidepanelWidth = after;
        SharedProps.change((d) => (d.devPanelWidth = after));
      },

      'Alt + Backslash'(e) {
        e.cancel();

        const next = !SharedProps.current.devShowFooter;
        local.showFooter = next;
        SharedProps.change((d) => (d.devShowFooter = next));
        dev.redraw();
      },
    });
  });

  e.it('init:state', async (e) => {
    const ctx = Dev.ctx(e);
    const dispose$ = ctx.dispose$;
    const state = await ctx.state<T>(initial);
    const redraw = () => ctx.redraw();

    await state.change((d) => {
      d.debug.showBg = local.showBg;
    });

    // Initialize CRDT documents.
    docMe = Crdt.Doc.ref<DocMe>(initialMeDoc, { dispose$ });
    docShared = NetworkSchema.genesis().doc;

    // Start file-persistence.
    docMeFile = await Crdt.Doc.file<DocMe>(fsdirs.me.fs, docMe, { autosave: true, dispose$ });
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
      d.devShowFooter = local.showFooter;
      d.showConnect = local.showConnect;
      d.devPanelWidth = local.sidepanelWidth;
      d.fill = false;
    });
  });

  e.it('init:ui', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    const toggleMute = () => {
      return SharedProps.change((d) => (local.muted = d.muted = !d.muted));
    };

    ctx.host.footer.padding(0).render<T>((e) => {
      const props = SharedProps.current;
      if (!props.devShowFooter) return null;
      return <SpecMonacoSync self={self} doc={docShared} />;
    });

    ctx.subject
      //
      .display('grid')
      .render<T>((e) => {
        const { showBg } = e.state.debug;
        const props = SharedProps.current;
        const fullscreen = props.fill;
        const camera = self?.connections.media.find((conn) => conn.metadata.input === 'camera');

        ctx.debug.width(props.devPanelWidth ?? 400);

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

    console.log('self', self);
    ctx.redraw();
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());

      dev.boolean((btn) =>
        btn
          .label((e) => (e.state.debug.showBg ? 'background (white)' : 'background'))
          .value((e) => e.state.debug.showBg)
          .onClick((e) => {
            e.change((d) => (local.showBg = Dev.toggle(d.debug, 'showBg')));
          }),
      );

      dev.hr(-1, 5);

      dev.button('Network (Genesis Schema)', (e) => {
        const { schema } = NetworkSchema.genesis();
        console.info('NetworkSchema.genesis', schema.sourceFile);
      });

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

      dev.hr(-1, 5);

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

    dev.section('Private Doc (Me)', (dev) => {
      const count = (label: string, by: number) => {
        dev.button((btn) =>
          btn
            .label(label)
            .right((e) => `← count: ${docShared.current.count} ${by > 0 ? '+ 1' : '- 1'}`)
            .onClick((e) => docMe.change((d) => (d.count += by))),
        );
      };
      dev.textbox((txt) =>
        txt
          .value((e) => docMe.current.text)
          .placeholder('private text here...')
          .margin([0, 0, 15, 0])
          .onChange((e) => {
            docMe.change((d) => (d.text = e.to.value));
          })
          .onEnter((e) => {}),
      );

      count('increment', 1);
      count('decrement', -1);

      dev.row((e) => {
        return (
          <FileCard doc={docMe} file={docMeFile} filepath={fsdirs.me.path} margin={[20, 40]} />
        );
      });
    });

    dev.hr(5, 20);

    dev.section('Public Doc (Shared)', (dev) => {
      const count = (label: string, by: number) => {
        dev.button((btn) =>
          btn
            .label(label)
            .right((e) => `← count: ${docShared.current.count} ${by > 0 ? '+ 1' : '- 1'}`)
            .onClick((e) => docShared.change((d) => (d.count += by))),
        );
      };
      count('increment', 1);
      count('decrement', -1);

      dev.row((e) => {
        return <FileCard doc={docShared} filepath={fsdirs.shared.path} margin={[20, 40]} />;
      });
    });

    dev.hr(5, [20, 50]);

    dev.row((e) => {
      return self ? <PeerList self={self} style={{ MarginX: 35 }} /> : null;
    });
  });

  e.it('ui:debug:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const isLocalhost = window.location.hostname === 'localhost';

    dev.footer
      //
      .border(-0.1)
      .render<T>((e) => {
        const total = self?.connections.length ?? 0;

        return (
          <Dev.Object
            fontSize={11}
            name={'Me'}
            expand={{
              level: 1,
              paths: isLocalhost && [
                //
                // '$.Doc<Private>',
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
