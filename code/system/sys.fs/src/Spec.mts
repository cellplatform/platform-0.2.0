import { t } from './common/index.mjs';
import { DriverSpec } from './MemoryMock/Mock.Driver.spec.mjs';

export { DriverSpec };

/**
 * Test specification that when passing indicate a fully
 * implemented filesystem driver.
 */
export const Spec = {
  DriverSpec,

  every(factory: t.FsDriverFactory) {
    DriverSpec.every(factory);
  },
};

export default Spec;
