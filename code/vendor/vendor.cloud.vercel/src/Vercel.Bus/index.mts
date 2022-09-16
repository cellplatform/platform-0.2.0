import { BusEvents as Events } from './BusEvents.mjs';
import { BusController as Controller } from './BusController.mjs';

export { BusEvents } from './BusEvents.mjs';
export { BusController } from './BusController.mjs';

export const VercelBus = {
  Events,
  Controller,
};
