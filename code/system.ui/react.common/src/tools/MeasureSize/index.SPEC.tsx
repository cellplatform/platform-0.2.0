import { Measure } from '.';
import { Dev, t } from '../../test.ui';

type T = { size?: t.Size };
const initial: T = {};

export default Dev.describe('MeasureSize', (e) => {
  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.ctx.state<T>(initial);

    dev.ctx.debug.footer
      .border(-0.1)
      .render<T>((e) => <Dev.ObjectView name={'state'} data={e.state} expand={5} />);

    const measure = async (props: t.MeasureSizeProps) => {
      const size = await Measure.size(props);
      state.change((d) => (d.size = size));
    };

    dev.button('measure: hello', (e) => measure({ content: 'hello' }));
    dev.button('measure: hello (big)', (e) => measure({ content: 'hello', fontSize: 50 }));
    dev.hr();
  });
});
