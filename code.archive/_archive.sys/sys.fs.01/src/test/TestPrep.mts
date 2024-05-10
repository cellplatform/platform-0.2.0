import { BusController, MemoryMock, Path, rx, slug, t } from './common';

/**
 * Setup a mock FS driver and Controller.
 */
export const TestPrep = (options: { dir?: string; id?: string } = {}) => {
  const { dir = MemoryMock.DEFAULT.rootdir, id = `foo.${slug()}` } = options;
  const { mocks, driver } = MemoryMock.create(dir);

  const bus = rx.bus<t.FsBusEvent>();
  const controller = BusController({ id, bus, driver });
  const events = controller.events;
  const { dispose } = events;

  const fileExists = async (path: string) => {
    const uri = Path.Uri.ensureUriPrefix(path);
    const read = await driver.io.read(uri);
    return Boolean(read.file);
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
  } as const;
};
