import { t } from './common';

type Id = string;

export async function run(
  context: t.SpecCtxWrapper,
  root: t.TestSuiteModel,
  options: { only?: Id[] } = {},
) {
  const { only } = options;

  /**
   * Run.
   */
  await context.refresh();
  const { ctx } = context;
  const results = await root.run({ ctx, only });

  /**
   * Response.
   */
  return {
    results,
    props: context.props,
  };
}
