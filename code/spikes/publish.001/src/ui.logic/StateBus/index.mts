import { t, Is } from './common.mjs';
import { BusEvents as Events } from './BusEvents.mjs';
import { BusController as Controller } from './BusController.mjs';
import { useEvents } from './useEvents.mjs';

export * from './BusEvents.mjs';

type F = (events: t.StateEvents) => any | Promise<any>;

export const StateBus = {
  Events,
  Controller,
  useEvents,

  /**
   * Helper for one-off interactions with the [Bus.Events] API.
   */
  async fire(instance: t.StateInstance, fn: F) {
    const events = Events({ instance });
    const res = fn(events);
    if (Is.promise(res)) await res;
    events.dispose();
  },
};
