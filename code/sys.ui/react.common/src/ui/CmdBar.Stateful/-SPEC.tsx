import { DEFAULTS } from '.';
import { Args, COLORS, Color, Dev, Immutable, ObjectPath, Pkg, Time, css, rx } from '../../test.ui';
import { CmdBar } from '../CmdBar';
import { type t } from './common';
import { Sample } from './-ui';

type P = t.CmdBarStatefulProps;
type T = {
  props: P;
  debug: { render?: boolean; useState?: boolean; prependPaths?: boolean };
  current: { isFocused?: boolean; argv?: string };
};
const initial: T = { props: {}, debug: {}, current: {} };

/**
 * Spec
 */
const name = DEFAULTS.displayName;

export default Dev.describe(name, (e) => {
  type LocalStore = T['debug'] &
    Pick<P, 'theme' | 'enabled' | 'focusOnReady' | 'focusBorder' | 'useKeyboard' | 'useHistory'> &
    Pick<T['current'], 'argv'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    enabled: true,
    focusOnReady: DEFAULTS.focusOnReady,
    focusBorder: DEFAULTS.focusBorder,
    useKeyboard: DEFAULTS.useKeyboard,
    useHistory: DEFAULTS.useHistory,
    prependPaths: true,
    useState: true,
    argv: undefined,
  });

  const doc = Immutable.clonerRef({});
  let cmdbar: t.CmdBarRef | undefined;

  const getPaths = (state: T): t.CmdBarPaths => {
    return state.debug.prependPaths ? CmdBar.Path.prepend(['foo']) : DEFAULTS.paths;
  };

  const getText = (state: T) => {
    const paths = getPaths(state)!;
    const text = doc ? ObjectPath.resolve<string>(doc.current, paths.text) ?? '' : '';
    return text;
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.theme = local.theme;
      d.props.enabled = local.enabled;
      d.props.focusOnReady = local.focusOnReady;
      d.props.focusBorder = local.focusBorder;
      d.props.useKeyboard = local.useKeyboard;
      d.props.useHistory = local.useHistory;
      d.debug.useState = local.useState;
      d.debug.render = true;
      d.debug.prependPaths = local.prependPaths;
      d.current.argv = local.argv;
    });

    doc.change((d) => {
      const paths = getPaths(state.current);
      ObjectPath.mutate(d, paths.text, local.argv);
    });

    doc
      .events()
      .changed$.pipe(rx.debounceTime(100))
      .subscribe(() => dev.redraw('debug'));

    ctx.debug.width(330);
    ctx.subject
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const { props, debug } = e.state;
        const paths = getPaths(state.current);
        const theme = Color.theme(props.theme);
        Dev.Theme.background(dev, theme, 1);

        if (!debug.render) return null;

        const t = (prop: string, time: t.Msecs = 50) => `${prop} ${time}ms`;
        const transition = [t('opacity'), t('border')].join(', ');
        const isFocused = cmdbar?.current.focused;
        const styles = {
          base: css({ position: 'relative' }),
          label: css({
            Absolute: [-17, 5, null, null],
            fontFamily: 'monospace',
            fontSize: 10,
            opacity: isFocused ? 1 : 0.3,
            transition,
          }),
        };

        const elCmdBar = (
          <Sample
            {...props}
            state={debug.useState ? doc : undefined}
            paths={paths}
            onReady={(e) => {
              const { textbox, dispose$ } = e;
              cmdbar = e.cmdbar;

              console.info('⚡️ CmdBar.Stateful.onReady:', e);
              dispose$.subscribe(() => console.info('⚡️ CmdBar.Stateful.onReady:dispose$ → 💥'));

              // Start data-binding syncer.
              const syncer = CmdBar.Sync.listen(textbox, doc, e.paths.text, { dispose$ });
              state.change((d) => (d.current.argv = e.initial.text));
              syncer.onChange((e) => console.info(`syncer.onChange`, e));

              // Listen for events.
              const events = e.cmdbar.ctrl.events(e.dispose$);
              events.on('Invoke', (e) => console.info(`⚡️ Invoke`, e.params));
            }}
            onFocusChange={(e) => state.change((d) => (d.current.isFocused = e.is.focused))}
            onChange={(e) => state.change((d) => (local.argv = d.current.argv = e.to))}
            onSelect={(e) => console.info(`⚡️ CmdBar.Stateful.onSelect`, e)}
          />
        );

        return (
          <div {...styles.base}>
            <div {...styles.label}>{'cmdbar'}</div>
            {elCmdBar}
          </div>
        );
      });

    /**
     * <Main> sample.
     */
    ctx.host.layer(1).render<T>((e) => {
      const { props, current } = e.state;

      return CmdBar.Dev.Main.render({
        cmdbar,
        argv: current.argv,
        topHalf: true,
        focused: { cmdbar: cmdbar?.current.focused },
        theme: props.theme,
        style: { marginBottom: 40 },
      });
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['props', 'theme'], (next) => (local.theme = next));
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.enabled);
        btn
          .label((e) => `enabled`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.enabled = Dev.toggle(d.props, 'enabled')));
          });
      });
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.focusOnReady);
        btn
          .label((e) => `focusOnReady`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.focusOnReady = Dev.toggle(d.props, 'focusOnReady')));
          });
      });
      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.focusBorder;
        btn
          .label((e) => `focusBorder`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.focusBorder = Dev.toggle(d.props, 'focusBorder')));
          });
      });
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.useKeyboard;
        btn
          .label((e) => `useKeyboard`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.useKeyboard = Dev.toggle(d.props, 'useKeyboard')));
          });
      });

      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.useHistory;
        btn
          .label((e) => `useHistory`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.useHistory = Dev.toggle(d.props, 'useHistory')));
          });
      });
    });

    dev.hr(5, 20);

    dev.section('Command', (dev) => {
      const focus = (target: 'CmdBar' | 'Main') => {
        const invoke = () => Time.delay(0, () => cmdbar?.ctrl.focus({ target }));
        dev.button(['Focus', `"${target}"`], () => invoke());
      };
      focus('CmdBar');
      focus('Main');
      dev.hr(-1, 5);
      dev.button('Invoke', (e) => {
        const text = getText(state.current);
        cmdbar?.ctrl.invoke({ text });
      });
      dev.hr(-1, 5);
      dev.button('Select: All', (e) => cmdbar?.ctrl.select({ scope: 'All' }));
      dev.button('Select: Expand', (e) => cmdbar?.ctrl.select({ scope: 'Expand' }));
      dev.hr(-1, 5);
      dev.button(['CMD + J', 'focus:main'], (e) => cmdbar?.ctrl.keyboard({ name: 'Focus:Main' }));
      dev.button(['CMD + K', 'focus:cmdbar'], (e) =>
        cmdbar?.ctrl.keyboard({ name: 'Focus:CmdBar' }),
      );
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const value = (state: T) => !!state.debug.render;
        btn
          .label((e) => `render`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => Dev.toggle(d.debug, 'render')));
      });

      dev.boolean((btn) => {
        const value = (state: T) => !!state.debug.useState;
        btn
          .label((e) => `state${value(e.state) ? '' : ': undefined'}`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.useState = Dev.toggle(d.debug, 'useState'))));
      });
      dev.boolean((btn) => {
        const value = (state: T) => !!state.debug.prependPaths;
        btn
          .label((e) => (value(e.state) ? `prepend paths` : `prepend paths: (default)`))
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.prependPaths = Dev.toggle(d.debug, 'prependPaths')));
          });
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const { debug } = e.state;
      const field = 'state( ImmutableRef<D> )';
      const data = {
        props: e.state.props,
        [field]: debug.useState ? doc?.current : undefined,
      };
      return (
        <Dev.Object
          name={name}
          data={data}
          expand={{ level: 1, paths: ['$', `$.${field}`] }}
          fontSize={11}
        />
      );
    });
  });
});
