import { BusEvents } from '../logic.Bus/Bus.Events.mjs';
import { t } from './common';
import { ContextState } from './Context.State.mjs';
import { CtxProps } from './Ctx.Props.mjs';

type O = Record<string, unknown>;

export const Context = {
  /**
   * Create a new instance of the Context logic.
   */
  async init(instance: t.DevInstance, options?: { dispose$: t.Observable<any> }) {
    const events = BusEvents({ instance, dispose$: options?.dispose$ });
    const props = await CtxProps(events);
    const { dispose, dispose$ } = events;

    const toObject = (): t.SpecCtxObject => {
      return {
        instance,
        props: { ...props.current },
      };
    };

    const ctx: t.SpecCtx2 = {
      ...props.setters,
      toObject,

      get initial() {
        /**
         * TODO 🐷
         */
        return true;
      },

      async reset() {
        const res = await events.reset.fire();
        return res.info ?? (await events.info.get());
      },

      async state<T extends O>(initial: T) {
        const info = await events.info.get();
        return ContextState<T>({ initial: (info.render.state ?? initial) as T, events });
      },
    };

    const api: t.DevContext = {
      ctx,
      instance,
      dispose,
      dispose$,
      toObject,

      get disposed() {
        return events.disposed;
      },
      get pending() {
        return props.pending;
      },

      async flush() {
        if (api.disposed) throw new Error('Context has been disposed');
        if (!api.pending) return api;

        /**
         * TODO 🐷
         * - Rename [SpecCtx2]
         * - Integrate into harness runner.
         * - Remove ID from deeper in the state tree (only on {instance}).
         */

        await events.props.change.fire((draft) => {
          const current = props.current;
          draft.component = current.component;
          draft.host = current.host;
          draft.debug = current.debug;
        });

        return api;
      },
    };

    // _ctx = createCtx();
    return api;
  },
};
