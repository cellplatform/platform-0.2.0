import { Spec } from '../../test.ui';
import { MonacoEditor } from '.';

export default Spec.describe('MonacoEditor', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.component
      .size('fill')
      .display('flex')
      .render(() => <MonacoEditor focusOnLoad={true} style={{ flex: 1 }} />);
  });
});
