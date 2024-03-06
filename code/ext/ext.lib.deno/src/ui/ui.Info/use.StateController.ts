import { useEffect, useRef, useState } from 'react';
import { DEFAULTS, Http, PatchState, R, rx, type t, Immutable } from './common';

type Args = {
  enabled?: boolean;
  data?: t.InfoData;
  onStateChange?: (e: t.InfoData) => void;
};

export function useStateController(args: Args) {
  const { enabled = true } = args;
  const [_, setRedraw] = useState(0);
  const redraw = () => setRedraw((prev) => prev + 1);

  const stateRef = useRef(wrangle.state(args));
  const state = stateRef.current;

  const is = {
    endpointChanged: !R.equals(args.data?.endpoint, state.current.endpoint),
    sourceDataChanged: !R.equals(args.data, state.current),
  } as const;

  /**
   * Lifecycle.
   */
  useEffect(() => {
    if (!enabled) return () => null;
    const events = Immutable.events(state);
    const client = Http.client(state.current.endpoint ?? DEFAULTS.endpoint);
    events.$.pipe(rx.debounceTime(100)).subscribe(() => {
      redraw();
      args.onStateChange?.(state.current);
    });

    client.projects.list().then((e) => {
      state.change((d) => (wrangle.projects(d).list = e.ok ? e.projects : []));
    });

    state.change((d) => {
      wrangle.projects(d).onSelect = (e) => {
        state.change((d) => (wrangle.projects(d).selected = e.project.id));
        args.data?.projects?.onSelect?.(e); // Bubble to base handler.
      };
    });

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

/**
 * Helpers
 */
const wrangle = {
  state(args: Args): t.Immutable<t.InfoData> {
    const initial = args.data ?? {};
    return PatchState.init({ initial });
  },

  projects: (d: t.InfoData) => d.projects || (d.projects = {}),
} as const;
