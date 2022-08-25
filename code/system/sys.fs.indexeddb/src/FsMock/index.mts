import { MockFsDriver } from './Mock.FsDriver.mjs';
import { MockBusController } from './Mock.BusController.mjs';

export { MockFsDriver, MockBusController };

export const Mock = {
  BusController: MockBusController,
  FsDriver: MockFsDriver,
};
