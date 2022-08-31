import { t, slug, rx } from '../common/index.mjs';
import { FsMock, DEFAULT } from '../Mock/index.mjs';
import { BusController } from '../BusController/index.mjs';
import { Path } from '../Path/index.mjs';

/**
 * Setup a mock FS driver and Controller.
 */
export const TestPrep = (options: { dir?: string; id?: string } = {}) => {
  const { dir = DEFAULT.ROOT_DIR, id = `foo.${slug()}` } = options;

  const mocks = {
    driver: FsMock.Driver({ dir }),
    indexer: FsMock.Indexer({ dir }).onManifest((e) => {
      const state = mocks.driver.state;
      Object.keys(state).forEach((uri) => {
        const path = Path.ensureSlashStart(Path.Uri.trimPrefix(uri));
        e.addFile(path, state[uri].data);
      });
    }),
  };
  const driver = mocks.driver.driver;
  const indexer = mocks.indexer.indexer;

  const bus = rx.bus<t.SysFsEvent>();
  const controller = BusController({ id, driver, bus, indexer });

  const events = controller.events;
  const { dispose } = events;
  const fileExists = async (path: string) => Boolean((await driver.read(path)).file);

  return {
    dir,
    bus,
    controller,
    events,
    driver,
    indexer,
    mocks,
    fileExists,
    dispose,
  };
};
