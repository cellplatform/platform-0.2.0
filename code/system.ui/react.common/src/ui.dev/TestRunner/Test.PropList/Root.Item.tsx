import { type t } from './common';
import { TestRunnerControlled } from './ui/TestRunner.Controlled';
import { TestRunnerLabel } from './ui/TestRunner.Label';

type D = t.TestPropListData;
type R = t.TestPropListRunData;

/**
 * <PropList> compact test-runner.
 */
export const Item = {
  /**
   * Generates a <PropList> item for running unit tests.
   */
  runner(args: {
    modules?: D['modules'];
    ctx?: R['ctx'];
    label?: R['label'];
    infoUrl?: R['infoUrl'];
  }): t.PropListItem {
    const { modules, ctx } = args;
    const data: t.TestPropListData = { modules, run: { ctx } };
    return {
      label: <TestRunnerLabel label={args.label} infoUrl={args.infoUrl} />,
      value: <TestRunnerControlled initial={data} />,
    };
  },
};
