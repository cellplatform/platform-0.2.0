import { t } from '../common';
import { SpecsRow } from '../ui/Specs.Row';
import { SpecsReset } from '../ui/Specs.Reset';

export function FieldTestsSelector(args: {
  fields: t.TestRunnerField[];
  data: t.TestRunnerPropListData;
}): t.PropListItem[] {
  const specs = args.data?.specs;
  if (!specs?.all || specs.all.length === 0) return [];

  return specs.all.map((spec) => {
    const isSelected = Wrangle.isSelected(args.data, spec);
    return {
      value: <SpecsRow import={spec} selected={isSelected} onSelectionChange={specs.onChange} />,
    };
  });
}

export function FieldTestsSelectorReset(args: {
  fields: t.TestRunnerField[];
  data: t.TestRunnerPropListData;
}): t.PropListItem | undefined {
  const specs = args.data?.specs;
  if (!specs?.all || specs.all.length === 0) return undefined;

  return {
    value: <SpecsReset />,
  };
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
