import { Value, Dev, css, PropList, t, TestNetwork, Keyboard, WebRtc } from '../../test.ui';
import { WebRtcInfo, WebRtcInfoProps } from '.';
import { ConnectInput } from '../ui.ConnectInput';

type T = {
  props: WebRtcInfoProps;
  debug: { bg: boolean; title: boolean; addingConnection?: boolean; remotePeer?: t.PeerId };
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
});

export default Dev.describe('WebRtcInfo', async (e) => {
  type TRemote = {
    name: string;
    peer: t.Peer;
    controller: t.WebRtcEvents;
    state: t.NetworkDocSharedRef;
  };
  const remotes: TRemote[] = [];
  const self = await TestNetwork.peer();
  const events = WebRtc.controller(self);
  const selfState = (await events.info.get())?.state!;

  const Util = {
    props(state: T): WebRtcInfoProps {
      const { debug, props } = state;
      return {
        ...props,
        title: debug.title ? 'Network' : undefined,
        data: {
          events,
          self: {},
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
    });

    ctx.subject.display('grid').render<T>((e) => {
      const { debug } = e.state;
      const props = Util.props(e.state);
      ctx.subject.backgroundColor(debug.bg ? 1 : 0);
      ctx.subject.size([320, null]);

      const base = css({ Padding: debug.bg ? [20, 25] : 0 });
      return (
        <div {...base}>
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
        e.handled();
        state.change((d) => Dev.toggle(d.props, 'flipped'));
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
          onLocalPeerCopied={(e) => navigator.clipboard.writeText(e.local)}
          onRemotePeerChanged={(e) => state.change((d) => (d.debug.remotePeer = e.remote))}
        />
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        const props = Util.props(e.state);
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
        const props = Util.props(e.state);
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
          .label((e) => `flipped (← Enter)`)
          .value((e) => Boolean(e.state.props.flipped))
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'flipped'))),
      );
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      const isAdding = (state: T) => state.debug.addingConnection!;
      dev.button((btn) =>
        btn
          .label((e) => (isAdding(e.state) ? 'creating new network/peer...' : 'new network/peer'))
          .enabled((e) => !isAdding(e.state))
          .spinner((e) => isAdding(e.state))
          .right((e) => `${remotes.length} remote ${Value.plural(remotes.length, 'peer', 'peers')}`)
          .onClick(async (e) => {
            e.change((d) => (d.debug.addingConnection = true));

            // Create a new sample peer.
            const peer = await TestNetwork.peer();
            const controller = WebRtc.controller(peer);
            const state = (await controller.info.get())?.state!;
            const name = `remote-${remotes.length + 1}`;
            remotes.push({ name, peer, controller, state });

            // Connect.
            await events.connect.fire(peer.id);
            e.change((d) => (d.debug.addingConnection = false));
          }),
      );

      dev.hr(-1, 5);

      const count = (label: string, by: number) => {
        dev.button((btn) =>
          btn
            .label(label)
            .right((e) => `count: ${selfState.current.count} ${by > 0 ? '+ 1' : '- 1'}`)
            .onClick((e) => {
              selfState.change((d) => (d.count += by));
              dev.redraw();
            }),
        );
      };
      count('increment →', 1);
      count('decrement →', -1);
    });

    dev.hr(-1, 5);

    dev.button((btn) =>
      btn
        .label('print debug')
        .right('← console log')
        .onClick(async (e) => {
          console.info('self.count:', selfState.current.count);
          for (const remote of remotes) {
            const state = remote.state.current;
            console.info(`${remote.name}.count:`, state.count);
          }
        }),
    );
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer.border(-0.1).render<T>(async (e) => {
      const info = await events.info.get();
      const sharedState = info?.state;

      const total = self?.connectionsByPeer.length ?? 0;
      const data = {
        [`Peer.Self(${total})`]: self,
        'Peers.Remote': remotes,
        'State.Shared': sharedState?.current,
        'State.Shared.peers': sharedState?.current?.network.peers,
      };
      return <Dev.Object name={'WebRtc.InfoCard'} data={data} expand={1} />;
    });
  });
});
