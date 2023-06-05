import { useEffect, useState } from 'react';
import { Test, rx, t } from '../common';

/**
 * Handles turning an import promise into an initialized spec.
 */
export function useSpecsImport(data: t.TestRunnerPropListData) {
  const specs = data.specs ?? {};
  const all = specs.all ?? [];

  const [loaded, setLoaded] = useState(false);
  const [suites, setSuites] = useState<t.TestSuiteModel[]>([]);
  const hashes = suites.map((suite) => suite.hash()).join(',');

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const lifecycle = rx.lifecycle();
    const all = specs.all ?? [];
    const imported = Test.import(all, { init: true });

    imported.then((res) => {
      if (lifecycle.disposed) return;
      setSuites(res.map(({ suite }) => suite));

      const totalReady = suites.reduce((acc, next) => acc + (next.ready ? 1 : 0), 0);
      setLoaded(totalReady === all.length);
    });

    return lifecycle.dispose;
  }, [hashes, loaded, all.length]);

  /**
   * API
   */
  return { suites };
}
