import { run } from './Bus.Controller.run.mjs';
import { BusEvents } from './Bus.Events.mjs';
import { BusMemoryState } from './Bus.MemoryState.mjs';
import { Is, rx, SpecContext, t, Test } from './common';
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
  const bus = rx.busAsType<t.DevEvent>(args.instance.bus);
  const instance = args.instance.id;

  const events = BusEvents({
    instance: args.instance,
    dispose$: args.dispose$,
    filter: args.filter,
  });
  const { dispose$ } = events;

  let _context: t.SpecCtxWrapper | undefined;
  const Context = {
    create() {
      const wrapper = (_context = SpecContext.create(args.instance, { dispose$ }));
      state.change('context:init', (draft) => {
        draft.instance.context = wrapper.id;
        Reset.info(draft);
      });
      return _context;
    },
    get current() {
      return _context || (_context = Context.create());
    },
  };

  const state = BusMemoryState({
    onChanged(e) {
      const { message, info } = e;
      bus.fire({
        type: 'sys.dev/info:changed',
        payload: { instance, message, info },
      });
    },
  });

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
    Context.create();

    try {
      const root = e.bundle ? await Test.bundle(e.bundle) : undefined;
      const message: t.DevInfoChangeMessage = root ? 'spec:load' : 'spec:unload';
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
   * Run the test suite.
   */
  events.run.req$.subscribe(async (e) => {
    const { tx, only } = e;
    const rootSpec = state.current.root;
    let error: string | undefined;

    try {
      if (rootSpec) {
        const res = await run(Context.current, rootSpec, { only });
        const message: t.DevInfoChangeMessage = only ? 'run:subset' : 'run:all';
        await state.change(message, (draft) => {
          const run = draft.run || (draft.run = DEFAULT.INFO.run);
          draft.render.props = res.props;
          run.count++;
          run.results = res.results;
        });
      }
    } catch (err: any) {
      error = err.message;
    }

    bus.fire({
      type: 'sys.dev/run:res',
      payload: { tx, instance, info: state.current, error },
    });
  });

  /**
   * Context: Reset.
   */
  events.reset.req$.subscribe(async (e) => {
    const { tx } = e;
    Context.create();
    bus.fire({
      type: 'sys.dev/reset:res',
      payload: { tx, instance, info: state.current },
    });
  });

  /**
   * State: Write.
   */
  events.state.change.req$.subscribe(async (e) => {
    const { tx } = e;
    let error: string | undefined;

    state.change('state:write', async (draft) => {
      const state = draft.render.state || (draft.render.state = { ...e.initial });
      const res = e.mutate(state);
      if (Is.promise(res)) await res;
    });

    bus.fire({
      type: 'sys.dev/state/change:res',
      payload: { tx, instance, info: state.current, error },
    });
  });

  /**
   * API
   */
  return events;
}

/**
 * [Helpers]
 */

const Reset = {
  info(info: t.DevInfo) {
    info.run = DEFAULT.INFO.run;
    info.render.props = undefined;
    info.render.state = undefined;
  },
};
