import { WebRtcInfo, type WebRtcInfoProps } from '..';
import { ConnectInput } from '../../ui.ConnectInput';
import { DevKeyboard } from './DEV.Keyboard.mjs';
import { DevMedia } from './DEV.Media';
import { DevRemotes } from './DEV.Remotes';
import {
  COLORS,
  Crdt,
  Dev,
  Icons,
  Pkg,
  PropList,
  TestNetwork,
  Vimeo,
  WebRtc,
  css,
  rx,
  type t,
} from './common';

/**
 * video:   727951677
 * diagram: https://user-images.githubusercontent.com/185555/208217954-0427e91d-fcb3-4e9a-b5f1-1f86ed3500bf.png
 * youtube: https://youtu.be/WGfS6pPJ5jo
 */
type T = {
  props: WebRtcInfoProps;
  debug: {
    bg: boolean;
    title: boolean;
    remotePeer?: t.PeerId;
    selectedPeer?: t.PeerId;
    addingConnection?: 'VirtualNetwork' | 'RealNetwork';
    useGroupController?: boolean;
  };
  layers: { overlay?: JSX.Element };
};
const initial: T = {
  props: {},
  debug: { bg: true, title: false },
  layers: {},
};

type LocalStore = T['debug'] & {
  fullscreenVideo?: boolean;
  showRight?: boolean;
  cardFlipped?: boolean;
  fields?: t.WebRtcInfoField[];
  imageUrl?: t.TDevSharedProps['imageUrl'];
  imageVisible?: t.TDevSharedProps['imageVisible'];
  imageFit?: t.TDevSharedProps['imageFit'];
  vimeoId?: t.TDevSharedProps['vimeoId'];
  vimeoVisible?: t.TDevSharedProps['vimeoVisible'];
  vimeoMuted?: t.TDevSharedProps['vimeoMuted'];
  youtubeId?: t.TDevSharedProps['youtubeId'];
  youtubeVisible?: t.TDevSharedProps['youtubeVisible'];
  youtubeMuted?: t.TDevSharedProps['youtubeMuted'];
};
const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.Info');
const local = localstore.object({
  bg: initial.debug.bg,
  title: initial.debug.title,
  useGroupController: true,
  fields: WebRtcInfo.DEFAULTS.fields,
  fullscreenVideo: false,
  showRight: true,
  imageUrl: '',
  imageVisible: true,
  imageFit: 'cover',
  cardFlipped: false,
  vimeoId: '',
  vimeoVisible: true,
  vimeoMuted: true,
  youtubeId: '',
  youtubeVisible: true,
  youtubeMuted: true,
});

export default Dev.describe('WebRtcInfo', async (e) => {
  const bus = rx.bus();
  const self = await TestNetwork.peer();
  const remotes: t.TDevRemote[] = [];

  const vimeo = Vimeo.Events({ instance: { bus, id: 'foo' } });

  const controller = WebRtc.controller(self);
  const client = controller.client();
  const props = controller.state.props<t.TDevSharedProps>('dev:ui', {
    count: 0,
    fields: local.fields ?? [],
    showRight: true,
    // showRight: local.showRight,
    fullscreenVideo: local.fullscreenVideo,
    cardFlipped: local.cardFlipped,

    imageUrl: local.imageUrl ?? '',
    imageVisible: local.imageVisible,
    imageFit: local.imageFit,

    vimeoId: local.vimeoId,
    vimeoVisible: local.vimeoVisible,
    vimeoMuted: local.vimeoMuted,

    youtubeId: local.youtubeId,
    youtubeVisible: local.youtubeVisible,
    youtubeMuted: local.youtubeMuted,
  });

  DevKeyboard(props);

  const Util = {
    props(state: t.DevCtxState<T>): WebRtcInfoProps {
      const { debug } = state.current;
      const fields = props.current.fields;
      return {
        ...state.current.props,
        fields,
        client,
        title: debug.title ? 'Network Cell' : undefined,
        data: Util.data(state),
      };
    },

    data(state: t.DevCtxState<T>): t.WebRtcInfoData {
      const { debug } = state.current;
      return {
        group: {
          selected: debug.selectedPeer,
          useController: debug.useGroupController,
          async onPeerSelect(e) {
            console.info('⚡️ onPeerSelect', e);
            state.change((d) => (d.debug.selectedPeer = e.peerid));
          },
          async onPeerCtrlClick(e) {
            console.info('⚡️ onPeerCtrlClick', e);
          },
        },
      };
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    self.connections$.subscribe((e) => ctx.redraw());
    controller.state.doc.$.pipe().subscribe((e) => ctx.redraw());

    function persistToLocalOnChange(
      propField: keyof t.TDevSharedProps,
      localField: keyof LocalStore,
    ) {
      props.$.pipe(
        rx.map((e) => e.lens[propField]),
        rx.distinctUntilChanged((prev, next) => prev === next),
      ).subscribe((value) => ((local[localField] as any) = value));
    }
    persistToLocalOnChange('fields', 'fields');
    persistToLocalOnChange('showRight', 'showRight');
    persistToLocalOnChange('imageUrl', 'imageUrl');
    persistToLocalOnChange('imageVisible', 'imageVisible');
    persistToLocalOnChange('imageFit', 'imageFit');
    persistToLocalOnChange('vimeoId', 'vimeoId');
    persistToLocalOnChange('vimeoVisible', 'vimeoVisible');
    persistToLocalOnChange('vimeoMuted', 'vimeoMuted');
    persistToLocalOnChange('youtubeId', 'youtubeId');
    persistToLocalOnChange('youtubeVisible', 'youtubeVisible');
    persistToLocalOnChange('youtubeMuted', 'youtubeMuted');

    await state.change((d) => {
      d.props.fields = local.fields;
      d.debug.bg = local.bg;
      d.debug.title = local.title;
      d.debug.useGroupController = local.useGroupController;
      if (!d.debug.selectedPeer) d.debug.selectedPeer = self.id; // NB: Ensure selection if showing video
    });

    const renderInfoCard = (e: { state: T }) => {
      const { debug } = e.state;

      /**
       * Setup host
       */
      ctx.subject.backgroundColor(debug.bg ? 1 : 0);
      ctx.subject.size([320, null]);

      /**
       * Render <Component>
       */
      return (
        <div {...css({ Padding: debug.bg ? [20, 25] : 0 })}>
          <WebRtcInfo {...Util.props(state)} card={false} />
        </div>
      );
    };

    const renderFullscreenVideo = (e: { state: T }) => {
      ctx.subject.backgroundColor(1);
      ctx.subject.size('fill');
      return <DevMedia bus={bus} self={self} shared={props} peerid={e.state.debug.selectedPeer} />;
    };

    /**
     * Render subject.
     */
    ctx.subject.display('grid').render<T>((e) => {
      ctx.debug.width(props.current.showRight ? 400 : 0);
      return props.current.fullscreenVideo
        ? //
          renderFullscreenVideo(e)
        : renderInfoCard(e);
    });

    /**
     * Render overlay.
     */
    ctx.host.layer(1).render<T>((e) => e.state.layers.overlay);
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.header.border(-0.1).padding(0);
    dev.header.render<T>((e) => {
      const firstCamera = self.connections.media.find((conn) => conn.metadata.input === 'camera');

      return (
        <ConnectInput
          remotePeer={e.state.debug.remotePeer}
          self={self}
          fields={['Peer:Self', 'Peer:Remote', 'Video']}
          spinning={e.state.debug.addingConnection === 'RealNetwork'}
          video={firstCamera?.stream.local}
          muted={true}
          onLocalPeerCopied={(e) => navigator.clipboard.writeText(e.local)}
          onRemotePeerChanged={(e) => state.change((d) => (d.debug.remotePeer = e.remote))}
          onConnectRequest={async (e) => {
            await state.change((d) => (d.debug.addingConnection = 'RealNetwork'));
            await client.connect.fire(e.remote);
            await state.change((d) => (d.debug.addingConnection = undefined));
          }}
        />
      );
    });
  });

  e.it('ui:specs', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    const loadOverlay = async (kind: t.TDevSharedProps['overlay']) => {
      console.log('load overlay');

      const set = (el?: JSX.Element) => state.change((d) => (d.layers.overlay = el));

      if (!kind) {
        set(undefined);
      }

      if (kind === 'sys.data.crdt') {
        const { dev } = await import('sys.data.crdt');
        const { Specs } = await dev();
        const m = await Specs['sys.data.crdt.tests']();
        const el = <Dev.Harness key={'crdt'} spec={m.default} background={1} />;
        set(el);
      }

      if (kind === 'sys.data.project') {
        /**
         * TODO 🐷
         * import from remote repo via [Module Federation].
         */
        const el = <div>🐷 TDB: sys.data.project</div>;
        set(el);
      }

      if (kind === 'sys.ui.image') {
        const { dev } = await import('sys.ui.react.media.image');
        const { Specs } = await dev();

        const m = await Specs['sys.ui.media.image.Image']();
        const el = <Dev.Harness key={'image'} spec={m.default} background={1} />;
        set(el);
      }
    };

    props.$.pipe(
      rx.map((e) => e.lens.overlay),
      rx.distinctUntilChanged((prev, next) => prev === next),
    ).subscribe(loadOverlay);

    dev.button('redraw', (e) => {
      dev.redraw();
    });

    dev.bdd((bdd) =>
      bdd
        .localstore('dev:sys.net.webrtc.Info')
        .margin([30, 50, 30, 50])
        .run({
          ctx: () => ({ props }),
          label: 'Environment',
          button: 'hidden',
        })
        .specs({ selectable: false })
        .modules(import('./-TEST.Sample'))
        .onChanged(async (e) => {}),
    );

    dev.hr(5, 20);
  });

  e.it('ui:card', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.title('Card');

    dev.boolean((btn) =>
      btn
        .label((e) => (Boolean(props.current.fullscreenVideo) ? 'configure' : 'configuring'))
        .value((e) => !Boolean(props.current.fullscreenVideo))
        .onClick((e) => {
          props.change((d) => {
            local.fullscreenVideo = Dev.toggle(d, 'fullscreenVideo');
          });

          e.change((d) => {
            if (!d.debug.selectedPeer) d.debug.selectedPeer = self.id;
          });
        }),
    );

    dev.boolean((btn) =>
      btn
        .label((e) => (Boolean(props.current.cardFlipped) ? 'flipped' : 'flip'))
        .value((e) => Boolean(props.current.cardFlipped))
        .enabled((e) => Boolean(props.current.fullscreenVideo))
        .onClick((e) => props.change((d) => Dev.toggle(d, 'cardFlipped'))),
    );

    dev.hr(-1, 5);

    dev.section((dev) => {
      dev.row((e) => {
        if (props.current.fullscreenVideo) return null;
        return (
          <PropList.FieldSelector
            title={[Pkg.name, 'Card Fields']}
            style={{ Margin: [20, 50, 30, 50] }}
            all={WebRtcInfo.FIELDS}
            default={WebRtcInfo.DEFAULTS.fields}
            selected={props.current.fields}
            resettable={true}
            onClick={(ev) => {
              const next = ev.next as WebRtcInfoProps['fields'];
              props.change((d) => (d.fields = next));
            }}
          />
        );
      });
    });

    dev.row((e) => {
      if (!props.current.fullscreenVideo) return null;
      return (
        <WebRtcInfo
          {...Util.props(state)}
          card={true}
          flipped={props.current.cardFlipped}
          margin={[15, 25, 40, 25]}
        />
      );
    });

    dev.section('Image', (dev) => {
      dev.textbox((txt) =>
        txt
          .margin([5, 0, 10, 0])
          .placeholder('https:')
          .left(true)
          .value((e) => props.current.imageUrl ?? '')
          .onChange((e) => {
            props.change((d) => (d.imageUrl = e.to.value));
          })
          .onEnter((e) => {}),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `visible`)
          .value((e) => Boolean(props.current.imageVisible))
          .enabled((e) => Boolean(props.current.fullscreenVideo))
          .onClick((e) => props.change((d) => Dev.toggle(d, 'imageVisible'))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `${props.current.imageFit === 'cover' ? 'cover' : 'contained'}`)
          .value((e) => Boolean(props.current.imageFit === 'cover'))
          .enabled((e) => Boolean(props.current.fullscreenVideo))
          .onClick((e) => {
            props.change((d) => {
              const next = d.imageFit === 'cover' ? 'contain' : 'cover';
              d.imageFit = next;
            });
          }),
      );
    });

    dev.hr(-1, 15);

    dev.section('Vimeo', (dev) => {
      dev.textbox((txt) =>
        txt
          .margin([5, 0, 10, 0])
          .left(true)
          .placeholder('vimeo id')
          .value((e) => props.current.vimeoId ?? '')
          .onChange((e) => {
            props.change((d) => (d.vimeoId = e.to.value));
          })
          .onEnter((e) => {}),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `visible`)
          .value((e) => Boolean(props.current.vimeoVisible))
          .enabled((e) => Boolean(props.current.fullscreenVideo))
          .onClick((e) => props.change((d) => Dev.toggle(d, 'vimeoVisible'))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `muted`)
          .value((e) => Boolean(props.current.vimeoMuted))
          .enabled((e) => Boolean(props.current.fullscreenVideo))
          .onClick((e) => props.change((d) => Dev.toggle(d, 'vimeoMuted'))),
      );

      dev.hr(-1, 5);
      dev.button('play', (e) => props.change((d) => (d.vimeoPlaying = true)));
      dev.button('pause', (e) => props.change((d) => (d.vimeoPlaying = false)));
    });

    dev.hr(5, 20);

    dev.section('YouTube', (dev) => {
      dev.textbox((txt) =>
        txt
          .margin([5, 0, 10, 0])
          .left(true)
          .placeholder('https:')
          .value((e) => props.current.youtubeId ?? '')
          .onChange((e) => {
            props.change((d) => (d.youtubeId = e.to.value));
          })
          .onEnter((e) => {}),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `visible`)
          .value((e) => Boolean(props.current.youtubeVisible))
          .enabled((e) => Boolean(props.current.fullscreenVideo))
          .onClick((e) => props.change((d) => Dev.toggle(d, 'youtubeVisible'))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `muted`)
          .value((e) => Boolean(props.current.youtubeMuted))
          .enabled(false)
          .enabled((e) => Boolean(props.current.fullscreenVideo))
          .onClick((e) => props.change((d) => Dev.toggle(d, 'youtubeMuted'))),
      );
    });

    dev.hr(5, 20);

    dev.section('Properites', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => 'title')
          .value((e) => e.state.debug.title)
          .onClick((e) => e.change((d) => (local.title = Dev.toggle(d.debug, 'title')))),
      );

      dev.boolean((btn) =>
        btn
          .label('background')
          .enabled((e) => !Boolean(props.current.fullscreenVideo))
          .value((e) => e.state.debug.bg)
          .onClick((e) => e.change((d) => (local.bg = Dev.toggle(d.debug, 'bg')))),
      );
    });

    dev.hr(5, 20);
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Debug', (dev) => {
      const isAdding = (state: T) => state.debug.addingConnection === 'VirtualNetwork';
      dev.button((btn) =>
        btn
          .label((e) => (isAdding(e.state) ? 'creating peer...' : 'create peer'))
          .enabled((e) => e.state.debug.addingConnection === undefined)
          .right(() => `(sample)`)
          .spinner((e) => isAdding(e.state))
          .onClick(async (e) => {
            e.change((d) => (d.debug.addingConnection = 'VirtualNetwork'));

            // Create a new peer (sample remote).
            const peer = await TestNetwork.peer();
            const controller = WebRtc.controller(peer);
            const client = controller.client();
            const name = `remote-${remotes.length + 1}`;
            remotes.push({ name, peer, controller, client });

            await client.connect.fire(peer.id);
            e.change((d) => (d.debug.addingConnection = undefined));
          }),
      );

      dev.row(() => {
        const style = css({ Margin: [8, 0, 8, 30] });
        return <DevRemotes self={controller} remotes={remotes} style={style} />;
      });

      dev.button((btn) =>
        btn
          .label('force sync')
          .right(
            <div {...css({ Flex: 'x-center-center' })}>
              <Icons.Network.Nodes size={15} />
              <Icons.Refresh size={15} style={{ marginLeft: 3 }} />
            </div>,
          )
          .onClick(async (e) => {
            const info = await client.info.get();

            info?.state.change((d) => {
              WebRtc.State.Mutate.updateLocalMetadata(d.network, self.id);
            });

            const wait = info?.syncers.map(({ syncer }) => syncer.update().complete) ?? [];
            await Promise.all(wait);
          }),
      );

      dev.hr(-1, 5);

      const count = (label: string, by: number) => {
        dev.button((btn) =>
          btn
            .label(label)
            .right((e) => `count: ${props.current.count} ${by > 0 ? '+ 1' : '- 1'}`)
            .onClick((e) => props.change((d) => (d.count += by))),
        );
      };
      count('increment →', 1);
      count('decrement →', -1);

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label((e) => `useGroupController`)
          .value((e) => Boolean(e.state.debug.useGroupController))
          .onClick((e) => {
            e.change((d) => {
              local.useGroupController = Dev.toggle(d.debug, 'useGroupController');
            });
          }),
      );

      dev.hr(-1, 5);

      dev.button((btn) =>
        btn
          .label('print debug')
          .right('← console log')
          .onClick((e) => {
            const state = controller.state.current;
            console.log('state', Crdt.toObject(state.network.peers ?? {}));

            const log = (title: string, ref: t.NetworkDocSharedRef) => {
              const state = Crdt.toObject(ref.current);
              console.group('🌳 ', title);
              console.info('state', state);
              console.info('peers', state.network.peers);
              console.groupEnd();
            };

            log('local', controller.state.doc);
            remotes.forEach((remote) => log('remote', remote.controller.state.doc));
            console.info('remotes', remotes);
          }),
      );

      dev.button((btn) =>
        btn
          .label('redraw')
          .right(<Icons.Refresh size={15} style={{ marginLeft: 3 }} />)
          .onClick((e) => dev.redraw()),
      );
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.footer.border(-0.1).render<T>(async (e) => {
      const sharedState = controller.state;
      const total = self.connectionsByPeer.length ?? 0;

      const peers = { ...(sharedState?.current?.network.peers ?? {}) };
      if (peers[self.id]) {
        peers[`(me):${self.id}`] = peers[self.id];
        delete peers[self.id];
      }

      const data = {
        props: Util.props(state),
        [`Peers:Self(${total})`]: self,
        'Peers:Remote': remotes,
        State: sharedState?.current,
        'State:(lens):props': props.current,
        'State:(lens):peers': peers,
      };
      return (
        <Dev.Object
          name={'WebRtc.Info'}
          data={data}
          expand={{ level: 1, paths: ['$.State:::peers'] }}
        />
      );
    });
  });
});
