import { Delete, Hash, Image, NAME, Path, Stream, t } from '../common/index.mjs';
import { DbLookup, IndexedDb } from '../IndexedDb/index.mjs';

/**
 * A filesystem driver running against the browser's [IndexedDB] store.
 */
export function FsDriverIO(args: { dir: string; db: IDBDatabase }): t.FsDriverIO {
  const { db } = args;
  const dir = args.dir.trim();

  const root = dir;
  const lookup = DbLookup(db);

  const resolve = Path.Uri.resolver(dir);
  const unpackUri = Path.Uri.unpacker(dir);

  const driver: t.FsDriverIO = {
    /**
     * Root directory of the file system.
     */
    dir,

    /**
     * Convert the given string to an absolute path.
     */
    resolve,

    /**
     * Retrieve meta-data of a local file.
     */
    async info(address) {
      const { uri, path, location } = unpackUri(address);

      type T = t.FsDriverInfo;
      let kind: T['kind'] = 'unknown';
      let hash: T['hash'] = '';
      let bytes: T['bytes'] = -1;

      const pathRes = await lookup.path(path);
      if (pathRes) {
        kind = 'file';
        hash = pathRes.hash;
        bytes = pathRes.bytes;
      }

      if (!pathRes) {
        const dirRes = await lookup.dir(path);
        if (dirRes) kind = 'dir';
      }

      const exists = kind !== 'unknown';
      return { uri, exists, kind, path, location, hash, bytes };
    },

    /**
     * Read from the local file-system.
     */
    async read(address) {
      const { uri, path, location, withinScope } = unpackUri(address);

      const toError = (message: string): t.FsError => ({ code: 'fs:read', message, path });
      if (!withinScope) return { uri, ok: false, status: 422, error: toError(`Path out of scope`) };

      const tx = db.transaction([NAME.STORE.PATHS, NAME.STORE.FILES], 'readonly');
      const store = {
        paths: tx.objectStore(NAME.STORE.PATHS),
        files: tx.objectStore(NAME.STORE.FILES),
      };

      const get = IndexedDb.record.get;
      const hash = (await get<t.PathRecord>(store.paths, path))?.hash || '';
      const data = hash ? (await get<t.BinaryRecord>(store.files, hash))?.data : undefined;
      const bytes = data ? data.byteLength : -1;

      let status = 200;
      let error: t.FsError | undefined;
      if (!hash || !data) {
        status = 404;
        error = toError('Not found');
      }
      const file = !data ? undefined : { path, location, data, hash, bytes };
      const ok = status.toString().startsWith('2');
      return { uri, ok, status, file, error };
    },

    /**
     * Write to the local file-system.
     */
    async write(address, input) {
      if (input === undefined) throw new Error(`No data`);

      const toError = (path: string, msg: string): t.FsError => {
        const message = `Failed to write [${uri}]. ${msg}`;
        return { code: 'fs:write', message, path };
      };

      const unpack = unpackUri(address);
      const { uri, path, location, withinScope } = unpack;
      const { dir } = Path.parts(path);

      const isStream = Stream.isReadableStream(input);
      const data = (isStream ? await Stream.toUint8Array(input) : input) as Uint8Array;

      const hash = Hash.sha256(data);
      const bytes = data.byteLength;
      const file = { path, location, hash, data, bytes };

      if (!withinScope) {
        return { uri, ok: false, status: 422, file, error: toError(path, `Path out of scope`) };
      }

      if (unpack.error) {
        return { ok: false, status: 500, uri, file, error: toError(path, unpack.error) };
      }

      try {
        if (!path || path === root) throw new Error(`Path out of scope`);
        const image = await Image.toInfo(path, data);

        // Delete existing.
        // NB:  This ensures the hash-referenced file-record is removed if
        //      this are no other paths referencing the file-hash.
        await driver.delete(uri);

        // Perform write.
        const tx = db.transaction([NAME.STORE.PATHS, NAME.STORE.FILES], 'readwrite');
        const store = {
          paths: tx.objectStore(NAME.STORE.PATHS),
          files: tx.objectStore(NAME.STORE.FILES),
        };

        const put = IndexedDb.record.put;
        await Promise.all([
          put<t.PathRecord>(store.paths, Delete.undefined({ path, dir, hash, bytes, image })),
          put<t.BinaryRecord>(store.files, { hash, data }),
        ]);

        // Finish up.
        return { uri, ok: true, status: 200, file };
      } catch (err: any) {
        const error = toError(path, err.message);
        return { ok: false, status: 500, uri, file, error };
      }
    },

    /**
     * Delete from the local file-system.
     */
    async delete(input) {
      const inputs = Array.isArray(input) ? input : [input];
      const items = inputs.map((input) => unpackUri(input));
      const uris = items.map(({ uri }) => uri);
      const locations = items.map(({ location }) => location);
      const paths = items.map(({ path }) => path);
      const outOfScope = items.filter((item) => !item.withinScope);

      if (outOfScope.length > 0) {
        const path = outOfScope.map((item) => item.rawpath).join('; ');
        const error: t.FsError = { code: 'fs:delete', message: 'Path out of scope', path };
        return { ok: false, status: 422, uris, locations, error };
      }

      const tx = db.transaction([NAME.STORE.PATHS, NAME.STORE.FILES], 'readwrite');
      const store = {
        paths: tx.objectStore(NAME.STORE.PATHS),
        files: tx.objectStore(NAME.STORE.FILES),
      };
      const index = {
        hash: store.paths.index(NAME.INDEX.HASH),
      };

      const remove = async (path: string) => {
        // Lookup the [Path] meta-data record.
        const pathRecord = await IndexedDb.record.get<t.PathRecord>(store.paths, path);
        if (!pathRecord) return false;

        // Determine if the file (hash) is referenced by any other paths.
        const hash = pathRecord.hash;
        const hashRefs = await IndexedDb.record.getAll<t.PathRecord>(index.hash, [hash]);
        const isLastRef = hashRefs.filter((item) => item.path !== path).length === 0;

        // Delete the [Path] meta-data record.
        await IndexedDb.record.delete<t.PathRecord>(store.paths, path);

        // Delete the file-data if there are no other path's referencing the file.
        if (isLastRef) await IndexedDb.record.delete<t.BinaryRecord>(store.files, hash);

        return true;
      };

      try {
        const res = await Promise.all(
          items.map(async (item) => {
            return { ...item, removed: await remove(item.path) };
          }),
        );

        const uris = res.filter((item) => item.removed).map(({ uri }) => uri);
        const locations = res.filter((item) => item.removed).map(({ location }) => location);

        return { ok: true, status: 200, uris, locations };
      } catch (err: any) {
        const error: t.FsError = {
          code: 'fs:delete',
          message: `Failed to delete [${uris.join('; ')}]. ${err.message}`,
          path: paths.join('; '),
        };
        return { ok: false, status: 500, uris, locations, error };
      }
    },

    /**
     * Copy a file.
     */
    async copy(sourceUri, targetUri) {
      const source = unpackUri(sourceUri);
      const target = unpackUri(targetUri);

      const toError = (path: string, msg?: string): t.FsError => {
        const message = `Failed to copy from [${source.uri}] to [${target.uri}]. ${msg}`.trim();
        return { code: 'fs:copy', message, path };
      };

      const done = (status: number, error?: t.FsError): t.FsDriverCopy => {
        const ok = status.toString().startsWith('2');
        return { ok, status, source: source.uri, target: target.uri, error };
      };

      if (!source.withinScope) {
        const error = toError(source.rawpath, 'Source path out of scope');
        return done(422, error);
      }

      if (!target.withinScope) {
        const error = toError(target.rawpath, 'Target path out of scope');
        return done(422, error);
      }

      const createPathReference = async (sourceInfo: t.FsDriverInfo, targetPath: string) => {
        const tx = db.transaction([NAME.STORE.PATHS, NAME.STORE.FILES], 'readwrite');
        const store = tx.objectStore(NAME.STORE.PATHS);
        const { dir } = Path.parts(targetPath);
        const { hash, bytes } = sourceInfo;
        await IndexedDb.record.put<t.PathRecord>(store, { path: targetPath, dir, hash, bytes });
      };

      try {
        const info = await driver.info(source.uri);

        if (!info.exists) {
          const error = toError(source.rawpath, 'Source file not found');
          return done(404, error);
        }

        await createPathReference(info, target.path);
        return done(200);
      } catch (err: any) {
        const error = toError(target.path, err.message);
        return done(500, error);
      }
    },
  };

  return driver;
}
