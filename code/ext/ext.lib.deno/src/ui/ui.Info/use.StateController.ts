import { useEffect, useRef, useState } from 'react';
import { DEFAULTS, Http, PatchState, R, rx, type t } from './common';

export function useStateController(args: {
  enabled?: boolean;
  data?: t.InfoData;
  onStateUpdate?: (e: t.InfoData) => void;
}) {
  const { enabled = true } = args;
  const [_, setRedraw] = useState(0);
  const redraw = () => setRedraw((prev) => prev + 1);

  const dataRef = useRef(PatchState.init({ initial: args.data ?? {} }));
  const data = dataRef.current;
  const is = {
    endpointChanged: !R.equals(args.data?.endpoint, data.current.endpoint),
    sourceDataChanged: !R.equals(args.data, data.current),
  } as const;

  /**
   * Lifecycle.
   */
  useEffect(() => {
    if (!enabled) return () => null;
    const events = data.events();
    const client = Http.client(data.current.endpoint ?? DEFAULTS.endpoint);
    events.$.pipe(rx.debounceTime(100)).subscribe(() => {
      redraw();
      args.onStateUpdate?.(data.current);
    });

    client.projects.list().then((e) => {
      data.change((d) => (wrangle.projects(d).list = e.ok ? e.projects : []));
    });

    data.change((d) => {
      wrangle.projects(d).onSelect = (e) => {
        data.change((d) => (wrangle.projects(d).selected = e.project.id));
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
      return enabled ? data.current : args.data ?? {};
    },
  } as const;
}

/**
 * Helpers
 */
const wrangle = {
  projects: (d: t.InfoData) => d.projects || (d.projects = {}),
} as const;
