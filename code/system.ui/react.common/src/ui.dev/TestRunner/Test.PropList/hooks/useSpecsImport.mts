import { useEffect, useState } from 'react';
import { Util } from '../Util.mjs';
import { rx, type t } from '../common';

/**
 * Handles turning an import promise into an initialized spec.
 */
export function useSpecsImport(data: t.TestPropListData) {
  const all = (data.run ?? {}).all ?? [];

  const [loaded, setLoaded] = useState(false);
  const [suites, setSuites] = useState<t.TestSuiteModel[]>([]);
  const hashes = suites.map((suite) => suite.hash()).join(',');

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const lifecycle = rx.lifecycle();

    Util.importAndInitialize(data).then((res) => {
      if (lifecycle.disposed) return;

      const suites = res.map((e) => e.suite);
      const totalReady = suites.reduce((acc, next) => acc + (next.ready ? 1 : 0), 0);
      setSuites(suites);
      setLoaded(totalReady === all.length);
    });

    return lifecycle.dispose;
  }, [hashes, loaded, all.length]);

  /**
   * API
   */
  return { suites };
}
