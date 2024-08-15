import { useEffect, useRef, useState } from 'react';
import { Immutable, R, rx, type t } from './common';
import { State, Wrangle } from './u';

type Args = {
  enabled?: boolean;
  data?: t.InfoData;
  onStateChange?: (e: t.InfoData) => void;
};

/**
 * State controller
 */
export function useStateController(args: Args) {
  const { enabled = true } = args;
  const [, setRedraw] = useState(0);
  const redraw = () => setRedraw((n) => n + 1);

  const stateRef = useRef(Wrangle.state(args.data));
  const state = stateRef.current;
  const is = {
    endpointChanged: !R.equals(args.data?.endpoint, state.current.endpoint),
    sourceDataChanged: !R.equals(args.data, state.current),
  } as const;

  /**
   * Lifecycle.
   */
  useEffect(() => state.change((d) => (d.endpoint = args.data?.endpoint)), [is.endpointChanged]);
  useEffect(() => {
    if (!enabled || !state.current.endpoint?.accessToken) return () => null;
    const client = Wrangle.client(state.current);
    const events = Immutable.events.viaOverride(state);
    events.changed$.pipe(rx.debounceTime(100)).subscribe(() => {
      redraw();
      args.onStateChange?.(state.current);
    });

    State.handlers(state, args.data);
    State.pullProjects(state, client);

    return events.dispose;
  }, [is.endpointChanged, enabled]);

  /**
   * API
   */
  return {
    enabled,
    get data() {
      // NB: if the state controller is not enabled return the plain data object.
      return enabled ? state.current : args.data ?? {};
    },
  } as const;
}
