import { t } from '../common';
import { SpecsReset } from '../ui/Specs.Reset';

/**
 * Reset row.
 */
export function FieldTestsSelectorReset(args: {
  fields: t.TestRunnerField[];
  data: t.TestPropListData;
  groups: t.TestSuiteGroup[];
}): t.PropListItem | undefined {
  return { value: <SpecsReset data={args.data} groups={args.groups} /> };
}
