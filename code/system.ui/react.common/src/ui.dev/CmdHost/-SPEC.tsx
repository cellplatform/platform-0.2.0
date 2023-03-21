import { t, Dev } from '../../test.ui';
import { CmdHostStateful } from '.';
import { Pkg } from '../../index.pkg.mjs';

import type { CmdHostProps } from '.';

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
add('zoo');

type T = { props: CmdHostProps };
const initial: T = { props: { pkg: Pkg, specs, hrDepth: 2 } };

export default Dev.describe('CmdHost', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.subject
      .size('fill')
      .display('grid')
      .backgroundColor(1)
      .render<T>((e) => {
        return (
          <CmdHostStateful
            {...e.state.props}
            onChanged={(e) => state.change((d) => (d.props.filter = e.command))}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'CmdHost'} data={e.state} expand={1} />);

    dev.section('hrDepth', (dev) => {
      const depth = (value?: number) => {
        dev.button((btn) =>
          btn
            .label(`${value ?? '(undefined)'}`)
            .right((e) => (e.state.props.hrDepth === value ? '←' : ''))
            .onClick((e) => e.change((d) => (d.props.hrDepth = value))),
        );
      };
      [undefined, 2, 3].forEach((value) => depth(value));
    });

    dev.hr(-1, 5);
  });
});
