import { COLORS, Color, Dev, Time, PeerUI, Webrtc, css, type t } from '../../test.ui';
import { AvatarTray } from '../ui.AvatarTray';
import { PeerCard } from '../ui.Dev.PeerCard';

import { Connector, ConnectorConfig, DEFAULTS } from '.';
import { Info } from '../ui.Info';

type T = { props: t.ConnectorProps };
const name = DEFAULTS.displayName;

export default Dev.describe(name, (e) => {
  const self = Webrtc.peer();
  const remote = Webrtc.peer();

  let ref: t.ConnectorRef;
  const initial: T = { props: { peer: self } };

  type LocalStore = Pick<t.ConnectorProps, 'behaviors'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.peerjs.ui.Connector');
  const local = localstore.object({
    behaviors: DEFAULTS.behaviors.default,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.behaviors = local.behaviors;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([330, null])
      .display('grid')
      .render<T>((e) => {
        const renderCount: t.RenderCountProps = {
          absolute: [-20, 2, null, null],
          opacity: 0.2,
          prefix: 'list.render-',
        };
        return (
          <Connector
            {...e.state.props}
            peer={self}
            debug={{ renderCount, name: 'Main' }}
            onReady={(e) => {
              console.info('⚡️ onReady', e);
              ref = e.ref;
            }}
            onSelectionChange={(e) => {
              console.info('⚡️ onSelectionChange', e);
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.row((e) => (
      <Info
        fields={['Module', 'Component', 'Peer', 'Peer.Remotes']}
        data={{ component: { name: `<${name}>` }, peer: { self } }}
      />
    ));

    dev.hr(5, 20);

    dev.row((e) => {
      return (
        <ConnectorConfig
          selected={e.state.props.behaviors}
          onChange={(e) => {
            state.change((d) => (d.props.behaviors = e.next));
            local.behaviors = e.next;
          }}
        />
      );
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button(['copy: bad "peer:<id>"', '(will fail) 💥'], (e) => {
        const id = Webrtc.PeerJs.Uri.generate();
        navigator.clipboard.writeText(id);
      });
      dev.hr(-1, 5);
      dev.button('redraw', (e) => dev.redraw());
    });

    dev.hr(5, 20);
    dev.row((e) => <PeerCard prefix={'peer.remote:'} peer={{ self: remote, remote: self }} />);
    dev.hr(5, 20);
    dev.row((e) => (
      <AvatarTray
        peer={self}
        onSelection={(e) => console.info(`⚡️ onChange`, e)}
        emptyMessage={'No media connetions to display.'}
      />
    ));
    dev.hr(5, 20);

    dev.section('ref ( ƒ )', (dev) => {
      const select = (target: t.LabelListItemTarget) => {
        const focus = true;
        Time.delay(0, () => ref.select(target, focus));
      };
      dev.button('select: first', (e) => select('First'));
      dev.button('select: last', (e) => select('Last'));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('getDisplayMedia', async (e) => {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        console.info('stream', stream);
      });

      dev.button(['redraw', '(harness)'], (e) => dev.redraw());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.footer
      .padding(0)
      .border(-0.1)
      .render<T>((e) => {
        const data = {
          peer: self.id,
          'peer.connections': self.current.connections,
        };

        const borderBottom = `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;
        const styles = {
          avatars: css({ padding: 8, borderBottom }),
          obj: css({ padding: 8 }),
        };

        return (
          <div>
            <AvatarTray
              peer={self}
              style={styles.avatars}
              onSelection={(e) => console.info(`⚡️ onChange`, e)}
            />
            <Dev.Object name={name} data={data} expand={1} style={styles.obj} />
          </div>
        );
      });
  });
});
