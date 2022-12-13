import { DEFAULT, slug, t, Time } from './common.mjs';
import { Constraints } from './helpers/Constraints.mjs';
import { TestModel } from './TestModel.mjs';

type LazyParent = () => t.TestSuiteModel;

export const Def = {
  describe(modifier?: t.TestModifier, getParent?: LazyParent): t.TestSuiteDescribeDef {
    return (description, handler) => {
      const parent = getParent?.();
      const child = TestSuiteModel({ parent, description, handler, modifier });
      if (parent) parent.state.children = [...parent.state.children, child];
      return child;
    };
  },

  variants(getParent?: LazyParent): t.TestSuiteDescribe {
    const describe = Def.describe(undefined, getParent);
    (describe as any).skip = Def.describe('skip', getParent);
    (describe as any).only = Def.describe('only', getParent);
    return describe as t.TestSuiteDescribe;
  },
};

/**
 * A test suite model.
 */
export const TestSuiteModel = (args: {
  parent?: t.TestSuiteModel;
  description: string;
  handler?: t.TestSuiteHandler;
  modifier?: t.TestModifier;
}): t.TestSuiteModel => {
  const { parent, description } = args;
  const id = `TestSuite.${slug()}`;

  const init = async (suite: t.TestSuiteModel) => {
    const state = suite.state;
    if (!state.ready) {
      state.ready = true;
      await state.handler?.(suite);
      await Promise.all(state.children.map((child) => init(child))); // <== RECURSION 🌳
    }
    return suite;
  };

  const runSuite = (model: t.TestSuiteModel, options: t.TestSuiteRunOptions = {}) => {
    const { deep = true, ctx } = options;

    type R = t.TestSuiteRunResponse;
    return new Promise<R>(async (resolve) => {
      const tx = `run.${slug()}`;
      const res: R = { id, tx, ok: true, description, elapsed: -1, tests: [], children: [] };

      await init(model);
      const tests = model.state.tests;
      const childSuites = model.state.children;

      const getTimeout = () => options.timeout ?? model.state.timeout ?? DEFAULT.TIMEOUT;
      const timer = Time.timer();

      const done = () => {
        res.elapsed = timer.elapsed.msec;
        if (res.tests.some(({ error }) => Boolean(error))) res.ok = false;
        if (res.children.some(({ ok }) => !ok)) res.ok = false;
        resolve(res);
      };

      for (const test of tests) {
        const timeout = getTimeout();
        const excluded = Constraints.exclusionModifiers(test);
        res.tests.push(await test.run({ timeout, excluded, ctx }));
      }

      if (deep && childSuites.length > 0) {
        for (const childSuite of childSuites) {
          const timeout = childSuite.state.timeout ?? getTimeout();
          res.children.push(await childSuite.run({ timeout })); // <== RECURSION 🌳
        }
      }

      done();
    });
  };

  const state: t.TestSuiteModelState = {
    parent,
    ready: false,
    modifier: args.modifier,
    description,
    tests: [],
    children: [],
    handler: args.handler,
  };

  /**
   * Define a child suite.
   */
  const describe = Def.variants(() => model);

  /**
   * Define a single test.
   */
  const testDef = (modifier?: t.TestModifier): t.TestSuiteItDef => {
    return (description, handler) => {
      const parent = model;
      const test = TestModel({ parent, description, handler, modifier });
      state.tests = [...state.tests, test];
      return test;
    };
  };

  const it = testDef();
  (it as any).skip = testDef('skip');
  (it as any).only = testDef('only');

  const model: t.TestSuiteModel = {
    kind: 'TestSuite',
    id,
    state,

    describe: describe as t.TestSuiteDescribe,
    it: it as t.TestSuiteIt,

    timeout(value) {
      state.timeout = Math.max(0, value);
      return model;
    },

    init: () => init(model),
    async run(args) {
      return runSuite(model, args);
    },

    async merge(...suites) {
      // Clone the incoming suites.
      await init(model);
      suites = await Promise.all(suites.map((suite) => suite.clone()));

      // Merge into self.
      state.children = [...state.children, ...suites];
      state.children.forEach((suite) => (suite.state.parent = model));
      return model;
    },

    async clone() {
      const clone = TestSuiteModel({ ...args });
      await init(clone);
      return clone;
    },

    toString: () => state.description,
  };

  return model;
};
