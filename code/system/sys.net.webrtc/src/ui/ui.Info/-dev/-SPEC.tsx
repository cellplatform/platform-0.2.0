import { Crdt, Dev, Icons, Pkg, TestNetwork, WebRtc, css, rx, type t } from './common';

import { WebRtcInfo, type WebRtcInfoProps } from '..';
import { PeerInput } from '../../ui.PeerInput';
import { DevKeyboard } from './DEV.Keyboard.mjs';
import { DevMedia } from './DEV.Media';
import { DevRemotes } from './DEV.Remotes';

/**
 * video:   727951677
 * diagram: https://user-images.githubusercontent.com/185555/208217954-0427e91d-fcb3-4e9a-b5f1-1f86ed3500bf.png
 * youtube: https://youtu.be/WGfS6pPJ5jo
 */
type T = {
  props: WebRtcInfoProps;
  debug: {
    card?: boolean;
    title?: boolean;
    remotePeer?: t.PeerId;
    selectedPeer?: t.PeerId;
    addingConnection?: 'VirtualNetwork' | 'RealNetwork';
    useController?: boolean;
  };
};
const initial: T = {
  props: {},
  debug: {},
};

type LocalStore = T['debug'] & {
  fullscreenVideo?: boolean;
  fields?: t.WebRtcInfoField[];
};
const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.Info');
const local = localstore.object({
  card: true,
  title: false,
  useController: true,
  fullscreenVideo: false,
  fields: WebRtcInfo.DEFAULTS.fields.default,
});

export default Dev.describe('WebRtcInfo', async (e) => {
  const self = await TestNetwork.peer();
  const remotes: t.TDevRemote[] = [];

  const controller = WebRtc.controller(self);
  const client = controller.client();
  const props = controller.state.props<t.TDevSharedProps>('dev:ui', {
    count: 0,
    fields: local.fields ?? [],
    fullscreenVideo: local.fullscreenVideo,
    showRight: true,
    imageShow: false,
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
        connect: {
          self,
          remote: debug.remotePeer,
          spinning: debug.addingConnection === 'RealNetwork',
          onLocalCopied: (e) => navigator.clipboard.writeText(e.local),
          onRemoteChanged: (e) => state.change((d) => (d.debug.remotePeer = e.remote)),
          async onConnectRequest(e) {
            await state.change((d) => (d.debug.addingConnection = 'RealNetwork'));
            await client.connect.fire(e.remote);
            await state.change((d) => (d.debug.addingConnection = undefined));
          },
        },
        group: {
          useController: debug.useController,
          selected: debug.selectedPeer,
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

    await state.change((d) => {
      d.props.fields = local.fields;
      d.debug.card = local.card;
      d.debug.title = local.title;
      d.debug.useController = local.useController;
      if (!d.debug.selectedPeer) d.debug.selectedPeer = self.id; // NB: Ensure selection if showing video
    });

    const renderInfoCard = () => {
      const { debug } = state.current;
      const props = Util.props(state);

      /**
       * Setup host
       */
      const width = debug.card ? 320 : 280;
      ctx.subject.size([width, null]);
      ctx.subject.backgroundColor(debug.card ? 0 : 1);

      /**
       * Render <Component>
       */
      return <WebRtcInfo {...Util.props(state)} card={debug.card} />;
    };

    const renderFullscreenVideo = () => {
      const debug = state.current.debug;
      ctx.subject.backgroundColor(1);
      ctx.subject.size('fill');
      return <DevMedia self={self} peerid={debug.selectedPeer} />;
    };

    /**
     * Render subject.
     */
    ctx.subject.display('grid').render<T>((e) => {
      ctx.debug.width(props.current.showRight ? 400 : 0);
      return props.current.fullscreenVideo
        ? //
          renderFullscreenVideo()
        : renderInfoCard();
    });

    /**
     * Render overlay.
     */
    ctx.host.layer(1).render<T>(async (e) => {
      if (!props.current.imageShow) return null;

      const { Image } = await import('sys.ui.react.media.image');

      return (
        <Image
          style={{ Absolute: 51, pointerEvents: 'auto' }}
          src={props.current.imageBinary}
          drop={{ enabled: true }}
          paste={{ enabled: true, primary: false, tabIndex: 0 }}
          onDropOrPaste={(e) => props.change((d) => (d.imageBinary = e.file))}
        />
      );
    });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.header.border(-0.1).padding(0);
    dev.header.render<T>((e) => {
      const firstCamera = self.connections.media.find((conn) => conn.metadata.input === 'camera');
      const data = Util.data(state);
      return (
        <PeerInput
          self={self}
          remote={e.state.debug.remotePeer}
          fields={['Peer:Self', 'Peer:Remote', 'Video']}
          spinning={data.connect?.spinning}
          video={firstCamera?.stream.local}
          muted={true}
          onLocalCopied={data.connect?.onLocalCopied}
          onRemoteChanged={data.connect?.onRemoteChanged}
          onConnectRequest={data.connect?.onConnectRequest}
        />
      );
    });
  });

  e.it('ui:card', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section((dev) => {
      dev.row((e) => {
        if (props.current.fullscreenVideo) return null;
        return (
          <Dev.FieldSelector
            title={[Pkg.name, 'Card Fields']}
            style={{ Margin: [20, 50, 30, 50] }}
            all={WebRtcInfo.FIELDS}
            default={WebRtcInfo.DEFAULTS.fields.default}
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
      return <WebRtcInfo {...Util.props(state)} card={true} margin={[15, 25, 20, 25]} />;
    });

    dev.section((dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => (Boolean(props.current.fullscreenVideo) ? 'configure' : 'configuring'))
          .value((e) => !Boolean(props.current.fullscreenVideo))
          .onClick((e) => {
            props.change((d) => (local.fullscreenVideo = Dev.toggle(d, 'fullscreenVideo')));
            e.change((d) => {
              if (!d.debug.selectedPeer) d.debug.selectedPeer = self.id;
            });
          }),
      );

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label((e) => 'title')
          .value((e) => e.state.debug.title)
          .onClick((e) => e.change((d) => (local.title = Dev.toggle(d.debug, 'title')))),
      );

      dev.boolean((btn) =>
        btn
          .label('card')
          .enabled((e) => !Boolean(props.current.fullscreenVideo))
          .value((e) => e.state.debug.card)
          .onClick((e) => e.change((d) => (local.card = Dev.toggle(d.debug, 'card')))),
      );
    });

    dev.hr(5, 20);
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Debug', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `image`)
          .value((e) => Boolean(props.current.imageShow))
          .onClick((e) => props.change((d) => Dev.toggle(d, 'imageShow'))),
      );

      dev.hr(-1, 5);

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
          .label((e) => `useController`)
          .value((e) => Boolean(e.state.debug.useController))
          .onClick((e) => {
            e.change((d) => (local.useController = Dev.toggle(d.debug, 'useController')));
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

    dev.hr(-1, 5);
    const func = Crdt.func<{ msg: string }>(
      props.lens((d) => Crdt.Func.field(d, 'func')),
      async (e) => console.log('run', e),
    );
    dev.button((btn) =>
      btn
        .label('invoke')
        .right('Crdt.func')
        .onClick((e) => func.invoke({ msg: `run:by:${self.id}` })),
    );
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
          expand={{ level: 1, paths: ['$.State:::peers'] }}
          data={data}
        />
      );
    });
  });
});
