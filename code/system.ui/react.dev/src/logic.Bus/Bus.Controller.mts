import { run } from './Bus.Controller.run.mjs';
import { BusEvents } from './Bus.Events.mjs';
import { BusMemoryState } from './Bus.MemoryState.mjs';
import { DEFAULT, Is, rx, SpecContext, t, Test } from './common';

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

  const Context = {
    _: undefined as t.SpecContext | undefined,

    async create() {
      const wrapper = (Context._ = SpecContext.create(args.instance, { dispose$ }));
      await state.change('context:init', (draft) => {
        draft.instance.context = wrapper.id;
        draft.instance.bus = rx.bus.instance(bus);
        draft.root = undefined;
        draft.render.props = undefined;
        draft.render.state = undefined;
        draft.run = { count: 0 };
      });
      return Context._;
    },
    async current() {
      return Context._ || (Context._ = await Context.create());
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
    const ctx = (await Context.current()).ctx;
    const info = state.current;
    bus.fire({
      type: 'sys.dev/info:res',
      payload: { tx, instance, info, ctx },
    });
  });

  /**
   * Load root spec
   */
  events.load.req$.subscribe(async (e) => {
    const { tx } = e;
    let error: string | undefined;
    await Context.create();

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
   * Context: Reset.
   */
  events.reset.req$.subscribe(async (e) => {
    const { tx } = e;
    await Context.create();
    bus.fire({
      type: 'sys.dev/reset:res',
      payload: { tx, instance, info: state.current },
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
        const res = await run(await Context.current(), rootSpec, { only });
        const message: t.DevInfoChangeMessage = only ? 'run:subset' : 'run:all';
        await state.change(message, (draft) => {
          const run = draft.run || (draft.run = DEFAULT.info().run);
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
   * Props: Write.
   */
  events.props.change.req$.subscribe(async (e) => {
    const { tx } = e;
    let error: string | undefined;

    state.change('props:write', async (draft) => {
      /**
       * TODO 🐷
       */
      const props = draft.render.props || (draft.render.props = DEFAULT.props());
      const res = e.mutate(props);
      if (Is.promise(res)) await res;
    });

    bus.fire({
      type: 'sys.dev/props/change:res',
      payload: { tx, instance, info: state.current, error },
    });
  });

  /**
   * API
   */
  return events;
}
