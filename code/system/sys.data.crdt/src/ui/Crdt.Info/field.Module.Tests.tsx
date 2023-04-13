import { t, Test } from './common';
import { TestRunner } from './ui.TestRunner';

export function FieldModuleTests(data: t.CrdtInfoData, info?: {}): t.PropListItem[] {
  const res: t.PropListItem[] = [];

  /**
   * TODO 🐷
   * - move UI component to [sys.ui.common/PropsList]
   */
  const loadTests = async () => {
    const { TESTS } = await import('../../test/-TESTS.mjs');
    const root = await Test.bundle(TESTS.all());
    return root;
  };

  res.push({
    label: 'Verify Module',
    value: <TestRunner loadTests={loadTests} />,
  });

  return res;
}
