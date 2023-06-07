import { t } from '../common';
import { SpecsReset } from '../ui/Specs.Reset';

/**
 * Reset row.
 */
export function FieldTestsSelectorReset(args: {
  fields: t.TestRunnerField[];
  data: t.TestPropListData;
  groups: t.TestSuiteGroup[];
  enabled: boolean;
}): t.PropListItem | undefined {
  return { value: <SpecsReset data={args.data} groups={args.groups} enabled={args.enabled} /> };
}
