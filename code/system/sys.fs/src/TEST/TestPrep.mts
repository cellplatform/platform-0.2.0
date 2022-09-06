import { BusController, MemoryMock, Path, rx, slug, t } from './common.mjs';

const DEFAULT = MemoryMock.DEFAULT;

/**
 * Setup a mock FS driver and Controller.
 */
export const TestPrep = (options: { dir?: string; id?: string } = {}) => {
  const { dir = DEFAULT.ROOT_DIR, id = `foo.${slug()}` } = options;

  const mocks = {
    driver: MemoryMock.IO({ dir }),
    indexer: MemoryMock.Indexer({ dir }).onManifestRequest((e) => {
      const state = mocks.driver.state;
      Object.keys(state).forEach((uri) => {
        const path = Path.ensureSlashStart(Path.Uri.trimUriPrefix(uri));
        e.addFile(path, state[uri].data);
      });
    }),
  };
  const io = mocks.driver.io;
  const indexer = mocks.indexer.indexer;
  const driver: t.FsDriver = { io, indexer };

  const bus = rx.bus<t.FsBusEvent>();
  const controller = BusController({ id, driver, bus });

  const events = controller.events;
  const { dispose } = events;

  const fileExists = async (path: string) => {
    const uri = Path.Uri.ensureUriPrefix(path);
    return Boolean((await io.read(uri)).file);
  };

  return {
    dispose,
    dir,
    bus,
    controller,
    events,
    driver,
    mocks,
    fileExists,
  };
};
