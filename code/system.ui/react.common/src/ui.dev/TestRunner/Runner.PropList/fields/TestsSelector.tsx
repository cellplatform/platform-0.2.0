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
      value: <SpecRow spec={spec} selected={isSelected} />,
    };
  });
}

/**
 * Helpers
 */
const Wrangle = {
  isSelected(data: t.TestRunnerPropListData, spec: t.SpecImport) {
    const specs = data?.specs ?? {};
    // const all = specs?.all ?? [];
    const selected = specs.selected;

    if (selected === undefined) return true;

    return selected.includes(spec);
    //
  },
};
