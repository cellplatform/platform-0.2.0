import { useEffect, useState } from 'react';
import { PropListController } from '../logic/Controller.mjs';
import { rx, t } from '../common';

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
    PropListController(args.initial).then((ctrl) => {
      const update = () => setData(ctrl.current);
      update();
      ctrl.$.pipe(rx.takeUntil(dispose$)).subscribe((e) => {
        update();
        args.onChanged?.(e);
      });
    });

    return dispose;
  }, []);

  /**
   * API
   */
  return { data };
}
