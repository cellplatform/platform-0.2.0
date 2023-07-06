import { type t } from '../common';
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
  if (!Util.isSelectable(args.data)) return;

  return {
    value: <SpecsReset data={args.data} groups={args.groups} enabled={args.enabled} />,
  };
}
