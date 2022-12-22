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

    const Local = {
      runCount: 0,
      reset() {
        Local.runCount = 0;
      },
    };
    events.reset.res$.subscribe(() => Local.reset());

    const toObject = (): t.DevCtxObject => {
      const count = Local.runCount;
      const initial = ctx.isInitial;
      return {
        instance,
        run: { count, isInitial: initial },
        props: { ...props.current },
      };
    };

    const ctx: t.DevCtx = {
      ...props.setters,
      toObject,

      get isInitial() {
        return Local.runCount === 0;
      },

      async run(options = {}) {
        const { only } = options;
        if (options.reset) await events.reset.fire();
        const res = await events.run.fire({ only });
        return res.info ?? (await events.info.get());
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

      async refresh() {
        const info = await events.info.get();
        Local.runCount = info.run.count ?? 0;
        return api;
      },

      async flush() {
        if (api.disposed) throw new Error('Cannot flush, context has been disposed');
        if (!api.pending) return api;
        await events.props.change.fire((draft) => {
          const current = props.current;
          draft.component = current.component;
          draft.host = current.host;
          draft.debug = current.debug;
        });

        return api;
      },
    };

    return api;
  },
};
