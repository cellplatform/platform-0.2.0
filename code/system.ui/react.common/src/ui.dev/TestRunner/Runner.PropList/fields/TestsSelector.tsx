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
    return {
      value: (
        <SpecsRow
          data={args.data}
          import={spec}
          onSelectionChange={specs.onSelect}
          onRunClick={specs.onRunSpec}
        />
      ),
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
    value: <SpecsReset data={args.data} />,
  };
}
