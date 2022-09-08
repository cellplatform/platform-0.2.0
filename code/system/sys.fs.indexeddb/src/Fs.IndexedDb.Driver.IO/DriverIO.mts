import { Delete, Hash, Image, NAME, Path, Stream, t, Wrangle } from '../common/index.mjs';
import { DbLookup, IndexedDb } from '../IndexedDb/index.mjs';

/**
 * A filesystem driver running against the browser's [IndexedDB] store.
 */
export function FsDriverIO(args: { dir: string; db: IDBDatabase }): t.FsDriverIO {
  const { db } = args;
  const dir = Path.ensureSlashes(args.dir);
  const root = dir;
  const lookup = DbLookup(db);

  const resolve = Path.Uri.resolver(dir);
  const unpackUri = Path.Uri.unpacker(dir);

  const driver: t.FsDriverIO = {
    /**
     * Root directory of the file system within the store.
     */
    dir,

    /**
     * Convert the given string to an absolute path.
     */
    resolve,

    /**
     * Retrieve meta-data of a local file.
     */
    async info(input) {
      const { uri, path, location } = unpackUri(input);

      type T = t.FsDriverInfo;
      let kind: T['kind'] = 'unknown';
      let hash: T['hash'] = '';
      let bytes: T['bytes'] = -1;

      const pathLookup = await lookup.path(path);
      if (pathLookup) {
        kind = 'file';
        hash = pathLookup.hash;
        bytes = pathLookup.bytes;
      }

      if (!pathLookup) {
        const dirLookup = await lookup.dir(Path.join(dir, path));
        if (dirLookup) kind = 'dir';
      }

      const exists = kind !== 'unknown';
      return { uri, exists, kind, path, location, hash, bytes };
    },

    /**
     * Read from the local file-system.
     */
    async read(input) {
      const { uri, path, location, withinScope } = unpackUri(input);

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
    async write(address, payload) {
      const params = await Wrangle.io.write(root, address, payload);

      const { unpackError, outOfScope, file, uri } = params;
      if (outOfScope) return outOfScope;
      if (unpackError) return unpackError;

      const { hash, bytes, data, path, location } = file;
      const { dir } = Path.parts(location);

      try {
        if (!path || path === root) throw new Error(`Path out of scope`);

        /**
         * TODO 🐷
         * still storing Image data at root driver level (??)
         */
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
        return params.response200();
      } catch (err: any) {
        return params.response500(err);
      }
    },

    /**
     * Delete from the local file-system.
     */
    async delete(input) {
      const params = await Wrangle.io.delete(root, input);
      const { items, outOfScope } = params;

      if (outOfScope) return outOfScope;

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

        const uris = res.filter(({ removed }) => removed).map(({ uri }) => uri);
        return params.response200(uris);
      } catch (error: any) {
        return params.response500(error);
      }
    },

    /**
     * Copy a file.
     */
    async copy(sourceUri, targetUri) {
      const params = await Wrangle.io.copy(root, sourceUri, targetUri);
      const { source, target, outOfScope } = params;

      if (outOfScope) return outOfScope;

      const createPathReference = async (sourceInfo: t.FsDriverInfo, targetPath: string) => {
        const tx = db.transaction([NAME.STORE.PATHS, NAME.STORE.FILES], 'readwrite');
        const store = tx.objectStore(NAME.STORE.PATHS);
        const { dir } = Path.parts(targetPath);
        const { hash, bytes } = sourceInfo;
        await IndexedDb.record.put<t.PathRecord>(store, { path: targetPath, dir, hash, bytes });
      };

      try {
        const info = await driver.info(source.uri);
        if (info.exists) {
          await createPathReference(info, target.path);
          return params.response200();
        } else {
          return params.response404();
        }
      } catch (error: any) {
        return params.response500(error);
      }
    },
  };

  return driver;
}
