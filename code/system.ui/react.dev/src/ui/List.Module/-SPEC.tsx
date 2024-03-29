import { DEFAULTS, ModuleList } from '.';
import { Pkg, Spec, type t } from '../../test.ui';

export default Spec.describe('ModuleList', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);

    ctx.debug.width(0);
    ctx.subject
      .size('fill', 100)
      .backgroundColor(1)
      .render(async (e) => {
        const { SampleSpecs, ModuleSpecs } = await import('../../test.ui/entry.Specs.mjs');

        const fn = () => import('../../test.ui/sample.specs/-SPEC.MySample');
        const specs = {
          ...SampleSpecs,
          ...ModuleSpecs,
          foo: fn,
        };

        const NUMBERS = ['one', 'two', 'three', 'four'];
        const add = (key: string) => ((specs as t.SpecImports)[key] = fn);
        const addSamples = (prefix: string) => NUMBERS.forEach((num) => add(`${prefix}.${num}`));

        addSamples('foo.bar');
        addSamples('foo.baz');
        add('zoo');

        return (
          <ModuleList
            title={Pkg.name}
            version={Pkg.version}
            badge={DEFAULTS.badge}
            imports={specs}
            hrDepth={2}
            scroll={true}
            // filter={'foo'}
            selectedIndex={0}
            onItemVisibility={(e) => console.info('⚡️ onItemVisibility', e)}
            onItemClick={(e) => console.info('⚡️ onItemClick', e)}
            onItemSelect={(e) => console.info('⚡️ onItemSelect', e)}
          />
        );
      });
  });
});
