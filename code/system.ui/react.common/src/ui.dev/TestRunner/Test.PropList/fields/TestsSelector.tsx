import { t } from '../common';
import { SpecsRow } from '../ui/Specs.Row';

/**
 * Spec selector rows.
 */
export function FieldTestsSelector(args: {
  fields: t.TestRunnerField[];
  data: t.TestPropListData;
  groups: t.TestSuiteGroup[];
}): t.PropListItem[] {
  const { data, groups } = args;
  const run = data?.run ?? {};
  const specs = data?.specs ?? {};
  const res: t.PropListItem[] = [];

  groups.forEach((group) => {
    group.suites.forEach((suite) => {
      const el = (
        <SpecsRow
          data={data}
          spec={suite}
          onSelectionChange={specs.onSelect}
          onRunClick={run?.onRunSingle}
        />
      );

      res.push({ value: el });
    });
  });

  return res;
}
