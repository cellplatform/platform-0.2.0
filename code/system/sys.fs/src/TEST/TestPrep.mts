import { BusController, MemoryMock, Path, rx, slug, t } from './common.mjs';

const DEFAULT = MemoryMock.DEFAULT;

/**
 * Setup a mock FS driver and Controller.
 */
export const TestPrep = (options: { dir?: string; id?: string } = {}) => {
  const { dir = DEFAULT.rootdir, id = `foo.${slug()}` } = options;
  const { mocks, driver } = MemoryMock.create(dir);

  const bus = rx.bus<t.FsBusEvent>();
  const controller = BusController({ id, driver, bus });
  const events = controller.events;
  const { dispose } = events;

  const fileExists = async (path: string) => {
    const uri = Path.Uri.ensureUriPrefix(path);
    return Boolean((await driver.io.read(uri)).file);
  };

  return {
    dispose,
    dir,
    bus,
    controller,
    events,
    mocks,
    driver,
    fileExists,
  };
};
