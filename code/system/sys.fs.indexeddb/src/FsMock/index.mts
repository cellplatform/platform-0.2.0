import { FsMockDriver } from './Mock.FsDriver.mjs';
import { FsMockBusController } from './Mock.BusController.mjs';

export { FsMockDriver, FsMockBusController };

export const FsMock = {
  BusController: FsMockBusController,
  Driver: FsMockDriver,
};
