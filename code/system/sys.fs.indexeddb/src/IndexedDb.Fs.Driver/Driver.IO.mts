import { Delete, NAME, Path, t, Wrangle } from '../common';
import { DbLookup, IndexedDb } from '../IndexedDb';

type DirPath = string;

/**
 * A filesystem I/O driver running against the browser's [IndexedDB] store.
 */
export function FsIO(args: { dir: DirPath; db: IDBDatabase }): t.FsIO {
  const { db } = args;
  const root = Path.ensureSlashes(args.dir);
  const lookup = DbLookup(db);

  const driver: t.FsIO = {
    dir: root,
    resolve: Path.Uri.resolver(root),

    /**
     * Retrieve meta-data of a local file.
     */
    async info(address) {
      const params = await Wrangle.io.info(root, address);
      const { uri, path, location, error } = params;
      if (error) return error;

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
        const dirLookup = await lookup.dir(Path.join(root, path));
        if (dirLookup) kind = 'dir';
      }

      const exists = kind !== 'unknown';
      return { uri, exists, kind, path, location, hash, bytes };
    },

    /**
     * Read from the local file-system.
     */
    async read(address) {
      const params = await Wrangle.io.read(root, address);
      const { error, path, location } = params;
      if (error) return error;

      const tx = db.transaction([NAME.STORE.PATHS, NAME.STORE.FILES], 'readonly');
      const store = {
        paths: tx.objectStore(NAME.STORE.PATHS),
        files: tx.objectStore(NAME.STORE.FILES),
      };

      const get = IndexedDb.Record.get;
      const hash = (await get<t.PathRecord>(store.paths, path))?.hash || '';
      const data = hash ? (await get<t.BinaryRecord>(store.files, hash))?.data : undefined;
      const bytes = data ? data.byteLength : -1;

      if (!hash || !data) return params.response404();
      return params.response200({ path, location, data, hash, bytes });
    },

    /**
     * Write to the local file-system.
     */
    async write(address, payload) {
      const params = await Wrangle.io.write(root, address, payload);
      const { error, file, uri } = params;
      if (error) return error;

      const { hash, bytes, data, path, location } = file;
      const { dir } = Path.parts(location);

      try {
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

        const put = IndexedDb.Record.put;
        await Promise.all([
          put<t.PathRecord>(store.paths, Delete.undefined({ path, dir, hash, bytes })),
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
      const { items, error } = params;
      if (error) return error;

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
        const pathRecord = await IndexedDb.Record.get<t.PathRecord>(store.paths, path);
        if (!pathRecord) return false;

        // Determine if the file (hash) is referenced by any other paths.
        const hash = pathRecord.hash;
        const hashRefs = await IndexedDb.Record.getAll<t.PathRecord>(index.hash, [hash]);
        const isLastRef = hashRefs.filter((item) => item.path !== path).length === 0;

        // Delete the [Path] meta-data record.
        await IndexedDb.Record.delete<t.PathRecord>(store.paths, path);

        // Delete the file-data if there are no other path's referencing the file.
        if (isLastRef) await IndexedDb.Record.delete<t.BinaryRecord>(store.files, hash);

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
      const { source, target, error } = params;
      if (error) return error;

      const createPathReference = async (sourceInfo: t.FsDriverInfo, targetPath: string) => {
        const tx = db.transaction([NAME.STORE.PATHS, NAME.STORE.FILES], 'readwrite');
        const store = tx.objectStore(NAME.STORE.PATHS);
        const { dir } = Path.parts(targetPath);
        const { hash, bytes } = sourceInfo;
        await IndexedDb.Record.put<t.PathRecord>(store, { path: targetPath, dir, hash, bytes });
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
