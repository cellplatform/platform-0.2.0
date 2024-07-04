import { DEFAULTS } from '.';
import { Dev, Immutable, Pkg, Time, css } from '../../test.ui';
import { CmdBar } from '../CmdBar';
import { SampleMain } from './-SPEC.ui.Main';
import { type t } from './common';

type P = t.CmdBarStatefulProps;
type T = { props: P; debug: { useState?: boolean } };
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, (e) => {
  type LocalStore = T['debug'] & Pick<P, 'theme' | 'enabled' | 'focusOnReady' | 'useKeyboard'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    enabled: true,
    focusOnReady: true,
    useState: true,
    useKeyboard: DEFAULTS.useKeyboard,
  });

  const cmdbar = CmdBar.Ctrl.create();
  const doc = Immutable.clonerRef({});

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.theme = local.theme;
      d.props.enabled = local.enabled;
      d.props.focusOnReady = local.focusOnReady;
      d.props.useKeyboard = local.useKeyboard;
      d.debug.useState = local.useState;
    });

    ctx.debug.width(330);
    ctx.subject
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const { props, debug } = e.state;
        const theme = props.theme;
        Dev.Theme.background(dev, theme, 1);

        const mainSize = [180, 110] as [number, number];
        const styles = {
          base: css({ position: 'relative' }),
          main: css({ Absolute: [0 - mainSize[1] - 50, 0, null, 0] }),
          label: css({
            Absolute: [-17, 5, null, null],
            fontFamily: 'monospace',
            fontSize: 10,
            opacity: 0.3,
          }),
        };

        const elCmdBar = (
          <CmdBar.Stateful
            {...props}
            cmd={cmdbar.cmd}
            state={debug.useState ? doc : undefined}
            onReady={(e) => {
              console.info('⚡️ CmdBar.Stateful.onReady:', e);
            }}
          />
        );

        return (
          <div {...styles.base}>
            <SampleMain theme={theme} style={styles.main} size={mainSize} cmdbar={cmdbar} />
            <div {...styles.label}>{'cmdbar'}</div>
            {elCmdBar}
          </div>
        );
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
        const value = (state: T) => !!state.props.useKeyboard;
        btn
          .label((e) => `useKeyboard`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'useKeyboard')));
      });
    });

    dev.hr(5, 20);

    dev.section('Controls', (dev) => {
      const focus = (select?: boolean) => {
        const invoke = () => Time.delay(0, () => cmdbar.focus({ select }));
        dev.button(['cmd: Focus', select ? 'select' : ''], () => invoke());
      };
      focus(true);
      focus(false);
      dev.hr(-1, 5);
      dev.button('cmd: Invoke', (e) => {
        // const text = state.current.props.text ?? '';
        const text = 'TMP'; // TEMP 🐷
        ctrl.invoke({ text });
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const value = (state: T) => !!state.debug.useState;
        btn
          .label((e) => `state${value(e.state) ? '' : ': undefined'}`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.useState = Dev.toggle(d.debug, 'useState'))));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const { debug } = e.state;
      const doc = debug.useState ? doc : undefined;
      const data = {
        ...e.state,
        'state(immutable)': doc,
      };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
