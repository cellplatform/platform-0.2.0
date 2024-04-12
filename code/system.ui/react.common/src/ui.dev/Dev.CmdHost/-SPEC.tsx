import { CmdHost, DEFAULTS } from '.';
import { Dev, Pkg, type t } from '../../test.ui';

const fn = () => import('../DevTools/-SPEC');

const specs: t.SpecImports = {
  foo: fn,
  foobar: fn,
};

const NUMBERS = ['one', 'two', 'three', 'four'];
const add = (key: string) => ((specs as t.SpecImports)[key] = fn);
const addSamples = (prefix: string) => NUMBERS.forEach((num) => add(`${prefix}.${num}`));
addSamples('foo.bar');
addSamples('foo.baz');
addSamples('boo.cat');
add('zoo');

type T = {
  props: t.CmdHostStatefulProps;
  debug: { stateful?: boolean; useOnItemClick?: boolean };
};

const badge = CmdHost.DEFAULTS.badge;
const initial: T = { props: { pkg: Pkg }, debug: {} };

const name = 'CmdHost';
export default Dev.describe(name, (e) => {
  type LocalStore = Pick<
    t.CmdHostStatefulProps,
    | 'theme'
    | 'hrDepth'
    | 'mutateUrl'
    | 'showParamDev'
    | 'autoGrabFocus'
    | 'focusOnReady'
    | 'enabled'
  > &
    Pick<T['debug'], 'stateful' | 'useOnItemClick'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    enabled: true,
    hrDepth: 2,
    mutateUrl: true,
    showParamDev: true,
    stateful: true,
    useOnItemClick: true,
    autoGrabFocus: DEFAULTS.autoGrabFocus,
    focusOnReady: DEFAULTS.focusOnReady,
  });

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.theme = local.theme;
      d.props.enabled = local.enabled;
      d.props.badge = badge;
      d.props.specs = specs;
      d.props.hrDepth = local.hrDepth;
      d.props.mutateUrl = local.mutateUrl;
      d.props.showParamDev = local.showParamDev;
      d.props.autoGrabFocus = local.autoGrabFocus;
      d.props.focusOnReady = local.focusOnReady;

      d.debug.stateful = local.stateful;
      d.debug.useOnItemClick = local.useOnItemClick;
    });

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .backgroundColor(1)
      .render<T>((e) => {
        const { props, debug } = e.state;
        Dev.Theme.background(ctx, props.theme, 1, 0.02);

        const Component = debug.stateful ? CmdHost.Stateful : CmdHost;
        const onItemClick: t.ModuleListItemHandler = (e) => console.info('⚡️ onItemClick', e);
        return (
          <Component
            {...e.state.props}
            onReady={(e) => console.info('⚡️ onReady', e)}
            onChanged={(e) => state.change((d) => (d.props.command = e.command))}
            onItemSelect={(e) => console.info('⚡️ onItemSelect', e)}
            onItemClick={!debug.useOnItemClick ? undefined : onItemClick}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.enabled;
        btn
          .label((e) => `enabled`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.enabled = Dev.toggle(d.props, 'enabled'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.mutateUrl;
        btn
          .label((e) => `mutateUrl`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.mutateUrl = Dev.toggle(d.props, 'mutateUrl'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.showParamDev;
        btn
          .label((e) => `showParamDev`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => (local.showParamDev = Dev.toggle(d.props, 'showParamDev'))),
          );
      });

      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.autoGrabFocus;
        btn
          .label((e) => `autoGrabFocus`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => (local.autoGrabFocus = Dev.toggle(d.props, 'autoGrabFocus'))),
          );
      });

      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.focusOnReady;
        btn
          .label((e) => `focusOnReady`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => (local.focusOnReady = Dev.toggle(d.props, 'focusOnReady'))),
          );
      });

      dev.hr(-1, 5);

      const depth = (value?: number) => {
        dev.button((btn) =>
          btn
            .label(`hrDepth: ${value ?? '(undefined)'}`)
            .right((e) => (e.state.props.hrDepth === value ? '←' : ''))
            .onClick((e) => e.change((d) => (local.hrDepth = d.props.hrDepth = value))),
        );
      };
      [undefined, 2, 3].forEach((value) => depth(value));

      dev.hr(-1, 5);
      Dev.Theme.switcher(
        dev,
        (d) => d.props.theme,
        (d, value) => (local.theme = d.props.theme = value),
      );
    });

    dev.hr(5, 20);

    dev.button(['command → ""', '(clear)'], (e) => {
      e.change((d) => (d.props.command = ''));
    });
    dev.button('command → "foobar"', (e) => {
      e.change((d) => (d.props.command = 'foobar'));
    });
    dev.hr(-1, 5);
    dev.button('selectedIndex → 0', (e) => {
      e.change((d) => (d.props.selectedIndex = 0));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.stateful);
        btn
          .label((e) => `${value(e.state) ? 'stateful' : 'stateless'} component`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.stateful = Dev.toggle(d.debug, 'stateful'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.useOnItemClick);
        btn
          .label((e) => `onItemClick: ${value(e.state) ? 'ƒ' : '(undefined)'}`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.useOnItemClick = Dev.toggle(d.debug, 'useOnItemClick')));
          });
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
