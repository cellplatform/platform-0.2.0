import { BusEvents as Events } from './Bus.Events.mjs';
import { BusController as Controller } from './Bus.Controller.mjs';
import { t, Is, Spec } from './common';

export * from './Bus.Events.mjs';

type InstanceInput = t.DevInstance | t.DevCtx | t.TestHandlerArgs;

export const DevBus = {
  Controller,
  Events,

  events(input: InstanceInput) {
    const instance = Wrangle.instance(input);
    return DevBus.Events({ instance });
  },

  async withEvents(input: InstanceInput, handler: (events: t.DevEvents) => any) {
    const events = DevBus.events(input);
    const res = handler(events);
    if (Is.promise(res)) await res;
    events.dispose();
  },
};

/**
 * Helpers
 */

const Wrangle = {
  instance(input: InstanceInput) {
    if (Is.testArgs(input)) input = Spec.ctx(input as t.TestHandlerArgs);
    if (Is.ctx(input)) return (input as t.DevCtx).toObject().instance;
    return input as t.DevInstance;
  },
};
