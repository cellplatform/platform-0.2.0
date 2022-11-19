import { t, Is } from './common.mjs';
import { BusEvents as Events } from './BusEvents.mjs';
import { BusController as Controller } from './BusController.mjs';
import { useStateEvents as useState } from './useStateEvents.mjs';

export * from './BusEvents.mjs';

type F = (events: t.StateEvents) => any | Promise<any>;

export const StateBus = {
  Events,
  Controller,
  useState,

  /**
   * Helper for one-off interactions with the [Bus.Events] API.
   */
  async withEvents(instance: t.Instance, fn: F) {
    const events = Events({ instance });
    const res = fn(events);
    if (Is.promise(res)) await res;
    events.dispose();
  },
};
