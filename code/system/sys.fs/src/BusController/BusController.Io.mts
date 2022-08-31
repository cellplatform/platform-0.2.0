import { asArray, t, Path } from './common.mjs';

type FilesystemId = string;
type Error = t.SysFsError;
type MaybeError = Error | undefined;
type FilePath = string;

/**
 * Event controller.
 */
export function BusControllerIo(args: {
  id: FilesystemId;
  bus: t.EventBus<t.SysFsEvent>;
  driver: t.FsDriver;
  events: t.SysFsEvents;
}) {
  const { id, driver, bus, events } = args;

  const root = Path.ensureSlashStart(driver.dir);
  const stripDirRoot = (path: FilePath) => {
    path = Path.Uri.trimPrefix(path);
    path = Path.ensureSlashStart(path);
    path = path.startsWith(root) ? path.substring(root.length) : path;
    return Path.ensureSlashStart(path);
  };

  const getFileInfo = async (filepath: FilePath): Promise<t.SysFsPathInfo> => {
    try {
      filepath = Path.trimSlashesEnd(filepath);
      const uri = Path.Uri.ensurePrefix(filepath);
      const res = await driver.info(uri);
      const { kind, exists, hash, bytes } = res;

      let path = stripDirRoot(res.path);
      if (kind === 'dir') path = `${path}/`;

      return { kind, path, exists, hash, bytes };
    } catch (err: any) {
      const error: t.SysFsError = { code: 'info', message: err.message };
      return { kind: 'unknown', path: filepath, exists: false, hash: '', bytes: -1, error };
    }
  };

  const readFile = async (path: string): Promise<t.SysFsFileReadResponse> => {
    const address = Path.Uri.ensurePrefix(path);
    path = stripDirRoot(path);

    const info = await driver.info(address);
    if (!info.exists) {
      const error: Error = { code: 'read/404', message: `File not found`, path };
      return { error };
    }

    const res = await driver.read(address);

    if (res.error) {
      const error: Error = { code: 'read', message: res.error.message, path };
      return { error };
    }

    if (!res.file) {
      const error: Error = { code: 'read/404', message: `File not found`, path };
      return { error };
    }

    const { hash, data } = res.file;

    return {
      file: { path: res.file.path, data, hash },
    };
  };

  const writeFile = async (file: t.SysFsFile): Promise<t.SysFsFileWriteResponse> => {
    const { hash, data } = file;
    const address = Path.Uri.ensurePrefix(file.path);
    const res = await driver.write(address, data);
    const error: MaybeError = res.error ? { code: 'write', message: res.error.message } : undefined;
    const path = stripDirRoot(res.file.path);
    return { path, hash, error };
  };

  const copyFile = async (file: t.SysFsFileTarget): Promise<t.SysFsFileCopyResponse> => {
    const source = Path.Uri.ensurePrefix(file.source);
    const target = Path.Uri.ensurePrefix(file.target);
    const res = await driver.copy(source, target);
    const info = await driver.info(target);
    const error: MaybeError = res.error ? { code: 'copy', message: res.error.message } : undefined;
    return {
      source: stripDirRoot(file.source),
      target: stripDirRoot(file.target),
      hash: info.hash,
      error,
    };
  };

  const deleteFile = async (filepath: FilePath): Promise<t.SysFsFileDeleteResponse> => {
    const address = Path.Uri.ensurePrefix(filepath);
    const info = await driver.info(address);
    const res = await driver.delete(address);

    const error: MaybeError = res.error
      ? { code: 'delete', message: res.error.message }
      : undefined;

    return {
      path: stripDirRoot(filepath),
      hash: info.hash,
      existed: res.locations.length > 0,
      error,
    };
  };

  const moveFile = async (file: t.SysFsFileTarget): Promise<t.SysFsFileMoveResponse> => {
    let error: MaybeError;
    let hash = '';

    if (!error) {
      const res = await copyFile(file);
      hash = res.hash;
      if (res.error) error = res.error;
    }

    if (!error) {
      const res = await deleteFile(file.source);
      if (res.error) error = res.error;
    }

    return {
      source: stripDirRoot(file.source),
      target: stripDirRoot(file.target),
      hash,
      error,
    };
  };

  /**
   * IO: Info
   */
  events.io.info.req$.subscribe(async (e) => {
    const { tx } = e;
    const info: t.SysFsInfo = { id, dir: root };
    const paths = asArray(e.path ?? []);
    const files = await Promise.all(paths.map(getFileInfo));
    bus.fire({
      type: 'sys.fs/info:res',
      payload: { tx, id, fs: info, paths: files },
    });
  });

  /**
   * IO: Read
   */
  events.io.read.req$.subscribe(async (e) => {
    const { tx } = e;
    const files = await Promise.all(asArray(e.path).map(readFile));
    const error: MaybeError = files.some((file) => Boolean(file.error))
      ? { code: 'read', message: 'Failed while reading' }
      : undefined;

    bus.fire({
      type: 'sys.fs/read:res',
      payload: { tx, id, files, error },
    });
  });

  /**
   * IO: Write
   */
  events.io.write.req$.subscribe(async (e) => {
    const { tx } = e;
    const files = await Promise.all(asArray(e.file).map(writeFile));
    const error: MaybeError = files.some((file) => Boolean(file.error))
      ? { code: 'write', message: 'Failed while writing' }
      : undefined;

    bus.fire({
      type: 'sys.fs/write:res',
      payload: { tx, id, files, error },
    });
  });

  /**
   * IO: Delete
   */
  events.io.delete.req$.subscribe(async (e) => {
    const { tx } = e;
    const files = await Promise.all(asArray(e.path).map(deleteFile));
    const error: MaybeError = files.some((file) => Boolean(file.error))
      ? { code: 'delete', message: 'Failed while deleting' }
      : undefined;

    bus.fire({
      type: 'sys.fs/delete:res',
      payload: { tx, id, files, error },
    });
  });

  /**
   * IO: Copy
   */
  events.io.copy.req$.subscribe(async (e) => {
    const { tx } = e;
    const files = await Promise.all(asArray(e.file).map((e) => copyFile(e)));
    const error: MaybeError = files.some((file) => Boolean(file.error))
      ? { code: 'copy', message: 'Failed while copying' }
      : undefined;

    bus.fire({
      type: 'sys.fs/copy:res',
      payload: { tx, id, files, error },
    });
  });

  /**
   * IO: Move
   */
  events.io.move.req$.subscribe(async (e) => {
    const { tx } = e;
    const files = await Promise.all(asArray(e.file).map(moveFile));
    const error: MaybeError = files.some((file) => Boolean(file.error))
      ? { code: 'move', message: 'Failed while moving' }
      : undefined;

    bus.fire({
      type: 'sys.fs/move:res',
      payload: { tx, id, files, error },
    });
  });
}
