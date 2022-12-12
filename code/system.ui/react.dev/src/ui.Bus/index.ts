import { BusEvents as Events } from './Bus.Events.mjs';
import { BusController as Controller } from './Bus.Controller.mjs';
import { DEFAULT } from './DEFAULT.mjs';

export * from './Bus.Events.mjs';

export const DevBus = {
  Events,
  Controller,
  DEFAULT,
};
