import { Button, COLORS, Color, Dev, Time, UI, Webrtc, css, type t } from '../../test.ui';
import { AvatarTray } from '../ui.AvatarTray';
import { PeerCard } from '../ui.Dev.PeerCard';

import { Connector } from '.';
import { Info } from '../ui.Info';

type T = { props: t.ConnectorProps };
const name = Connector.displayName ?? '';

export default Dev.describe(name, (e) => {
  const self = Webrtc.peer();
  const remote = Webrtc.peer();

  let ref: t.ConnectorRef;
  const initial: T = {
    props: { peer: self },
  };

  type LocalStore = t.ConnectorPropsBehavior;
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.peerjs.ui.Connector');
  const local = localstore.object({
    grabFocusOnArrowKey: true,
    focusOnLoad: true,
  });

  const State = {
    behavior(props: t.ConnectorProps): t.ConnectorPropsBehavior {
      return props.behavior || (props.behavior = {});
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      const b = State.behavior(d.props);
      b.grabFocusOnArrowKey = local.grabFocusOnArrowKey;
      b.focusOnLoad = local.focusOnLoad;
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
          <UI.Connector
            {...e.state.props}
            peer={self}
            debug={{ renderCount, name: 'Main' }}
            onReady={(e) => {
              console.info('⚡️ onReady', e);
              ref = e;
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

    dev.section('Props: Load Behavior', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.behavior?.grabFocusOnArrowKey);
        btn
          .label((e) => `grabFocusOnArrowKey`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => {
              const b = State.behavior(d.props);
              local.grabFocusOnArrowKey = Dev.toggle(b, 'grabFocusOnArrowKey');
            }),
          );
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.behavior?.focusOnLoad);
        btn
          .label((e) => `focusOnLoad`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => {
              const b = State.behavior(d.props);
              local.focusOnLoad = Dev.toggle(b, 'focusOnLoad');
            }),
          );
      });
    });

    dev.hr(5, 20);

    dev.section('Ref ( ƒ )', (dev) => {
      dev.button((btn) => {
        const select = (label: string, target: t.LabelListItemTarget) => {
          return (
            <Button
              style={{ marginLeft: 8 }}
              label={label}
              onClick={() => Time.delay(0, () => ref.select(target))}
            />
          );
        };

        btn
          .label(`select`)
          .right((e) => {
            return (
              <div>
                {select('first', 'First')}
                {select('last', 'Last')}
              </div>
            );
          })
          .enabled((e) => true)
          .onClick((e) => {});
      });
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
