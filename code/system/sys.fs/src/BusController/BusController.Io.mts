import { asArray, t, Path } from './common';

type FilePath = string;
type FilesystemId = string;
type MaybeError = t.FsError | undefined;

/**
 * Event controller.
 */
export function BusControllerIo(args: {
  id: FilesystemId;
  bus: t.EventBus<t.FsBusEvent>;
  io: t.FsIO;
  events: t.FsBusEvents;
}) {
  const { id, io, bus, events } = args;

  const root = Path.ensureSlashStart(io.dir);
  const stripDirRoot = (path: FilePath) => {
    path = Path.Uri.trimUriPrefix(path);
    path = Path.ensureSlashStart(path);
    path = path.startsWith(root) ? path.substring(root.length) : path;
    return Path.ensureSlashStart(path);
  };

  const getFileInfo = async (filepath: FilePath): Promise<t.FsBusPathInfo> => {
    try {
      filepath = Path.trimSlashesEnd(filepath);
      const uri = Path.Uri.ensureUriPrefix(filepath);
      const res = await io.info(uri);
      const { kind, exists, hash, bytes } = res;

      let path = stripDirRoot(res.path);
      if (kind === 'dir') path = `${path}/`;

      return { kind, path, exists, hash, bytes };
    } catch (err: any) {
      const path = filepath;
      const message = err.message;
      const error: t.FsError = { code: 'fs:info', message, path };
      return { kind: 'unknown', path: filepath, exists: false, hash: '', bytes: -1, error };
    }
  };

  const readFile = async (path: string): Promise<t.FsBusFileReadResponse> => {
    const address = Path.Uri.ensureUriPrefix(path);
    path = stripDirRoot(path);

    const info = await io.info(address);
    if (!info.exists) {
      const error: t.FsError = { code: 'fs:read/404', message: `File not found`, path };
      return { error };
    }

    const res = await io.read(address);

    if (res.error) {
      const error: t.FsError = { code: 'fs:read', message: res.error.message, path };
      return { error };
    }

    if (!res.file) {
      const error: t.FsError = { code: 'fs:read/404', message: `File not found`, path };
      return { error };
    }

    const { hash, data } = res.file;

    return {
      file: { path: res.file.path, data, hash },
    };
  };

  const writeFile = async (file: t.FsBusFile): Promise<t.FsBusFileWriteResponse> => {
    const { hash, data } = file;
    const path = Path.trim(file.path);

    const toError = (message: string): t.FsError => ({ code: 'fs:write', message, path });
    const done = (err?: string) => {
      return {
        hash,
        path: stripDirRoot(path),
        error: err ? toError(err) : undefined,
      };
    };

    if (!path) return done('No file-path to write to');
    const address = Path.Uri.ensureUriPrefix(path);

    const res = await io.write(address, data);
    return done(res.error?.message);
  };

  const copyFile = async (file: t.FsBusFileTarget): Promise<t.FsBusFileCopyResponse> => {
    const source = Path.Uri.ensureUriPrefix(file.source);
    const target = Path.Uri.ensureUriPrefix(file.target);
    const res = await io.copy(source, target);
    const info = await io.info(target);

    const error: MaybeError = !res.error
      ? undefined
      : { code: 'fs:copy', message: res.error.message, path: file.source };

    return {
      source: stripDirRoot(file.source),
      target: stripDirRoot(file.target),
      hash: info.hash,
      error,
    };
  };

  const deleteFile = async (path: FilePath): Promise<t.FsBusFileDeleteResponse> => {
    const address = Path.Uri.ensureUriPrefix(path);
    const info = await io.info(address);
    const res = await io.delete(address);

    const error: MaybeError = !res.error
      ? undefined
      : { code: 'fs:delete', message: res.error.message, path };

    return {
      path: stripDirRoot(path),
      hash: info.hash,
      existed: res.locations.length > 0,
      error,
    };
  };

  const moveFile = async (file: t.FsBusFileTarget): Promise<t.FsBusFileMoveResponse> => {
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
    const info: t.FsBusInfo = { id, dir: root };
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
    const paths = asArray(e.path);
    const files = await Promise.all(paths.map(readFile));

    const error: MaybeError = !files.some((file) => Boolean(file.error))
      ? undefined
      : {
          code: 'fs:read',
          message: 'Failed while reading',
          path: paths.join('; '),
        };

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
    const error: MaybeError = !files.some((file) => Boolean(file.error))
      ? undefined
      : {
          code: 'fs:read',
          message: 'Failed while writing',
          path: files.map((file) => file.path).join('; '),
        };

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
    const error: MaybeError = !files.some((file) => Boolean(file.error))
      ? undefined
      : {
          code: 'fs:delete',
          message: 'Failed while deleting',
          path: files.map((file) => file.path).join('; '),
        };

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
    const error: MaybeError = !files.some((file) => Boolean(file.error))
      ? undefined
      : {
          code: 'fs:copy',
          message: 'Failed while copying',
          path: files.map((file) => file.source).join('; '),
        };

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
    const error: MaybeError = !files.some((file) => Boolean(file.error))
      ? undefined
      : {
          code: 'fs:move',
          message: 'Failed while moving',
          path: files.map((file) => file.source).join('; '),
        };

    bus.fire({
      type: 'sys.fs/move:res',
      payload: { tx, id, files, error },
    });
  });
}
