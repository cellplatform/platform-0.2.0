import { Spec, Dev } from '../../test.ui';
import { Harness } from '.';

export default Spec.describe('Harness', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);

    const bundle = import('../../test.ui/sample.specs/MySample.SPEC');

    ctx.component
      .size('fill')
      .display('flex')
      .render((e) => {
        return <Harness style={{ flex: 1 }} spec={bundle} />;
      });
  });
});
