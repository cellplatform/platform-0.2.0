import { t } from './common';
import { TestRunner } from './ui.TestRunner';
import { TestRunnerLabel } from './ui.TestRunner.Label';

/**
 * <PropList> compact test-runner.
 */
export const Item = {
  /**
   * Generates a <PropList> item for running unit tests.
   */
  runner(args: { get: t.GetTestSuite; label?: string; infoUrl?: string }): t.PropListItem {
    return {
      label: <TestRunnerLabel title={args.label} infoUrl={args.infoUrl} />,
      value: <TestRunner get={args.get} />,
    };
  },
};
