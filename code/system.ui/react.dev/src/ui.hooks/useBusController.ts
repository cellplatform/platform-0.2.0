import { useEffect, useRef, useState } from 'react';
import { DEFAULTS, DevBus, Time, rx, slug, type t } from './common';

type Id = string;
type O = Record<string, unknown>;

/**
 * Hook: Setup and lifecycle of the event-bus controller.
 */
export function useBusController(
  args: {
    bus?: t.EventBus;
    id?: Id;
    bundle?: t.SpecImport | t.TestSuiteModel;
    env?: O;
    runOnLoad?: boolean;
  } = {},
) {
  const id = args.id ?? useRef(`dev.instance.${slug()}`).current;
  const bus = args.bus ?? useRef(rx.bus()).current;
  const instance = { bus, id };
  const busid = rx.bus.instance(bus);

  const [info, setInfo] = useState<t.DevInfo>(DEFAULTS.info);
  const eventsRef = useRef<t.DevEvents>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    const events = (eventsRef.current = DevBus.Controller({ instance }));
    events.info.changed$.pipe(rx.filter((e) => Boolean(e.info))).subscribe((e) => setInfo(e.info));

    /**
     * Initialize.
     */
    Time.delay(0, async () => {
      if (events.disposed) return;
      const env = args.env;
      await events.load.fire(args.bundle, { env });
      if (args.runOnLoad) events.run.fire();
    });

    return events.dispose;
  }, [id, busid, !!args.bundle, !!args.env]);

  /**
   * API
   */
  return {
    instance,
    info,
    get events() {
      return eventsRef.current;
    },
    get ready() {
      return !!info.render.props;
    },
  } as const;
}
