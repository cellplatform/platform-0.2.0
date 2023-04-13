import { t } from '../common';
import { Tree } from './Tree.mjs';

export const ResultStats = {
  suite(results: t.TestSuiteRunResponse): t.TestSuiteRunStats {
    const res: t.TestSuiteRunStats = {
      total: 0,
      succeeded: 0,
      failed: 0,
      skipped: 0,
      only: 0,
    };

    if (Tree.Results.isEmpty(results)) return res;

    Tree.Results.walkDown(results, (e) => {
      if (!e.test) return;

      const excluded = e.test.excluded ?? [];
      const skipped = excluded.includes('skip');
      const only = !skipped && excluded.includes('only');

      res.total++;
      if (e.test.ok && !skipped && !only) res.succeeded++;
      if (!e.test.ok) res.failed++;
      if (skipped) res.skipped++;
      if (only) res.only++;
    });

    return res;
  },
};
