import { useEffect, useState } from 'react';
import { debounceTime } from 'rxjs/operators';

import { BusEvents } from './BusEvents.mjs';
import { rx, t } from './common.mjs';

export type Id = string;

type OnChange = (e: OnChangeArgs) => void;
type OnChangeArgs = { current: t.StateTree };

/**
 * React hook for working with the state bus.
 */
export function useEvents(instance: t.StateInstance, onChange?: OnChange) {
  const busid = rx.bus.instance(instance.bus);
  const [current, setCurrent] = useState<t.StateTree>();

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const events = BusEvents({ instance });

    events.changed.$.pipe(debounceTime(10)).subscribe((e) => {
      const { current } = e;
      onChange?.({ current });
      setCurrent(current);
    });

    return () => events.dispose();
  }, [busid, instance.id]);

  /**
   * API
   */
  return { current };
}
