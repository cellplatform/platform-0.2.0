import { t } from './common';
import { Def } from './TestSuiteModel.mjs';
import { Is } from '../TestSuite.helpers';

const describe = Def.variants();

/**
 * Bundle together a suite of tests from different ES modules,
 * either statically or dynamically imported.
 */
export async function bundle(...args: any[]) {
  type B = t.TestSuiteModel | Promise<any>;

  const param1 = args[0];
  const param2 = typeof param1 === 'string' ? args[1] : param1;
  const items: B[] = Array.isArray(param2) ? param2 : [param2];

  const wait = items.map(async (item) => {
    const module = Is.promise(item) ? (await item).default : item;
    return Is.suite(module) ? (module as t.TestSuiteModel) : undefined;
  });

  const suites = (await Promise.all(wait)).filter(Boolean) as t.TestSuiteModel[];
  const name = typeof param1 === 'string' ? param1 : Wrangle.rootName(suites);

  if (suites.length === 1) {
    // Single suite only.
    const root = suites[0];
    root.state.description = name; // NB: Ensure any explicit name passed to bundle is used on the singlular root.
    return root;
  } else {
    // Multiple suites.
    const root = describe(name);
    return root.merge(...suites);
  }
}

/**
 * [Helpers]
 */

const Wrangle = {
  rootName(suites: t.TestSuiteModel[]) {
    return suites.length === 1 ? suites[0].state.description : 'Tests';
  },
};
