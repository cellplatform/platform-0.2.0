import { useEffect, useState } from 'react';
import { takeUntil } from 'rxjs/operators';

import { rx, t, Test, SpecContext } from '../common';

export function useSpecRunner(instance: t.DevInstance, bundle?: t.BundleImport) {
  const [spec, setSpec] = useState<t.TestSuiteModel>();
  const [results, setResults] = useState<t.TestSuiteRunResponse>();
  const [args, setArgs] = useState<t.SpecRenderArgs | undefined>();
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
        const args = SpecContext.args({ dispose$ });
        const { ctx } = args;
        const results = await spec.run({ ctx });

        const rerun$ = args.args.rerun$.pipe(takeUntil(dispose$));
        rerun$.subscribe(() => {
          args.dispose();
          run(); // <== RECURSION 🌳
        });

        setResults(results);
        setArgs((prev) => ({
          ...prev,
          ...args.args,
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
    args,
  };
}
