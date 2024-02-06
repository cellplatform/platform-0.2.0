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

type T = { props: t.CmdHostStatefulProps };

const badge = CmdHost.DEFAULTS.badge;
const initial: T = { props: { pkg: Pkg } };

export default Dev.describe('CmdHost', (e) => {
  type LocalStore = Pick<t.CmdHostStatefulProps, 'hrDepth' | 'mutateUrl'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    hrDepth: 2,
    mutateUrl: true,
  });

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.hrDepth = local.hrDepth;
      d.props.mutateUrl = local.mutateUrl;
      d.props.badge = badge;
      d.props.specs = specs;
    });

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .backgroundColor(1)
      .render<T>((e) => {
        return (
          <CmdHost.Stateful
            {...e.state.props}
            onChanged={(e) => state.change((d) => (d.props.command = e.command))}
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
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('tmp', (e) => {
        e.change((d) => (d.props.command = 'foobar'));
      });
    });
  });
});
