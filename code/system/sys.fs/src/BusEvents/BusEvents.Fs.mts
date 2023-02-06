import { Hash, Path, t, Json } from './common';

/**
 * High level [Fs] interface for programming against the filesystem.
 */
export function BusEventsFs(args: {
  dir?: string; // Sub-directory within root.
  index: t.FsBusEventsIndex;
  io: t.FsBusEventsIo;
  toUint8Array: t.FsBusToUint8Array;
}): t.Fs {
  const { io, index, toUint8Array } = args;

  // Paths.
  const subdir = Path.trimSlashes(Path.trim(args.dir) ?? '');
  const { join } = Path;
  const formatPath = (path: string) => {
    path = Path.trim(path);
    path = Path.Uri.trimUriPrefix(path);
    path = Path.join(subdir, path);
    path = Path.trimSlashesStart(path);
    return path;
  };

  /**
   * Information about a filesystem object.
   */
  const info: t.Fs['info'] = async (path) => {
    const unknown: t.FsFileInfo = { kind: 'unknown', path, exists: false, hash: '', bytes: -1 };
    if (typeof path !== 'string') return unknown;

    path = formatPath(path);
    const res = await io.info.get({ path });
    if (res.error) {
      throw new Error(res.error.message);
    }

    path = subdir ? path.substring(subdir.length + 1) : path;
    const file = res.paths[0];
    if (!file) {
      return unknown;
    }

    const { kind, hash, bytes } = file;
    const exists = Boolean(file.exists);
    return { kind, exists, hash, bytes, path };
  };

  const is: t.Fs['is'] = {
    file: async (path) => (await info(path)).kind === 'file',
    dir: async (path) => (await info(path)).kind === 'dir',
  };

  /**
   * Determine if file/directory exists.
   */
  const exists: t.Fs['exists'] = async (path) => {
    return (await info(path)).exists;
  };

  /**
   * Read a file.
   */
  const read: t.Fs['read'] = async (path) => {
    path = formatPath(path);

    const uri = Path.Uri.ensureUriPrefix(path);
    const res = await io.read.get(uri);
    const files = res.files ?? [];
    const first = files[0];

    if (first?.error?.code === 'fs:read/404') return undefined;
    if (first?.error) throw new Error(first.error.message);
    if (res.error) throw new Error(res.error.message);

    return first.file?.data ?? undefined;
  };

  /**
   * Write a file.
   */
  const write: t.Fs['write'] = async (path, input) => {
    path = formatPath(path);
    const data = await toUint8Array(input);
    const hash = Hash.sha256(data);

    const res = await io.write.fire({ path, hash, data });
    if (res.error) throw new Error(res.error.message);

    const bytes = data.byteLength;
    return { hash, bytes };
  };

  /**
   * Copy a file.
   */
  const copy: t.Fs['copy'] = async (source, target) => {
    source = formatPath(source);
    target = formatPath(target);
    const res = await io.copy.fire({ source, target });
    if (res.error) {
      throw new Error(res.error.message);
    }
  };

  /**
   * Move a file (copy + delete).
   */
  const move: t.Fs['move'] = async (source, target) => {
    source = formatPath(source);
    target = formatPath(target);
    const res = await io.move.fire({ source, target });
    if (res.error) {
      throw new Error(res.error.message);
    }
  };

  /**
   * Delete a file.
   */
  const del: t.Fs['delete'] = async (path) => {
    path = formatPath(path);
    const res = await io.delete.fire(path);
    if (res.error) {
      throw new Error(res.error.message);
    }
  };

  /**
   * Working with JSON.
   */
  const json: t.Fs['json'] = {
    async read(path) {
      const file = await read(path);
      if (file === undefined) return undefined;

      try {
        const text = new TextDecoder().decode(file);
        return JSON.parse(text);
      } catch (error: any) {
        throw new Error(`Failed while parsing JSON for file '${path}'. ${error.message}`);
      }
    },

    async write(path, data: t.Json) {
      if (data === undefined) throw new Error(`JSON cannot be undefined`);
      return write(path, Json.stringify(data));
    },
  };

  /**
   * Manifest indexes.
   */
  const manifest: t.Fs['manifest'] = async (options = {}) => {
    const { filter, cache, cachefile } = options;
    const dir = options.dir === undefined ? subdir : formatPath(options.dir);

    // Query the filesystem.
    const res = await index.manifest.get({ dir, cache, cachefile });
    if (res.error) {
      throw new Error(res.error.message);
    }

    // Trim the files of the root sub-directory ("scope").
    const manifest = { ...res.dirs[0]?.manifest };
    if (subdir) {
      manifest.files = manifest.files.map((file) => ({
        ...file,
        path: file.path.substring(subdir.length + 1),
      }));
    }

    // Apply the given filter.
    if (filter) {
      manifest.files = manifest.files.filter((file) => {
        const path = file.path;
        return filter({ path, is: { dir: false, file: true } });
      });
    }

    return manifest;
  };

  /**
   * Scope: child directory.
   */
  const dir: t.Fs['dir'] = (path) => {
    const dir = Path.join(subdir, Path.trimSlashesStart(path));
    return BusEventsFs({ dir, index, io, toUint8Array });
  };

  /**
   * API
   */
  return {
    info,
    exists,
    is,
    join,
    read,
    write,
    copy,
    move,
    delete: del,
    manifest,
    json,
    dir,
  };
}
