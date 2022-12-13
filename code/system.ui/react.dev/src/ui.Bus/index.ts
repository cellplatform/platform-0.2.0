import { BusEvents as Events } from './Bus.Events.mjs';
import { BusController as Controller } from './Bus.Controller.mjs';
import { DEFAULT } from './DEFAULT.mjs';
import { t, Is } from './common';

export * from './Bus.Events.mjs';

export const DevBus = {
  DEFAULT,
  Controller,
  Events,

  async withEvents(instance: t.DevInstance, handler: (events: t.DevEvents) => any) {
    const events = DevBus.Events({ instance });
    const res = handler(events);
    if (Is.promise(res)) await res;
    events.dispose();
  },
};
