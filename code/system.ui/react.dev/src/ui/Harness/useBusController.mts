import { useEffect, useRef } from 'react';

import { t, rx, slug } from '../common';
import { DevBus } from '../../ui.Bus';

type Id = string;

/**
 *
 */
export function useBusController(options: { bus?: t.EventBus; id?: Id } = {}) {
  const id = options.id ?? useRef(`dev.instance.${slug()}`).current;
  const bus = options.bus ?? useRef(rx.bus()).current;
  const instance = { bus, id };
  const busid = rx.bus.instance(bus);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const controller = DevBus.Controller({ instance });
    return () => controller.dispose();
  }, [id, busid]);

  /**
   * API
   */
  return { instance };
}
