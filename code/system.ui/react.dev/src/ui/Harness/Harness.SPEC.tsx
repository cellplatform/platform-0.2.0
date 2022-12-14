import { Spec, Dev } from '../../test.ui';
import { Harness } from '.';

export default Spec.describe('Harness', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);

    const bundle = import('../../test.sample/ui/MySample.SPEC');

    const el = <Harness style={{ flex: 1 }} spec={bundle} />;

    // const { Dev } = await import('../index.mjs');
    // const el = await Dev.render(Pkg, Specs);

    ctx.component.size('fill').display('flex').render(el);
  });
});
