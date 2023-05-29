import { useEffect, useState } from 'react';

import { t } from '../common';

/**
 * Handles turning an import promise into an initialized spec.
 */
export function useSpecImports(input: t.SpecImport) {
  const [suite, setSuite] = useState<t.TestSuiteModel>();

  /**
   * Lifecycle.
   */
  useEffect(() => {
    let isDisposed = false;
    Wrangle.toSpec(input).then((spec) => {
      if (!isDisposed) setSuite(spec);
    });
    return () => {
      isDisposed = true;
    };
  }, [input]);

  /**
   * API
   */
  return {
    suite,
    description: suite?.description ?? '',
  };
}

/**
 * Helpers
 */
const Wrangle = {
  async toSpec(input: t.SpecImport) {
    const spec = (await input).default;
    if (spec?.kind !== 'TestSuite') return;
    await spec.init();
    return spec;
  },
};
