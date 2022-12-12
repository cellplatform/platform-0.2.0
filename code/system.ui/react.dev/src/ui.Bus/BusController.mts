import { BusEvents } from './BusEvents.mjs';
import { Pkg, rx, t, Test } from './common';
import { BusMemoryState } from './BusMemoryState.mjs';

type Id = string;

/**
 * Event controller.
 */
export function BusController(args: {
  instance: { bus: t.EventBus<any>; id: Id };
  filter?: (e: t.DevEvent) => boolean;
  dispose$?: t.Observable<any>;
}): t.DevEvents {
  const { filter } = args;

  const bus = rx.busAsType<t.DevEvent>(args.instance.bus);
  const instance = args.instance.id;
  const state = BusMemoryState({
    onChanged(e) {
      const { message, info } = e;
      bus.fire({
        type: 'sys.dev/info:changed',
        payload: { instance, message, info },
      });
    },
  });

  const events = BusEvents({
    instance: args.instance,
    dispose$: args.dispose$,
    filter,
  });
  const { dispose, dispose$ } = events;

  /**
   * Info (Module)
   */
  events.info.req$.subscribe(async (e) => {
    const { tx } = e;
    const info = state.current;
    bus.fire({
      type: 'sys.dev/info:res',
      payload: { tx, instance, info },
    });
  });

  /**
   * Load root spec
   */
  events.load.req$.subscribe(async (e) => {
    const { tx } = e;
    let error: string | undefined;

    try {
      const root = e.bundle ? await Test.bundle(e.bundle) : undefined;
      const message = e.bundle ? 'action:load' : 'action:unload';
      await state.change(message, (draft) => (draft.root = root));
    } catch (err: any) {
      error = err.message;
    }

    const info = state.current;
    bus.fire({
      type: 'sys.dev/load:res',
      payload: { tx, instance, info, error },
    });
  });

  /**
   * API
   */
  return events;
}
