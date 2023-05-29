import { t } from '../common';
import { SpecRow } from '../ui/SpecRow';

export function FieldTestsSelector(args: {
  fields: t.TestRunnerField[];
  data: t.TestRunnerPropListData;
}): t.PropListItem[] {
  const specs = args.data?.specs;
  if (!specs || specs.length === 0) return [];

  return specs.map((spec, i) => {
    return { value: <SpecRow spec={spec} /> };
  });
}
