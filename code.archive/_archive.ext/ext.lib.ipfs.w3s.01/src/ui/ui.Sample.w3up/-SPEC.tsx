import { Dev } from '../../test.ui';
import { sampleBasicUsage } from './-SPEC.sample.BasicUsage';

type T = {};
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample.w3up';

export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        return <div style={{ padding: 8 }}>{`🐷 ${'Sample'}`}</div>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('debug', (dev) => {
      dev.button((btn) => {
        const github = 'https://github.com/web3-storage/w3up/tree/main/packages/w3up-client';
        btn
          .label(`basic usage`)
          .right((e) => (
            <a href={github} target={'_blank'}>
              {'github (pre-release)'}
            </a>
          ))
          .enabled((e) => true)
          .onClick(sampleBasicUsage);
      });
    });

    dev.hr(0, 5);
    dev.TODO();
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
