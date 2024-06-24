import { CmdBar, DEFAULTS } from '.';
import { Color, Dev, DevIcons, Pkg, css, type t, Time } from '../../test.ui';

type TEnv = {};
type P = t.CmdBarProps;
type T = { props: P };
const initial: T = { props: {} };

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, (e) => {
  type LocalStore = Pick<
    P,
    'enabled' | 'focusOnReady' | 'placeholder' | 'hintKey' | 'text' | 'theme'
  >;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    enabled: true,
    focusOnReady: true,
    placeholder: DEFAULTS.commandPlaceholder,
    hintKey: undefined,
    text: undefined,
  });

  const control = CmdBar.control();

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.theme = local.theme;
      d.props.focusOnReady = local.focusOnReady;
      d.props.enabled = local.enabled;
      d.props.placeholder = local.placeholder;
      d.props.hintKey = local.hintKey;
      d.props.text = local.text;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const { props } = e.state;
        Dev.Theme.background(dev, props.theme);
        return (
          <CmdBar
            {...props}
            control={control.cmd}
            onChange={(e) => state.change((d) => (local.text = d.props.text = e.to))}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

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
    });

    dev.hr(5, 20);

    dev.section('Common States', (dev) => {
      dev.button(['hint key', '↑ ↓ ⌘K'], (e) => {
        e.change((d) => (local.hintKey = d.props.hintKey = ['↑', '↓', '⌘K']));
      });
      dev.button('placholder: "namespace"', (e) => {
        e.change((d) => (local.placeholder = d.props.placeholder = 'namespace'));
      });
      dev.hr(-1, 5);

      const Sample = (props: { width?: number } = {}) => {
        const { width = 30 } = props;
        const styles = {
          base: css({ backgroundColor: 'rgba(255, 0, 0, 0.1)', PaddingX: 10 }),
          grid: css({ display: 'grid', placeItems: 'center' }),
          size: css({ width, transition: `width 300ms ease` }),
        };
        return (
          <div {...css(styles.base, styles.grid, styles.size)}>
            <DevIcons.ObjectTree size={22} color={Color.WHITE} />
          </div>
        );
      };

      const prefix = (el: JSX.Element) => state.change((d) => (d.props.prefix = el));
      const suffix = (el: JSX.Element) => state.change((d) => (d.props.suffix = el));

      dev.button('element: prefix', (e) => prefix(<Sample />));
      dev.button(['element: prefix', '(wide)'], (e) => prefix(<Sample width={250} />));
      dev.hr(-1, 5);
      dev.button('element: suffix', (e) => suffix(<Sample />));
      dev.button(['element: suffix', '(wide)'], (e) => suffix(<Sample width={250} />));

      dev.hr(-1, 5);
      dev.button(['reset', '(defaults)'], (e) => {
        e.change((d) => {
          const p = d.props;
          p.hintKey = undefined;
          p.prefix = undefined;
          p.suffix = undefined;
          local.enabled = p.enabled = DEFAULTS.enabled;
          local.focusOnReady = p.focusOnReady = DEFAULTS.focusOnReady;
          local.placeholder = p.placeholder = DEFAULTS.commandPlaceholder;
        });
      });
    });

    dev.hr(5, 20);

    dev.section(['Controls', 'Cmd'], (dev) => {
      const focus = (select?: boolean) => {
        dev.button(['focus', select ? 'select' : ''], (e) => {
          Time.delay(0, () => control.focus({ select }));
        });
      };
      focus(true);
      focus(false);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
