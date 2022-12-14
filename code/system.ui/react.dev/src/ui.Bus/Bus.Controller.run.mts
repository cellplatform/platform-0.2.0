import { BusEvents } from './Bus.Events.mjs';
import { BusMemoryState } from './Bus.MemoryState.mjs';
import { rx, SpecContext, t, Test, TestTree } from './common';
import { DEFAULT } from './DEFAULT.mjs';

type Id = string;

export async function run(
  context: t.SpecContext,
  spec: t.TestSuiteModel,
  options: { target?: Id[] } = {},
) {
  const { target } = options;

  if (target) {
    const match = TestTree.find(spec, (e) => {
      /**
       * TODO 🐷
       */

      if (target.includes(e.suite.id)) return true;
      if (e.test && target.includes(e.test.id)) return true;
      return false;
    });
  }

  const { ctx, props } = context;
  const results = await spec.run({ ctx });

  return { results, props };
}
