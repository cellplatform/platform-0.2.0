import { ModuleHost } from '.';
import { Dev, Pkg, type t } from '../../test.ui';

const fn = () => import('./-SPEC');

const specs: t.ModuleImports<unknown> = {
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
  props: t.ModuleHostStatefulProps<unknown>;
  debug: { stateful?: boolean; useOnItemClick?: boolean };
};

const badge = ModuleHost.DEFAULTS.badge;
const initial: T = { props: { pkg: Pkg }, debug: {} };

const name = 'ModuleHost';

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<t.ModuleHostStatefulProps, 'hrDepth' | 'mutateUrl' | 'showParamDev'> &
    Pick<T['debug'], 'stateful' | 'useOnItemClick'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    hrDepth: 2,
    mutateUrl: false,
    showParamDev: true,
    stateful: true,
    useOnItemClick: true,
  });

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.badge = badge;
      d.props.specs = specs;

      d.props.hrDepth = local.hrDepth;
      d.props.mutateUrl = local.mutateUrl;
      d.props.showParamDev = local.showParamDev;
      d.debug.stateful = local.stateful;
      d.debug.useOnItemClick = local.useOnItemClick;
    });

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .backgroundColor(1)
      .render<T>((e) => {
        const debug = e.state.debug;

        const Component = debug.stateful ? ModuleHost.Stateful : ModuleHost;
        const props = debug.stateful
          ? (e.state.props as t.ModuleHostStatefulProps)
          : (e.state.props as t.ModuleHostProps);

        return (
          <Component
            {...props}
            onChanged={(e) => state.change((d) => (d.props.command = e.command))}
            onItemSelect={(e) => console.info('⚡️ onItemSelect', e)}
            onItemClick={
              !debug.useOnItemClick
                ? undefined
                : (e) => {
                    console.info('⚡️ onItemClick', e);
                  }
            }
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.mutateUrl);
        btn
          .label((e) => `mutateUrl`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.mutateUrl = Dev.toggle(d.props, 'mutateUrl'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.showParamDev);
        btn
          .label((e) => `showParamDev`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => (local.showParamDev = Dev.toggle(d.props, 'showParamDev'))),
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
      dev.button('command → (empty)', (e) => {
        e.change((d) => (d.props.command = ''));
      });
      dev.button('command → "foobar"', (e) => {
        e.change((d) => (d.props.command = 'foobar'));
      });
      dev.hr(-1, 5);
      dev.button('selectedIndex → 0', (e) => {
        e.change((d) => (d.props.selectedIndex = 0));
      });
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
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
