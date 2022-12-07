import { useEffect, useState } from 'react';
import { takeUntil } from 'rxjs/operators';

import { rx, t, Test, SpecContext } from '../common';

export function useSpecRunner(bundle?: t.BundleImport) {
  const [spec, setSpec] = useState<t.TestSuiteModel>();
  const [results, setResults] = useState<t.TestSuiteRunResponse>();
  const [props, setProps] = useState<t.SpecRenderProps | undefined>();

  const id = spec?.id;

  /**
   * Lifecycle
   */
  useEffect(() => {
    const { dispose$, dispose } = rx.disposable();

    const run = async () => {
      const spec = bundle ? await Test.bundle(bundle) : undefined;
      setSpec(spec);

      if (spec) {
        const instance = SpecContext.args({ dispose$ });
        const { ctx } = instance;
        const res = await spec.run({ ctx });

        const rerun$ = instance.props.rerun$.pipe(takeUntil(dispose$));
        rerun$.subscribe(() => {
          instance.dispose();
          run(); // <== RECURSION 🌳
        });

        setResults(res);
        setProps((prev) => ({
          ...prev,
          ...instance.props,
        }));
      }
    };

    run();
    return () => dispose();
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
