import { useEffect, useState } from 'react';
import { Util } from '../Util.mjs';
import { rx, t } from '../common';

/**
 * Handles turning an import promise into an initialized spec.
 */
export function useSpecImport(data: t.TestRunnerPropListData, spec: t.SpecImport) {
  const specs = data.specs ?? {};
  const [suite, setSuite] = useState<t.TestSuiteModel>();

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const lifecycle = rx.lifecycle();
    Util.ensureLoaded(spec).then((suite) => {
      if (lifecycle.disposed || !suite) return;
      setSuite(suite);
    });
    return lifecycle.dispose;
  }, [spec]);

  /**
   * API
   */
  return {
    suite,
    get isSelected() {
      const hash = suite?.hash() ?? '';
      const selected = specs.selected ?? [];
      return selected.includes(hash);
    },
  };
}
