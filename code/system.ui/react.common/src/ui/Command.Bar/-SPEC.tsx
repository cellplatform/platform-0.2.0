import { CommandBar, DEFAULTS } from '.';
import { Dev, Pkg, type t } from '../../test.ui';

type T = { props: t.CommandBarProps };
const initial: T = { props: {} };

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, (e) => {
  type LocalStore = Pick<
    t.CommandBarProps,
    'enabled' | 'focusOnReady' | 'placeholder' | 'hintKey' | 'text'
  >;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    enabled: true,
    focusOnReady: true,
    placeholder: DEFAULTS.commandPlaceholder,
    hintKey: undefined,
    text: undefined,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      const p = d.props;
      p.focusOnReady = local.focusOnReady;
      p.enabled = local.enabled;
      p.placeholder = local.placeholder;
      p.hintKey = local.hintKey;
      p.text = local.text;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        return (
          <CommandBar
            {...e.state.props}
            onChanged={(e) => state.change((d) => (local.text = d.props.text = e.to))}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
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
      dev.button('hint key: ↑ ↓ ⌘K', (e) => {
        e.change((d) => (local.hintKey = d.props.hintKey = ['↑', '↓', '⌘K']));
      });
      dev.button('placholder: "namespace"', (e) => {
        e.change((d) => (local.placeholder = d.props.placeholder = 'namespace'));
      });

      dev.hr(-1, 5);
      dev.button(['reset', '(defaults)'], (e) => {
        e.change((d) => {
          const p = d.props;
          p.hintKey = undefined;
          local.enabled = p.enabled = DEFAULTS.enabled;
          local.focusOnReady = p.focusOnReady = DEFAULTS.focusOnReady;
          local.placeholder = p.placeholder = DEFAULTS.commandPlaceholder;
        });
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
