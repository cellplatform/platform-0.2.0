import { Dev, Pkg, type t } from '../../test.ui';
import { Sample, type SampleProps } from './ui';

type TEnv = { stream?: MediaStream };
type T = { props: SampleProps };
const initial: T = { props: {} };

/**
 * Spec
 * https://www.youtube.com/watch?v=CVClHLwv-4I
 * https://github.com/justadudewhohacks/face-api.js
 */
const name = 'Sample.01';
export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const env = dev.ctx.env ? (dev.ctx.env as TEnv) : undefined;

    const state = await ctx.state<T>(initial);
    await state.change(async (d) => {
      d.props.stream = env?.stream ?? (await navigator.mediaDevices.getUserMedia({ video: {} }));
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <Sample {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);
    dev.TODO();
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
