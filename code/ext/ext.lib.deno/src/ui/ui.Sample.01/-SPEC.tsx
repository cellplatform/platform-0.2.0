import { Dev, Pkg } from '../../test.ui';
import { Sample } from './ui';
import { type t } from './common';
import { Info } from '../ui.Info';
import { SAMPLE } from './-SPEC.sample';

type T = { props: t.SampleProps; debug: {} };
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = 'Sample.01';
export default Dev.describe(name, (e) => {
  type LocalStore = Pick<t.SampleProps, 'code'> & T['debug'];
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  ('⚡️💦🐷🌳 🍌🧨🌼✨🧫 🐚👋🧠⚠️💥👁️ ↑↓←→');
  const local = localstore.object({
    code: SAMPLE.code,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.code = local.code;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return (
          <Sample
            {...e.state.props}
            onChange={async (e) => {
              local.code = e.text;
              await state.change((d) => (d.props.code = e.text));
              // dev.redraw('debug');
            }}
            onCmdEnterKey={(e) => {
              console.info('⚡️ onCmdEnterKey', e);
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);

    dev.row((e) => {
      return (
        <Info
          //
          fields={['Component']}
          data={{ component: { label: 'Management Interface', name: 'Deno Subhosting' } }}
        />
      );
    });

    dev.hr(5, 20);

    link
      .title('References')
      .ns('docs: deno → subhosting', 'https://github.com/denoland/subhosting_ide_starter')
      .hr()
      .ns('tutorial (video)', 'https://github.com/denoland/subhosting_ide_starter')
      .ns('tutorial (sample repo)', 'https://github.com/denoland/subhosting_ide_starter');

    dev.hr(5, 20);

    dev.section('Common States', (dev) => {
      dev.button('set sample: "code"', (e) => {
        e.change((d) => (local.code = d.props.code = SAMPLE.code));
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
