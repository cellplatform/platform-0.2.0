import { useEffect, useState } from 'react';
import { debounceTime } from 'rxjs/operators';

import { BusEvents } from './BusEvents.mjs';
import { rx, t } from './common.mjs';

export type Id = string;

/**
 * React hook for working with the state bus.
 */
export function useStateEvents(instance: t.Instance) {
  const busid = rx.bus.instance(instance.bus);
  const [current, setCurrent] = useState<t.StateTree>();

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const events = BusEvents({ instance });

    async function updateCurrent() {
      const { info } = await events.info.get();
      setCurrent(info?.current);
    }

    // Initial load.
    updateCurrent();

    // Change updates.
    events.changed.$.pipe(debounceTime(30)).subscribe((e) => updateCurrent());

    return () => events.dispose();
  }, [busid, instance.id]);

  /**
   * API
   */
  return { current };
}
