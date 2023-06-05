import { type t } from './common';
import { Is } from './Is.mjs';

type TResult = { suite: t.TestSuiteModel; isDefault: boolean };

/**
 * Helpers for loading test suite modules.
 */
export const Loader = {
  /**
   * Import test suites from a variety of input types
   */
  async import(
    input: t.BundleImport | t.BundleImport[],
    options: { init?: boolean } = {},
  ): Promise<TResult[]> {
    type TImport = t.TestSuiteModel | Promise<any>;
    const list: TImport[] = Array.isArray(input) ? input : [input];

    const res: TResult[] = [];
    const push = (suite: t.TestSuiteModel, isDefault: boolean) => {
      const exists = res.find((item) => item.suite === suite);
      if (!exists) res.push({ suite, isDefault });
    };

    const load = async (item: TImport) => {
      const module = Is.promise(item) ? await item : item;
      if (module === null || typeof module !== 'object') return;
      if (Is.suite(item)) return push(item, false);
      Object.keys(module).forEach((key) => {
        const suite = module[key];
        const isDefault = key === 'default';
        if (Is.suite(suite)) push(suite, isDefault);
      });
    };

    await Promise.all(list.map(load));
    if (options.init) await Promise.all(res.map((item) => item.suite.init()));
    return res;
  },
};
