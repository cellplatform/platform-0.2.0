import { CmdHost } from '.';
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

export default Dev.describe('CmdHost', (e) => {
  type LocalStore = Pick<t.CmdHostStatefulProps, 'hrDepth' | 'mutateUrl' | 'showDevParam'> &
    Pick<T['debug'], 'stateful' | 'useOnItemClick'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    hrDepth: 2,
    mutateUrl: true,
    showDevParam: true,
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
      d.props.showDevParam = local.showDevParam;
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
        const Component = debug.stateful ? CmdHost.Stateful : CmdHost;

        return (
          <Component
            {...e.state.props}
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
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'Dev.CmdHost'} data={e.state} expand={1} />);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.mutateUrl);
        btn
          .label((e) => `mutateUrl`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.mutateUrl = Dev.toggle(d.props, 'mutateUrl'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.showDevParam);
        btn
          .label((e) => `showDevParam`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => (local.showDevParam = Dev.toggle(d.props, 'showDevParam'))),
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
});
