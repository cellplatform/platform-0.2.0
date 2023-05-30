import { useEffect, useState } from 'react';
import { t, rx } from '../common';
import { Util } from '../Util.mjs';

/**
 * Handles turning an import promise into an initialized spec.
 */
export function useSpecImport(data: t.TestRunnerPropListData, spec: t.SpecImport) {
  const specs = data.specs ?? {};
  const selected = specs.selected ?? [];

  const [suite, setSuite] = useState<t.TestSuiteModel>();
  const [hash, setHash] = useState('');
  const isSelected = selected.includes(hash);
  const description = suite?.description ?? '';

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const lifecycle = rx.lifecycle();
    Util.ensureLoaded(spec).then((spec) => {
      if (lifecycle.disposed || !spec) return;
      setSuite(spec.suite);
      setHash(spec.hash);
    });
    return lifecycle.dispose;
  }, [spec]);

  /**
   * API
   */
  return {
    suite,
    hash,
    description,
    isSelected,
  };
}
