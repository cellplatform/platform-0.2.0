import type { t } from '../common';
import { TestRunner } from '../ui/TestRunner';
import { TestRunnerLabel } from '../ui/TestRunner.Label';

export function FieldTestsRun(args: {
  fields: t.TestRunnerField[];
  data: t.TestPropListData;
  enabled: boolean;
  theme?: t.CommonTheme;
}): t.PropListItem | undefined {
  const data = args.data;
  const run = data?.run;
  if (!run) return;

  const label = typeof run.label === 'function' ? run.label() : run.label;
  const infoUrl = typeof run.infoUrl === 'function' ? run.infoUrl() : run.infoUrl;

  return {
    label: <TestRunnerLabel label={label} infoUrl={infoUrl} theme={args.theme} />,
    value: <TestRunner data={data} enabled={args.enabled} theme={args.theme} />,
  };
}
