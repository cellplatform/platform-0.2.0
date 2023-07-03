import { DocShared, NetworkSchema } from '../../sys.net.schema';
import { PeerCard, PeerCardProps } from '../ui.PeerCard';
import { PeerList } from '../ui.PeerList';
import { SpecDocs } from './-SPEC.Docs.mjs';
import { SpecMonacoSync } from './-SPEC.Monaco';
import { REPL } from './-SPEC.REPL';
import {
  COLORS,
  css,
  Dev,
  Filesystem,
  Keyboard,
  MediaStream,
  rx,
  type t,
  TEST,
  WebRtc,
  WebRtcInfo,
} from './common';
import { FileCard } from './FileCard';

type T = {
  remotePeer?: t.PeerId;
  spinning?: boolean;
  parsed: { me?: any; shared?: any };
  debug: { showBg: boolean; persistSharedDoc?: boolean };
};
const initial: T = { debug: { showBg: true }, parsed: {} };

export default Dev.describe('PeerCard', async (e) => {
  e.timeout(1000 * 90);
  const { dispose, dispose$ } = rx.disposable();

  type LocalStore = {
    muted: boolean;
    showBg: boolean;
    showFooter: boolean;
    sidepanelWidth?: number | null;
    backgroundUrl?: string;
    persistSharedDoc?: boolean;
  };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.IDE');
  const local = localstore.object({
    muted: PeerCard.DEFAULTS.muted,
    showBg: initial.debug.showBg,
    persistSharedDoc: initial.debug.persistSharedDoc,
    showFooter: true,
    sidepanelWidth: 400,
    backgroundUrl: '',
  });

  let self: t.Peer | undefined;

  const Shared = {
    get current() {
      const doc = docs.shared.doc;
      if (!doc.current.tmp.props) Shared.change((d) => null); // NB: ensure the props object exists on the CRDT.
      return doc.current.tmp.props as PeerCardProps;
    },
    change(fn: (draft: PeerCardProps) => void) {
      return docs.shared.doc.change((d) => {
        const props = (d.tmp.props || {}) as PeerCardProps;
        fn(props);
        if (!d.tmp.props) d.tmp.props = props as t.JsonMap;
      });
    },
  };

  const bus = rx.bus();
  const rootfs = (await Filesystem.client({ bus, dispose$ })).fs;
  const docs = await SpecDocs({ rootfs, dispose$ });
  let controller: t.WebRtcController;
  let client: t.WebRtcEvents;

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
      'ALT + Backslash'(e) {
        e.handled();

        const before = dev.ctx.toObject().props.debug.width;
        const next = before === 0 ? 400 : 0;
        dev.ctx.debug.width(next);
        const after = dev.ctx.toObject().props.debug.width;

        local.sidepanelWidth = after;
        Shared.change((d) => (d.devPanelWidth = after));
      },

      'ALT + CTRL + Backslash'(e) {
        e.handled();

        const next = !Shared.current.devShowFooter;
        local.showFooter = next;
        Shared.change((d) => (d.devShowFooter = next));
        dev.redraw();
      },
    });
  });

  e.it('init:state', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    const redraw = () => ctx.redraw();

    await state.change((d) => {
      d.debug.showBg = local.showBg;
      d.debug.persistSharedDoc = local.persistSharedDoc;
    });

    // NB:
    // See: "init:network" (below) for network-sychronization-protocol startup (P2P).
    //      after the UI has been initiated.

    // Redraw when the CRDT document changes.
    docs.me.doc.$.subscribe(redraw);
    docs.shared.doc.$.subscribe(redraw);

    Shared.change((d) => {
      d.muted = local.muted;
      d.devShowFooter = local.showFooter;
      d.devPanelWidth = local.sidepanelWidth;
      d.backgroundUrl = local.backgroundUrl;
      d.fill = false;
    });
  });

  e.it('init:ui', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    const toggleMute = () => Shared.change((d) => (local.muted = d.muted = !d.muted));

    /**
     * CI (MetaData)
     */
    ctx.host.layer(1).render<T>((e) => {
      const root = 'https://github.com/cellplatform/platform-0.2.0/actions/workflows';
      const badge = {
        image: `${root}/node.esm.yml/badge.svg`,
        href: `${root}/node.esm.yml`,
      };

      const styles = {
        base: css({}),
        link: css({
          Absolute: [10, 10, null, null],
          pointerEvents: 'auto',
        }),
      };
      return (
        <div {...styles.base}>
          <a href={badge.href} target={'_blank'} rel={'noopener noreferrer'} {...styles.link}>
            <img src={badge.image} />
          </a>
        </div>
      );
    });

    /**
     * Configure REPL
     */
    ctx.host.layer(2).render<T>((e) => {
      const state = e.state?.parsed?.shared;
      return REPL.render({ state });
    });

    /**
     * Root layer (PeerCard)
     */
    ctx.subject.display('grid').render<T>((e) => {
      const { showBg } = e.state.debug;
      const props = Shared.current;
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
          fields={['Peer:Remote', 'Peer:Self', 'Video']}
          self={self}
          gap={2}
          remotePeer={e.state.remotePeer}
          footerVideo={camera?.stream.local}
          spinning={e.state.spinning}
          style={{ backgroundColor: showBg ? COLORS.WHITE : undefined }}
          onMuteClick={toggleMute}
          onRemotePeerChanged={(e) => state.change((d) => (d.remotePeer = e.remote))}
          onConnectRequest={(e) => {
            if (self) client?.connect.fire(e.remote);
          }}
        />
      );
    });

    /**
     * Footer (Code Editors)
     */
    ctx.host.footer.padding(0).render<T>((e) => {
      const props = Shared.current;
      return (
        <SpecMonacoSync
          self={self}
          docs={{
            me: docs.me.doc,
            shared: docs.shared.doc,
          }}
          paths={{
            me: docs.me.path,
          }}
          visible={props.devShowFooter}
          onChange={(e) => {
            console.log('Editor Text Changed', e);
            state.change((d) => {
              if (e.kind === 'me') d.parsed.me = e.data;
              if (e.kind === 'shared') d.parsed.shared = e.data;
            });
          }}
        />
      );
    });
  });

  e.it('init:network', async (e) => {
    async function initNetwork(ctx: t.DevCtx, doc: t.CrdtDocRef<DocShared>) {
      const { dispose$ } = ctx;
      const state = await ctx.state<T>(initial);

      const getStream = WebRtc.Media.singleton().getStream;
      const self = await WebRtc.peer(TEST.signal, { getStream, log: true });
      self.connections$.subscribe(async (e) => ctx.redraw());

      const filedir = docs.shared.fs;
      controller = WebRtc.Controller.listen(self, {
        doc,
        filedir,
        dispose$,
        onConnectStart(e) {
          state.change((d) => (d.spinning = true));
        },
        onConnectComplete(e) {
          state.change((d) => (d.spinning = false));
        },
      });
      client = controller.client();

      /**
       * TODO 🐷
       * - events.onConncted <== DocSync(DocRef)
       * - store memory-ref
       * - add to Card (SharedDoc)
       * - add to footer editor (SharedDoc)
       */

      return self;
    }

    const ctx = Dev.ctx(e);
    self = await initNetwork(ctx, docs.shared.doc);
    ctx.redraw();
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.row((e) => {
      if (!self || !controller) return;
      return (
        <WebRtcInfo
          fields={['Module.Verify', 'Module', 'State.Shared', 'Group', 'Group.Peers']}
          client={client}
        />
      );
    });

    dev.hr(5, 20);

    dev.section(['Me', '(Private)'], (dev) => {
      const me = docs.me;
      dev.row((e) => {
        return <FileCard doc={me.doc} file={me.file} filepath={docs.me.path} margin={[20, 40]} />;
      });

      const count = (label: string, by: number) => {
        dev.button((btn) =>
          btn
            .label(label)
            .right((e) => `count = ${me.doc.current.count} ${by > 0 ? '+ 1' : '- 1'}`)
            .onClick((e) => me.doc.change((d) => (d.count += by))),
        );
      };
      dev.textbox((txt) =>
        txt
          .value((e) => me.doc.current.text)
          .placeholder('private text here...')
          .margin([0, 0, 15, 0])
          .onChange((e) => {
            me.doc.change((d) => (d.text = e.to.value));
          })
          .onEnter((e) => {}),
      );

      count('increment →', 1);
      count('decrement →', -1);
    });

    dev.hr(5, 20);

    dev.section(['Shared State', '(Public)'], (dev) => {
      /**
       * Persistence (Save File)
       */
      dev.section((dev) => {
        dev.boolean((btn) =>
          btn
            .enabled(false)
            .label((e) => `autosave`)
            .value((e) => Boolean(e.state.debug.persistSharedDoc))
            .onClick((e) =>
              e.change((d) => {
                local.persistSharedDoc = Dev.toggle(d.debug, 'persistSharedDoc');
              }),
            ),
        );

        dev.hr(-1, 5);

        dev.button((btn) =>
          btn
            .enabled(false)
            .label('save file')
            .onClick((e) => {
              // const res = await docs.shared.file.save();
              // console.info('saved:', res);
            }),
        );

        dev.button((btn) =>
          btn
            .enabled(false)
            .label('delete file')
            .onClick((e) => {
              // const res = await docs.shared.file.delete();
              // console.info('deleted', res);
            }),
        );
      });

      const shared = docs.shared;
      dev.row(async (e) => {
        const debug = e.state.debug;
        // const isSaving = debug.persistSharedDoc;
        const info = await client.info.get();
        const sync = (info?.syncers ?? [])[0];
        return (
          <FileCard
            doc={shared.doc}
            // file={shared.file}
            filepath={docs.shared.path}
            syncer={sync?.syncer}
            margin={[20, 40]}
          />
        );
      });

      // const count = (label: string, by: number) => {
      //   dev.button((btn) =>
      //     btn
      //       .label(label)
      //       .right((e) => `count: ${shared.doc.current.count} ${by > 0 ? '+ 1' : '- 1'}`)
      //       .onClick((e) => shared.doc.change((d) => (d.count += by))),
      //   );
      // };
      // count('increment →', 1);
      // count('decrement →', -1);
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.textbox((txt) =>
        txt
          .label((e) => 'PeerCard.backgroundUrl')
          .value((e) => local.backgroundUrl ?? '')
          .onChange((e) => {
            local.backgroundUrl = e.to.value ?? '';
            e.redraw();
          })
          .onEnter((e) => {
            Shared.change((d) => (d.backgroundUrl = local.backgroundUrl));
            e.redraw();
          }),
      );

      dev.hr(0, 5);

      dev.boolean((btn) =>
        btn
          .label((e) => {
            const fill = Shared.current.fill;
            const suffix = fill ? ' (fill host)' : ' (constrained)';
            return `subject size ${suffix}`;
          })
          .value((e) => Shared.current.fill)
          .onClick((e) => Shared.change((d) => Dev.toggle(d, 'fill'))),
      );
    });

    dev.hr(5, 20);

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

      dev.button('Network Schema (← genesis)', (e) => {
        const { schema } = NetworkSchema.genesis();
        console.info('NetworkSchema.genesis', schema.sourceFile);
      });

      dev.button('prune (dead peers)', async (e) => {
        // WebRtc.Util.prune;
        const res = await client.prune.fire();
        console.info('prune:', res);
        //
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
              paths: ['$.yaml'],
            }}
            data={{
              [`Network.Peer(${total})`]: self,
              'Doc<Private>': docs.me.doc.current,
              'Doc<Public>': docs.shared.doc.current,
              yaml: {
                me: e.state.parsed.me,
                shared: e.state.parsed.shared,
              },
            }}
          />
        );
      });
  });
});
