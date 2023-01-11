import { Measure } from '.';
import { Dev, t } from '../../test.ui';

type T = {
  props?: t.MeasureSizeProps;
  size?: t.Size;
};
const initial: T = {};

export default Dev.describe('MeasureSize', (e) => {
  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.ctx.state<T>(initial);

    dev.ctx.debug.footer
      .border(-0.1)
      .render<T>((e) => <Dev.ObjectView name={'result'} data={e.state} expand={5} />);

    const measure = async (props: t.MeasureSizeProps) => {
      const size = await Measure.size(props);
      state.change((data) => {
        data.size = size;
        data.props = { ...props };
      });
    };

    dev.button('measure: hello', (e) => measure({ content: 'hello' }));
    dev.button('measure: hello (big)', (e) => measure({ content: 'hello', fontSize: 90 }));
    dev.hr();
  });
});
