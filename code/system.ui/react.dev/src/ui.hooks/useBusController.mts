import { useEffect, useRef, useState } from 'react';
import { filter } from 'rxjs/operators';

import { DevBus, rx, slug, t, Time, DEFAULTS } from './common';

type Id = string;

/**
 * Hook: Setup and lifecycle of the event-bus controller.
 */
export function useBusController(
  options: { bus?: t.EventBus; id?: Id; bundle?: t.SpecImport; runOnLoad?: boolean } = {},
) {
  const id = options.id ?? useRef(`dev.instance.${slug()}`).current;
  const bus = options.bus ?? useRef(rx.bus()).current;
  const instance = { bus, id };
  const busid = rx.bus.instance(bus);

  const [info, setInfo] = useState<t.DevInfo>(DEFAULTS.info);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const controller = DevBus.Controller({ instance });
    controller.info.changed$.pipe(filter((e) => Boolean(e.info))).subscribe((e) => setInfo(e.info));

    /**
     * Initialize.
     */
    Time.delay(0, async () => {
      if (!controller.disposed) {
        await controller.load.fire(options.bundle);
        if (options.runOnLoad) controller.run.fire();
      }
    });

    return () => controller.dispose();
  }, [id, busid, Boolean(options.bundle)]);

  /**
   * API
   */
  return { instance, info };
}
