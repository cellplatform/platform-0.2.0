import { DevBusEvents as Events } from './BusEvents.mjs';
import { DevBusController as Controller } from './BusController.mjs';

export * from './BusEvents.mjs';

export const DevBus = {
  Events,
  Controller,
};
