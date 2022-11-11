import { useEffect, useState } from 'react';

import { t, Test } from '../common';
import { Context } from './Context.mjs';

export function useSpecRunner(bundle?: t.BundleImport) {
  const [spec, setSpec] = useState<t.TestSuiteModel>();
  const [results, setResults] = useState<t.TestSuiteRunResponse>();
  const [props, setProps] = useState<t.SpecRenderProps>({});

  const id = spec?.id;

  /**
   * Lifecycle
   */
  useEffect(() => {
    (async () => {
      const spec = bundle ? await Test.bundle(bundle) : undefined;
      setSpec(spec);

      if (spec) {
        const { ctx, mutable } = Context.args();
        const res = await spec.run({ ctx });
        setResults(res);
        setProps((prev) => ({ ...prev, ...mutable.props }));
      }
    })();
  }, [id, bundle]);

  /**
   * API
   */
  return {
    id,
    spec,
    results,
    props,
  };
}
