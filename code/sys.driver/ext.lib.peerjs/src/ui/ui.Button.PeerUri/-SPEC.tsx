import { DEFAULTS, PeerUriButton } from '.';
import { slug, css, Color, rx, Dev, Immutable, Json, Pkg } from '../../test.ui';
import { type t } from './common';

type P = t.PeerUriButtonProps;
type D = { fixedWidth: boolean; prefixSelf: boolean };

/**
 * Spec
 */
const name = DEFAULTS.displayName;

export default Dev.describe(name, (e) => {
  type LocalStore = { props?: string; debug?: string };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ props: undefined, debug: undefined });
  const State = {
    props: Immutable.clonerRef<P>(Json.parse<P>(local.props, DEFAULTS.props)),
    debug: Immutable.clonerRef<D>(
      Json.parse<D>(local.debug, { fixedWidth: true, prefixSelf: true }),
    ),
  } as const;

  const Props = {
    get current(): P {
      const props = State.props.current;
      const debug = State.debug.current;
      return {
        ...props,
        prefix: debug.prefixSelf ? 'self::' : undefined,
      };
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<D>(e);

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

    const props = State.props;
    if (!props.current.id) props.change((d) => (d.id = slug()));

    ctx.debug.width(330);
    ctx.subject.display('grid').render<D>((e) => {
      const props = Props.current;
      const debug = State.debug.current;
      Dev.Theme.background(dev, props.theme, 1);

      // Update host width.
      const fontSize = props.fontSize ?? DEFAULTS.props.fontSize;
      const width = fontSize * 12;
      ctx.subject.size([debug.fixedWidth ? width : null, null]);

      return <PeerUriButton {...props} />;
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<D>(e);

    dev.section('Properties', (dev) => {
      Dev.Theme.immutable(dev, State.props, 1);
      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const state = State.props;
        const current = () => !!state.current.monospace;
        btn
          .label(() => `monospace`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d, 'monospace')));
      });

      dev.boolean((btn) => {
        const state = State.props;
        const current = () => !!state.current.bold;
        btn
          .label(() => `bold`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d, 'bold')));
      });

      dev.hr(-1, 5);
      const fontSize = (size: number) => {
        dev.button((btn) => {
          const Is = PeerUriButton.Is;
          const state = State.props;
          const isDefault = Is.defaultFontSize(size);
          const current = () => state.current.fontSize;
          btn
            .label(`fontSize: ${size} ${isDefault ? '(default)' : ''}`.trim())
            .right(() => (current() === size ? '←' : ''))
            .onClick(() => state.change((d) => (d.fontSize = size)));
        });
      };
      fontSize(12);
      fontSize(DEFAULTS.props.fontSize);
      fontSize(22);
      fontSize(46);
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const state = State.debug;
        const current = () => !!state.current.fixedWidth;
        btn
          .label(() => `fixedWidth`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d, 'fixedWidth')));
      });

      dev.boolean((btn) => {
        const state = State.debug;
        const current = () => !!state.current.prefixSelf;
        btn
          .label(() => `prefixSelf`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d, 'prefixSelf')));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<D>(e);
    dev.footer.border(-0.1).render<D>((e) => {
      const props = Props.current;
      const data = { props };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
