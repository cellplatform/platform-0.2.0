import { useEffect, useState } from 'react';
import { rx, t } from '../common';
import { PropListController } from '../logic/Controller.mjs';

export function useController(args: {
  initial?: t.TestRunnerPropListData;
  onChanged?: (e: t.TestRunnerPropListChange) => void;
}) {
  const [data, setData] = useState<t.TestRunnerPropListData>();

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    PropListController(args.initial).then((controller) => {
      const update = () => setData(controller.current);
      update();

      const $ = controller.$.pipe(rx.takeUntil(dispose$));
      $.subscribe((e) => {
        args.onChanged?.(e);
        update();
      });
    });

    return dispose;
  }, []);

  /**
   * API
   */
  return { data };
}
