import { SpecList } from '.';
import { css, Pkg, Spec } from '../../test.ui';

const ci = {
  badge: 'https://github.com/cellplatform/platform-0.2.0/actions/workflows/node.esm.yml/badge.svg',
  info: 'https://github.com/cellplatform/platform-0.2.0/actions/workflows/node.esm.yml',
};

export default Spec.describe('SpecList', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);

    ctx.subject
      .size('fill')
      .backgroundColor(1)
      .render(async (e) => {
        const { SampleSpecs, ModuleSpecs } = await import('../../test.ui/entry.Specs.mjs');

        const fn = () => import('../../test.ui/sample.specs/MySample.SPEC');
        const specs = {
          ...SampleSpecs,
          ...ModuleSpecs,
          foo: fn,
        };

        const NUMBERS = ['one', 'two', 'three', 'four'];
        const addSamples = (prefix: string) => {
          NUMBERS.forEach((num) => {
            const key = `${prefix}.${num}`;
            (specs as any)[key] = fn;
          });
        };

        addSamples('foo.bar');
        addSamples('foo.baz');

        return (
          <SpecList
            title={Pkg.name}
            version={Pkg.version}
            imports={specs}
            hrDepth={2}
            scroll={true}
            // filter={'foo'}
            selectedIndex={0}
            badge={{
              image: ci.badge,
              href: ci.info,
            }}
            onChildVisibility={(e) => {
              console.info('⚡️ onChildVisibility', e);
            }}
          />
        );
      });
  });
});
