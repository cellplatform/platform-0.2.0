import { Crdt, Dev, Keyboard, PropList, TestNetwork, WebRtc, css, t } from './common';
import { DevRemotes } from './DEV.Remotes';

import { WebRtcInfo, type WebRtcInfoProps } from '..';
import { ConnectInput } from '../../ui.ConnectInput';

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
};
const initial: T = {
  props: {},
  debug: { bg: true, title: false },
};

type LocalStore = T['debug'] & { fields?: t.WebRtcInfoField[] };
const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.Info');
const local = localstore.object({
  bg: initial.debug.bg,
  title: initial.debug.title,
  fields: initial.props.fields,
  useGroupController: true,
});

export default Dev.describe('WebRtcInfo', async (e) => {
  const self = await TestNetwork.peer();
  const controller = WebRtc.controller(self);
  const events = controller.events();
  const remotes: t.TDevRemote[] = [];

  const Util = {
    props(state: t.DevCtxState<T>): WebRtcInfoProps {
      const { debug, props } = state.current;
      return {
        ...props,
        events,
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

    await state.change((d) => {
      d.props.fields = local.fields;
      d.debug.bg = local.bg;
      d.debug.title = local.title;
      d.debug.useGroupController = local.useGroupController;
    });

    ctx.subject.display('grid').render<T>((e) => {
      const { debug } = e.state;
      const props = Util.props(state);
      ctx.subject.backgroundColor(debug.bg ? 1 : 0);
      ctx.subject.size([320, null]);
      return (
        <div {...css({ Padding: debug.bg ? [20, 25] : 0 })}>
          <WebRtcInfo {...props} card={false} />
        </div>
      );
    });
  });

  e.it('keyboard:init', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    Keyboard.on({
      Enter(e) {
        // e.handled();
        // state.change((d) => Dev.toggle(d.props, 'flipped'));
      },
    });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.header.border(-0.1).padding(0);
    dev.header.render<T>((e) => {
      return (
        <ConnectInput
          remotePeer={e.state.debug.remotePeer}
          self={self}
          fields={['Peer:Self', 'Peer:Remote', 'Video']}
          spinning={e.state.debug.addingConnection === 'RealNetwork'}
          onLocalPeerCopied={(e) => navigator.clipboard.writeText(e.local)}
          onRemotePeerChanged={(e) => state.change((d) => (d.debug.remotePeer = e.remote))}
          onConnectRequest={async (e) => {
            await state.change((d) => (d.debug.addingConnection = 'RealNetwork'));
            await events.connect.fire(e.remote);
            await state.change((d) => (d.debug.addingConnection = undefined));
          }}
        />
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Debug', (dev) => {
      const isAdding = (state: T) => state.debug.addingConnection === 'VirtualNetwork';
      dev.button((btn) =>
        btn
          .label((e) =>
            isAdding(e.state) ? 'creating new network/peer...' : 'create new network/peer',
          )
          .enabled((e) => e.state.debug.addingConnection === undefined)
          .right(() => `(local sample)`)
          .spinner((e) => isAdding(e.state))
          .onClick(async (e) => {
            e.change((d) => (d.debug.addingConnection = 'VirtualNetwork'));

            // Create a new peer (sample remote).
            const peer = await TestNetwork.peer();
            const controller = WebRtc.controller(peer);
            const name = `remote-${remotes.length + 1}`;
            remotes.push({ name, peer, controller, events: controller.events() });

            await events.connect.fire(peer.id);
            e.change((d) => (d.debug.addingConnection = undefined));
          }),
      );

      dev.row(() => {
        const style = css({ Margin: [8, 0, 8, 30] });
        return <DevRemotes self={controller} remotes={remotes} style={style} />;
      });

      dev.button('sync', async () => {
        const info = await events.info.get();
        info?.syncers.forEach(({ syncer }) => syncer.update());
      });

      dev.hr(-1, 5);

      const count = (label: string, by: number) => {
        dev.button((btn) =>
          btn
            .label(label)
            .right((e) => `count: ${controller.state.current.count} ${by > 0 ? '+ 1' : '- 1'}`)
            .onClick((e) => {
              controller.state.change((d) => (d.count += by));
              dev.redraw();
            }),
        );
      };
      count('increment →', 1);
      count('decrement →', -1);

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label((e) => `useGroupController`)
          .value((e) => Boolean(e.state.debug.useGroupController))
          .onClick((e) =>
            e.change((d) => {
              local.useGroupController = Dev.toggle(d.debug, 'useGroupController');
            }),
          ),
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

            log('local', controller.state);
            remotes.forEach((remote) => log('remote', remote.controller.state));
            console.info('remotes', remotes);
          }),
      );

      dev.button('redraw', () => dev.redraw());
    });

    dev.hr(5, 20);
  });

  e.it('ui:card', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        const props = Util.props(state);
        return (
          <PropList.FieldSelector
            style={{ Margin: [10, 40, 10, 30] }}
            all={WebRtcInfo.FIELDS}
            selected={props.fields ?? WebRtcInfo.DEFAULTS.fields}
            onClick={(ev) => {
              const fields = ev.next as WebRtcInfoProps['fields'];
              dev.change((d) => (d.props.fields = fields));
              local.fields = fields?.length === 0 ? undefined : fields;
            }}
          />
        );
      });
    });

    dev.section((dev) => {
      dev.row((e) => {
        const props = Util.props(state);
        return <WebRtcInfo {...props} card={true} margin={[15, 25, 40, 25]} />;
      });

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label((e) => 'title')
          .value((e) => e.state.debug.title)
          .onClick((e) => e.change((d) => (local.title = Dev.toggle(d.debug, 'title')))),
      );

      dev.boolean((btn) =>
        btn
          .label('background')
          .value((e) => e.state.debug.bg)
          .onClick((e) => e.change((d) => (local.bg = Dev.toggle(d.debug, 'bg')))),
      );

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label((e) => `flipped`)
          .value((e) => Boolean(e.state.props.flipped))
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'flipped'))),
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
        peers[`me:${self.id}`] = peers[self.id];
        delete peers[self.id];
      }

      const data = {
        props: Util.props(state),
        [`Peers:Self(${total})`]: self,
        'Peers:Remote': remotes,
        'State:Shared': sharedState?.current,
        'State:Shared:peers': peers,
      };
      return (
        <Dev.Object
          name={'WebRtc.Info'}
          data={data}
          expand={{ level: 1, paths: ['$.State:Shared:peers'] }}
        />
      );
    });
  });
});
