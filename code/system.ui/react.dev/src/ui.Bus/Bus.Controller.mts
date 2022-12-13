import { BusEvents } from './Bus.Events.mjs';
import { BusMemoryState } from './Bus.MemoryState.mjs';
import { rx, SpecContext, t, Test } from './common';
import { DEFAULT } from './DEFAULT.mjs';

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
      const message = e.bundle ? 'spec:load' : 'spec:unload';
      await state.change(message, (draft) => {
        draft.root = root;
        if (!root) {
          // Reset (when unloaded):
          draft.run.count = 0;
          draft.run.results = undefined;
          draft.run.args = undefined;
        }
      });
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
   * Run the test suite.
   */
  events.run.req$.subscribe(async (e) => {
    const { tx } = e;
    let error: string | undefined;

    const run = async () => {
      const spec = state.current.root;

      if (spec) {
        const { ctx, args } = SpecContext.args({ dispose$ });
        const results = await spec.run({ ctx });

        /**
         * TODO 🐷
         */

        // const rerun$ = args.args.rerun$.pipe(takeUntil(dispose$));
        // rerun$.subscribe(() => {
        //   args.dispose();
        //   run(); // <== RECURSION 🌳
        // });

        const message = 'run:root';
        await state.change(message, (draft) => {
          const run = draft.run || (draft.run = DEFAULT.INFO.run);
          run.count++;
          run.args = args;
          run.results = results;
        });
      }
    };

    try {
      await run();
    } catch (err: any) {
      error = err.message;
    }

    bus.fire({
      type: 'sys.dev/run:res',
      payload: { tx, instance, info: state.current, error },
    });
  });

  /**
   * API
   */
  return events;
}
