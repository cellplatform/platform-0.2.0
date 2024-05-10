import { type t } from './common';
import { Constraints } from './Constraints.mjs';
import { TestTree } from './TestTree.mjs';

/**
 * Helpers for calculating totals.
 */
export const Total = {
  count(suite: t.TestSuiteModel) {
    const res: t.TestSuiteTotal = {
      total: 0,
      runnable: 0,
      skipped: 0,
      only: 0,
    };

    TestTree.walkDown(suite, (e) => {
      if (e.test) {
        const exclusions = Constraints.exclusionModifiers(e.test);
        const isExcluded = exclusions.length > 0;
        const isOnly = Constraints.isWithinOnlySet(e.test);
        const isSkipped = Constraints.isSkipped(e.test);

        res.total++;
        if (isOnly) res.only++;
        if (isSkipped) res.skipped++;
        if (!isExcluded) res.runnable++;
      }
    });
    return res;
  },
};
