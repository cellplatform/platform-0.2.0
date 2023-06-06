import { t } from '../common';
import { SpecsReset } from '../ui/Specs.Reset';
import { SpecsRow } from '../ui/Specs.Row';

/**
 * Spec selector rows.
 */
export function FieldTestsSelector(args: {
  fields: t.TestRunnerField[];
  data: t.TestPropListData;
  suites: t.TestSuiteModel[];
}): t.PropListItem[] {
  const { data, suites } = args;
  const run = data?.run ?? {};
  const specs = data?.specs ?? {};

  if (!run.list || run.list.length === 0) return [];

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

/**
 * Reset row.
 */
export function FieldTestsSelectorReset(args: {
  fields: t.TestRunnerField[];
  data: t.TestPropListData;
}): t.PropListItem | undefined {
  const run = args.data?.run ?? {};
  if (!run.list || run.list.length === 0) return undefined;
  return { value: <SpecsReset data={args.data} /> };
}
