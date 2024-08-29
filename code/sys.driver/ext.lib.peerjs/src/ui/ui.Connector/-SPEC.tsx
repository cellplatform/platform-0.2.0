import {
  COLORS,
  Color,
  Dev,
  Immutable,
  Json,
  Pkg,
  Time,
  Webrtc,
  css,
  rx,
  type t,
} from '../../test.ui';
import { AvatarTray } from '../ui.AvatarTray';
import { PeerCard } from '../ui.Dev.PeerCard';

import { Connector, ConnectorConfig, DEFAULTS } from '.';
import { Info } from '../ui.Info';

type P = t.ConnectorProps;
type D = {};

/**
 * Spec
 */
const name = DEFAULTS.displayName;

export default Dev.describe(name, (e) => {
  const self = Webrtc.peer();
  const remote = Webrtc.peer();

  let ref: t.ConnectorRef;

  type LocalStore = { props?: string; debug?: string };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ props: undefined, debug: undefined });
  const State = {
    props: Immutable.clonerRef<P>(Json.parse<P>(local.props, DEFAULTS.props as any)),
    debug: Immutable.clonerRef<D>(Json.parse<D>(local.debug, {})),
  } as const;

  e.it('ui:init', (e) => {
    const ctx = Dev.ctx(e);

    const props$ = State.props.events().changed$;
    const debug$ = State.debug.events().changed$;
    rx.merge(props$, debug$)
      .pipe(rx.debounceTime(1000))
      .subscribe(() => {
        local.props = Json.stringify(State.props.current);
        local.debug = Json.stringify(State.debug.current);
      });
    rx.merge(props$, debug$)
      .pipe(rx.debounceTime(100))
      .subscribe(() => ctx.redraw());

    ctx.debug.width(330);
    ctx.subject
      .size([330, null])
      .display('grid')
      .render<D>((e) => {
        const props = State.props.current;
        Dev.Theme.background(ctx, props.theme, 1);

        const renderCount: t.RenderCountProps = {
          absolute: [-20, 2, null, null],
          opacity: 0.2,
          prefix: 'list.render-',
        };
        return (
          <Connector
            {...props}
            peer={self}
            debug={{ renderCount, name: 'Main' }}
            onReady={(e) => {
              ref = e.ref;
              console.info('⚡️ onReady', e);
            }}
            onSelectionChange={(e) => {
              console.info('⚡️ onSelectionChange', e);
            }}
          />
        );
      });
  });

  e.it('ui:debug', (e) => {
    const dev = Dev.tools<D>(e);
    dev.row((e) => (
      <Info
        self={self}
        fields={['Module', 'Component', 'Peer', 'Peer.Remotes']}
        data={{ component: { name } }}
      />
    ));

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      Dev.Theme.immutable(dev, State.props);
    });

    dev.hr(2, 15);

    dev.row(() => {
      const props = State.props.current;
      return (
        <ConnectorConfig
          selected={props.behaviors}
          onChange={(e) => State.props.change((d) => (d.behaviors = e.next))}
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

  e.it('ui:footer', (e) => {
    const dev = Dev.tools<D>(e);
    dev.footer
      .padding(0)
      .border(-0.1)
      .render<D>(() => {
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
