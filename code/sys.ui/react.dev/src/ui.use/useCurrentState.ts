import { useEffect, useState } from 'react';
import { DevBus } from '../u.Bus';
import { rx, type t } from './common';

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
  const [count, setCount] = useState(0);

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const events = DevBus.Events({ instance });

    events.info.changed$
      .pipe(
        rx.filter((e) => (options.filter ? options.filter(e) : true)),
        rx.distinctUntilChanged((p, n) => (distinctUntil ? distinctUntil(p, n) : false)),
      )
      .subscribe((e) => {
        setInfo(e.info);
        setCount((prev) => prev + 1);
      });

    return () => events.dispose();
  }, [busid, instance.id]);

  /**
   * [API]
   */
  return { count, info };
}
