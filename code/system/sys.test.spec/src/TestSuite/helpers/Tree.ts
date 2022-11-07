import { t, Is } from '../common';

export type FindArgs = { suite: t.TestSuiteModel; test?: t.TestModel };
export type WalkDownArgs = { suite: t.TestSuiteModel; test?: t.TestModel; stop(): void };
export type WalkUpArgs = { suite: t.TestSuiteModel; isRoot: boolean; stop(): void };

type T = t.TestSuiteModel | t.TestModel;

/**
 * Helpers for walking a hierarchical tree of tests.
 */
export const Tree = {
  parent(child?: T): t.TestSuiteModel | undefined {
    if (Is.test(child)) return (child as t.TestModel).parent;
    if (Is.suite(child)) return (child as t.TestSuiteModel).state.parent;
    return undefined;
  },

  root(child?: T): t.TestSuiteModel | undefined {
    if (!child) return undefined;
    let root: t.TestSuiteModel | undefined;
    Tree.walkUp(child, (e) => {
      if (e.isRoot) root = e.suite;
    });
    return root;
  },

  walkDown(from: t.TestSuiteModel | undefined, handler: (e: WalkDownArgs) => void) {
    if (!from) return;

    const invoke = (suite: t.TestSuiteModel, test?: t.TestModel) => {
      let stop = false;
      handler({ test, suite, stop: () => (stop = true) });
      return { stop };
    };

    // Visit the suite.
    if (invoke(from).stop) return; // NB: Exit requested.

    // Visit each test.
    for (const test of from.state.tests) {
      if (invoke(from, test).stop) return; // NB: Exit requested.
    }

    // Walk down into child suites.
    from.state.children.forEach((child) => Tree.walkDown(child, handler)); // <== RECURSION 🌳
  },

  walkUp(from: T | undefined, handler: (e: WalkUpArgs) => void) {
    if (!from) return;
    if (Is.test(from)) {
      const suite = Tree.parent(from);
      if (suite) Tree.walkUp(suite, handler); // <== RECURSION 🌳
      return;
    }

    let suite = from as t.TestSuiteModel;
    if (!suite) return;

    while (suite) {
      let stop = false;
      const parent = Tree.parent(suite);
      handler({ isRoot: !Boolean(parent), suite, stop: () => (stop = true) });
      if (!parent || stop) return;
      suite = parent;
    }
  },

  find(
    within: t.TestSuiteModel,
    match: (e: FindArgs) => boolean,
    options: { limit?: number } = {},
  ) {
    const { limit } = options;
    const result: FindArgs[] = [];
    Tree.walkDown(within, (e) => {
      const { suite, test } = e;
      if (match({ suite, test })) {
        result.push({ suite, test });
        if (typeof limit === 'number' && result.length === limit) e.stop();
      }
    });
    return result;
  },

  findOne(within: t.TestSuiteModel, match: (e: FindArgs) => boolean) {
    return Tree.find(within, match, { limit: 1 })[0];
  },

  siblings(item?: T): T[] {
    if (!item) return [];

    const parent = Tree.parent(item);
    if (!parent) return [];

    const suites = parent.state.children.filter(({ id }) => id !== item.id);
    const tests = parent.state.tests.filter(({ id }) => id !== item.id);
    return [...suites, ...tests];
  },
};
