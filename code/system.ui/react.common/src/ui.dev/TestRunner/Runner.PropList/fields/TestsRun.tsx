import type { t } from '../common';
import { TestRunner } from '../ui/TestRunner';
import { TestRunnerLabel } from '../ui/TestRunner.Label';

export function FieldTestsRun(args: {
  fields: t.TestRunnerField[];
  data: t.TestRunnerPropListData;
}): t.PropListItem | undefined {
  const data = args.data;
  const run = data?.run;
  if (!run || !run.bundle) return;

  const label = typeof run.label === 'function' ? run.label() : run.label;
  const infoUrl = typeof run.infoUrl === 'function' ? run.infoUrl() : run.infoUrl;

  return {
    label: <TestRunnerLabel title={label} infoUrl={infoUrl} />,
    value: <TestRunner data={data} />,
  };
}
