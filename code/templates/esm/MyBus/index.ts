import { BusEvents as Events } from './BusEvents.mjs';
import { BusController as Controller } from './BusController.mjs';

export * from './BusEvents.mjs';

export const MyBus = {
  Events,
  Controller,
};
