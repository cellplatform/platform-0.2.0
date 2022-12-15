import { useEffect, useState } from 'react';
import { distinctUntilChanged } from 'rxjs/operators';

import { DevBus, rx, t } from './common';

type C = t.DevInfoChanged;
type Changed = (prev: C, next: C) => boolean;

/**
 * HOOK: monitors change in the current state.
 */
export function useCurrentState(instance: t.DevInstance, distinctUntil?: Changed) {
  const busid = rx.bus.instance(instance.bus);
  const [info, setInfo] = useState<t.DevInfo>();

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const events = DevBus.Events({ instance });

    events.info.changed$
      .pipe(distinctUntilChanged((p, n) => (distinctUntil ? distinctUntil(p, n) : false)))
      .subscribe((e) => setInfo(e.info));

    return () => events.dispose();
  }, [busid, instance.id]);

  /**
   * [API]
   */
  return { info };
}
