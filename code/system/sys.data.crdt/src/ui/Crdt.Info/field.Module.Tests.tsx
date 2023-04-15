import { t, TestRunner } from './common';

export function FieldModuleTests(data: t.CrdtInfoData, info?: {}) {
  return TestRunner.PropList.item(async () => {
    const { TESTS } = await import('../../test/-TESTS.mjs');
    const root = await TestRunner.bundle(TESTS.all());
    const ctx = {};
    return { root, ctx };
  });
}
