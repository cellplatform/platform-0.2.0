import { type t } from './common';
import { TestRunnerControlled } from './ui/TestRunner.Controlled';
import { TestRunnerLabel } from './ui/TestRunner.Label';

type R = t.TestRunnerPropListRunData;

/**
 * <PropList> compact test-runner.
 */
export const Item = {
  /**
   * Generates a <PropList> item for running unit tests.
   */
  runner(args: {
    all?: R['all'];
    ctx?: R['ctx'];
    label?: R['label'];
    infoUrl?: R['infoUrl'];
  }): t.PropListItem {
    const { all, ctx } = args;
    const data: t.TestRunnerPropListData = { run: { all, ctx } };
    return {
      label: <TestRunnerLabel label={args.label} infoUrl={args.infoUrl} />,
      value: <TestRunnerControlled initial={data} />,
    };
  },
};
