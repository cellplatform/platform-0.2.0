import { type t } from './common';
import { TestRunnerControlled } from './ui/TestRunner.Controlled';
import { TestRunnerLabel } from './ui/TestRunner.Label';

type R = t.TestPropListRunData;

/**
 * <PropList> compact test-runner.
 */
export const Item = {
  /**
   * Generates a <PropList> item for running unit tests.
   */
  runner(args: {
    modules?: R['modules'];
    ctx?: R['ctx'];
    label?: R['label'];
    infoUrl?: R['infoUrl'];
  }): t.PropListItem {
    const { modules, ctx } = args;
    const data: t.TestPropListData = { run: { modules, ctx } };
    return {
      label: <TestRunnerLabel label={args.label} infoUrl={args.infoUrl} />,
      value: <TestRunnerControlled initial={data} />,
    };
  },
};
