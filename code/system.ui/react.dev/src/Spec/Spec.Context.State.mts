import { t } from '../common';

type O = Record<string, unknown>;

export const State = {
  /**
   * Helper API for interacting with the state mutation event-API.
   */
  create<T extends O>(args: { events: t.DevEvents; initial: T }) {
    const { events, initial } = args;

    let _current: T | undefined;
    events.state.changed$.subscribe((e) => (_current = (e.info.state ?? initial) as T));

    const state: t.SpecCtxState<T> = {
      initial,
      get current() {
        return _current ?? initial;
      },
      async change(mutate) {
        await events.state.change.fire({ initial, mutate });
        return state.current;
      },
    };

    return state;
  },
};
