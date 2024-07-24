import { CmdBar, DEFAULTS } from '.';
import { Color, css, Dev, DevIcons, Pkg, Time, type t } from '../../test.ui';
import { Ctrl } from '../CmdBar.Ctrl';

type P = t.CmdBarProps;
type T = {
  props: P;
  parsedArgs?: t.ParsedArgs;
  debug: { focusBorder?: boolean };
};
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, (e) => {
  type LocalStore = Pick<T['debug'], 'focusBorder'> &
    Pick<P, 'enabled' | 'focusOnReady' | 'placeholder' | 'hintKey' | 'text' | 'theme'>;

  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    enabled: true,
    focusOnReady: DEFAULTS.focusOnReady,
    focusBorder: true,
    placeholder: DEFAULTS.commandPlaceholder,
    hintKey: undefined,
    text: undefined,
  });

  const cmdbar = CmdBar.Ctrl.create();

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.text = local.text;
      d.props.theme = local.theme;
      d.props.focusOnReady = local.focusOnReady;
      d.props.enabled = local.enabled;
      d.props.placeholder = local.placeholder;
      d.props.hintKey = local.hintKey;

      d.debug.focusBorder = local.focusBorder;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const { props, debug } = e.state;
        Dev.Theme.background(dev, props.theme, 1);

        return (
          <CmdBar
            {...props}
            cmd={Ctrl.toCmd(cmdbar)}
            focusBorder={debug.focusBorder}
            onReady={(e) => console.info('⚡️ CmdBar.onReady:', e)}
            onChange={(e) => {
              console.info(`⚡️ CmdBar.onChange:`, e);
              state.change((d) => {
                local.text = d.props.text = e.to;
                d.parsedArgs = e.parsed;
              });
            }}
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
      dev.boolean((btn) => {
        const value = (state: T) => !!state.debug.focusBorder;
        btn
          .label((e) => `focusBorder`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.focusBorder = Dev.toggle(d.debug, 'focusBorder')));
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

    dev.section('Command', (dev) => {
      const focus = (target: t.CmdBarFocusTarget) => Time.delay(0, () => cmdbar.focus({ target }));
      const focusButton = (target: t.CmdBarFocusTarget) => {
        dev.button(['focus', `"${target}"`], () => focus(target));
      };
      focusButton('CmdBar');
      focusButton('Main');
      dev.hr(-1, 5);
      dev.button('current', async (e) => {
        const res = await cmdbar.current({}).promise();
        console.info('result:', res.result);
      });
      dev.button('clear', () => cmdbar.clear({}));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const { props, parsedArgs } = e.state;
      const data = {
        props,
        parsedArgs,
      };
      return (
        <Dev.Object name={name} data={data} expand={{ level: 1, paths: ['$', '$.parsedArgs'] }} />
      );
    });
  });
});
