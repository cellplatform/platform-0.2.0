import { Spec, Pkg } from '../../test.ui';
import { SpecList } from '.';

export default Spec.describe('SpecList', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);

    ctx.component
      .size('fill')
      .display('grid')
      .backgroundColor(1)
      .render(async (e) => {
        const { SampleSpecs, ModuleSpecs } = await import('../../test.ui/entry.Specs.mjs');
        const specs = { ...SampleSpecs, ...ModuleSpecs };
        return <SpecList title={Pkg.name} version={Pkg.version} imports={specs} />;
      });
  });
});
