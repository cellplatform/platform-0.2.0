import { BusEvents } from '../logic.Bus/Bus.Events.mjs';
import { t } from './common';
import { CtxProps } from './Ctx.Props.mjs';

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

        await events.props.change.fire({
          mutate(draft) {
            /**
             * TODO 🐷
             * - pass mutate as first arg (not in {object})
             * - Rename [SpecCtx2]
             * - Integrate into harness runner.
             */

            //
            // props.
            draft.component = props.current.component;
          },
        });

        return api;
      },
    };

    // _ctx = createCtx();
    return api;
  },
};
