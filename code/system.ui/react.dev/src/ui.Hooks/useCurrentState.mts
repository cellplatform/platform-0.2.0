import { useEffect, useState } from 'react';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { DevBus, rx, t } from './common';

type C = t.DevInfoChanged;
type Unchanged = (prev: C, next: C) => boolean;
type Filter = (e: C) => boolean;

/**
 * HOOK: monitors change in the current state.
 */
export function useCurrentState(
  instance: t.DevInstance,
  options: { distinctUntil?: Unchanged; filter?: Filter } = {},
) {
  const { distinctUntil } = options;
  const busid = rx.bus.instance(instance.bus);
  const [info, setInfo] = useState<t.DevInfo>();

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const events = DevBus.Events({ instance });

    events.info.changed$
      .pipe(
        filter((e) => (options.filter ? options.filter(e) : true)),
        distinctUntilChanged((p, n) => (distinctUntil ? distinctUntil(p, n) : false)),
      )
      .subscribe((e) => setInfo(e.info));

    return () => events.dispose();
  }, [busid, instance.id]);

  /**
   * [API]
   */
  return { info };
}
