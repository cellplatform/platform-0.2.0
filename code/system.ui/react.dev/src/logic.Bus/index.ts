import { BusEvents as Events } from './Bus.Events.mjs';
import { BusController as Controller } from './Bus.Controller.mjs';
import { t, Is } from './common';

export * from './Bus.Events.mjs';

export const DevBus = {
  Controller,
  Events,

  async withEvents(input: t.DevInstance | t.DevCtx, handler: (events: t.DevEvents) => any) {
    const instance = Is.ctx(input)
      ? (input as t.DevCtx).toObject().instance
      : (input as t.DevInstance);
    const events = DevBus.Events({ instance });
    const res = handler(events);
    if (Is.promise(res)) await res;
    events.dispose();
  },
};
