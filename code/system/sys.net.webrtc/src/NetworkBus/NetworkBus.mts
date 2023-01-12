import { t, rx } from './common';

type Scope = 'local' | 'remote';
type E = t.Event;

/**
 * An event-bus distributed across a network.
 */
export function NetworkBus<T extends E = E>(args: {
  pump: t.NetworkPump<T>;
  local: () => Promise<t.NetworkBusUri>;
  remotes: () => Promise<t.NetworkBusUri[]>;
}): t.NetworkBus<T> {
  const { pump } = args;
  const bus = rx.bus<T>();

  pump.in((e) => bus.fire(e));

  const fire = async (event: T, scope: Scope[], filter?: t.NetworkBusFilter) => {
    const local = await args.local();
    const targetted: t.NetworkBusUri[] = [];
    const passesFilter = (uri: string) => (filter ? filter({ uri }) : true);

    /**
     * Broadcast the event through LOCAL observable.
     */
    if (scope.includes('local')) {
      if (filter) {
        // Test the filter against the local peer, and fire locally if any matches found.
        if (passesFilter(local)) {
          bus.fire(event);
          targetted.push(local);
        }
      } else {
        // No filter was given, so default to firing the event through the local observable.
        bus.fire(event);
        targetted.push(local);
      }
    }

    /**
     * Broadcast the event to REMOTE targets.
     */
    if (scope.includes('remote')) {
      const remotes = await args.remotes();
      const targets = remotes.filter((uri) => passesFilter(uri));
      targetted.push(...targets);
      if (targets.length > 0) pump.out({ targets, event });
    }

    return { event, targetted };
  };

  const api: t.NetworkBus<T> = {
    $: bus.$,

    fire(event: T) {
      fire(event, ['local', 'remote']);
    },

    async uri() {
      return {
        local: await args.local(),
        remotes: await args.remotes(),
      };
    },

    target: {
      async local(event) {
        return fire(event, ['local']);
      },

      async remote(event) {
        return fire(event, ['remote']);
      },

      filter(fn?: t.NetworkBusFilter) {
        return {
          fire: (event) => fire(event, ['local', 'remote'], fn),
        };
      },

      node(...target: t.NetworkBusUri[]) {
        return {
          fire: (event) => api.target.filter((e) => target.includes(e.uri)).fire(event),
        };
      },
    },
  };

  // Finish up.
  (api as any)._instance = `netbus.${rx.bus.instance(bus).replace(/^bus\./, '')}`;
  return api;
}
