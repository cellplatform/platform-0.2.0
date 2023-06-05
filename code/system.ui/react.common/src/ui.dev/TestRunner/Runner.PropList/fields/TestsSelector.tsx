import { t } from '../common';
import { SpecsReset } from '../ui/Specs.Reset';
import { SpecsRow } from '../ui/Specs.Row';

export function FieldTestsSelector(args: {
  fields: t.TestRunnerField[];
  data: t.TestRunnerPropListData;
  suites: t.TestSuiteModel[];
}): t.PropListItem[] {
  const { data, suites } = args;
  const run = data?.run;
  const specs = data?.specs ?? {};

  if (!specs.all || specs.all.length === 0) return [];

  return suites.map((spec) => {
    return {
      value: (
        <SpecsRow
          data={data}
          spec={spec}
          onSelectionChange={specs.onSelect}
          onRunClick={run?.onRunSingle}
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
