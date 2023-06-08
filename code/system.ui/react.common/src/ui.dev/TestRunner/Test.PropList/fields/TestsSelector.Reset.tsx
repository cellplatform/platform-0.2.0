import { t } from '../common';
import { SpecsReset } from '../ui/Specs.Reset';
import { Util } from '../Util.mjs';

/**
 * Reset row.
 */
export function FieldTestsSelectorReset(args: {
  fields: t.TestRunnerField[];
  data: t.TestPropListData;
  groups: t.TestSuiteGroup[];
  enabled: boolean;
}): t.PropListItem | undefined {
  const isSelectable = Util.isSelectable(args.data);

  if (!isSelectable) return;

  return {
    value: <SpecsReset data={args.data} groups={args.groups} enabled={args.enabled} />,
  };
}
