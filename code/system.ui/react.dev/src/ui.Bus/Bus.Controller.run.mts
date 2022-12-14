import { t, TestTree } from './common';

type Id = string;

export async function run(
  context: t.SpecCtxWrapper,
  root: t.TestSuiteModel,
  options: { only?: Id[] } = {},
) {
  const { only } = options;

  /**
   * TODO 🐷
   *
   *   - Run from root if prior test run has never happened.
   *   - Patch the existing results with just the results from the targetted sub-set.
   *   - Do not run the whole sweet (below)
   *
   *   - add flag to ctx:
   *      ctx.initial (boolean)
   *          - repeat runs of the spec will be false.
   *          - allows for conditional initial setup within spec.
   *
   */

  /**
   * Run.
   */
  const { ctx } = context;
  const results = await root.run({ ctx, only });

  /**
   * Response.
   */
  const props = context.props;
  return { results, props };
}
