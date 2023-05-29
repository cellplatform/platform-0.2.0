import { t } from '../common';
import { SpecRow } from '../ui/Spec.Row';

export function FieldTestsSelector(args: {
  fields: t.TestRunnerField[];
  data: t.TestRunnerPropListData;
}): t.PropListItem[] {
  const specs = args.data?.specs;
  if (!specs?.all || specs.all.length === 0) return [];

  return specs.all.map((spec) => {
    const isSelected = Wrangle.isSelected(args.data, spec);
    return {
      value: <SpecRow import={spec} selected={isSelected} onSelectionChange={specs.onChange} />,
    };
  });
}

/**
 * Helpers
 */
const Wrangle = {
  isSelected(data: t.TestRunnerPropListData, spec: t.SpecImport) {
    const selected = (data?.specs ?? {}).selected;
    return selected?.includes(spec) ?? false;
  },
};
