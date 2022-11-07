import { Is, t } from './common';
import { Def } from './TestSuiteModel';

/**
 * Entry point to the unit-testing system.
 */
export const Test: t.Test = {
  describe: Def.variants(),

  /**
   * Bundle together a suite of tests from different ES modules,
   * either statically or dynamically imported.
   */
  async bundle(...args: any[]) {
    type B = t.TestSuiteModel | Promise<any>;

    const param1 = args[0];
    const param2 = typeof param1 === 'string' ? args[1] : param1;
    const items: B[] = Array.isArray(param2) ? param2 : [param2];

    const wait = items.map(async (item) => {
      const module = Is.promise(item) ? (await item).default : item;
      return Is.suite(module) ? (module as t.TestSuiteModel) : undefined;
    });

    const suites = (await Promise.all(wait)).filter(Boolean) as t.TestSuiteModel[];
    const name = typeof param1 === 'string' ? param1 : wrangleRootName(suites);

    if (suites.length === 1) {
      // Single suite only.
      const root = suites[0];
      root.state.description = name; // NB: Ensure any explicit name passed to bundle are used on the singlular root.
      return root;
    } else {
      // Multiple suites.
      const root = Test.describe(name);
      return root.merge(...suites);
    }
  },

  /**
   * Bundle and run a set of tests.
   */
  async run(...args: any[]) {
    const bundle = await Test.bundle.apply(null, args as any);
    return bundle.run();
  },
};

/**
 * Helpers
 */

function wrangleRootName(suites: t.TestSuiteModel[]) {
  return suites.length === 1 ? suites[0].state.description : 'Tests';
}
