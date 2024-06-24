import { Dev, type t } from '../../test.ui';

/**
 * TODO 🐷
 * Polish into principled DSL.
 */

export const DSL = {
  find(specs: t.SpecImports, includes: string) {
    return Dev.find(specs, (k) => k.toLowerCase().includes(includes.toLowerCase()));
  },

  findAndRender(specs: t.SpecImports, includes: string, options: { silent?: boolean } = {}) {
    const { silent = true } = options;
    const { spec } = DSL.find(specs, includes);
    const el = spec ? <Dev.Harness spec={spec} style={{ Absolute: 0 }} /> : undefined;
    if (!silent) {
      console.log('specs', specs);
      console.info(`render: "${includes}":el:`, el);
    }
    return el;
  },
} as const;
