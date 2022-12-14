import { t } from './common';
import { Def } from './TestSuiteModel.mjs';
import { Is } from '../TestSuite.helpers';
import { bundle } from './Test.bundle.mjs';

const describe = Def.variants();

/**
 * Entry point to the unit-testing system.
 */
export const Test: t.Test = {
  Is,
  describe,
  bundle,

  /**
   * Bundle and run a set of tests.
   */
  async run(...args: any[]) {
    const bundle = await Test.bundle.apply(null, args as any);
    return bundle.run();
  },
};
