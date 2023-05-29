import { t } from '../common';
import { Item } from '../Item';

export function FieldTestsRun(args: {
  fields: t.TestRunnerField[];
  data: t.TestRunnerPropListData;
}): t.PropListItem | undefined {
  const data = args.data?.run;
  if (!data || !data.get) return;

  const { get, label } = data;
  const infoUrl = typeof data.infoUrl === 'function' ? data.infoUrl() : data.infoUrl;

  return Item.runner({
    infoUrl, // 🌳 ← Any view address that contains further details about the test run. (info) icon.
    label,
    get,
  });
}
