import { t, Stream, Hash } from './common/index.mjs';
import { Path } from './Path/index.mjs';

type DirString = string;
type UriString = string;

/**
 * Helpers for wrangling method input values to a Filesystem Driver
 * implementation in a consistent manner.
 */
export const Wrangle = {
  io: {
    /**
     * Write
     */
    async write(root: DirString, address: UriString, payload: Uint8Array | ReadableStream) {
      if (payload === undefined) throw new Error('No data');

      const unpackUri = Path.Uri.unpacker(root);

      const { uri, path, location, withinScope, error: unpackError } = unpackUri(address);

      // const e = unpack.error

      const toError = (msg?: string): t.FsError => {
        return {
          code: 'fs:write',
          message: `Failed to write [${uri}]. ${msg}`.trim(),
          path,
        };
      };

      const isStream = Stream.isReadableStream(payload);
      const data = (isStream ? await Stream.toUint8Array(payload) : payload) as Uint8Array;

      const hash = Hash.sha256(data);
      const bytes = data.byteLength;
      const file: t.FsDriverFileData = { path, location, hash, bytes, data };

      return {
        uri,
        file,
        toError,

        get unpackError(): t.FsDriverWrite | undefined {
          if (!unpackError) return undefined;
          return { ok: false, status: 500, uri, file, error: toError(unpackError) };
        },

        get outOfScope(): t.FsDriverWrite | undefined {
          if (withinScope) return undefined;
          return { uri, ok: false, status: 422, file, error: toError(`Path out of scope`) };
        },

        response200(): t.FsDriverWrite {
          return { uri, ok: true, status: 200, file };
        },

        response500(err: Error): t.FsDriverWrite {
          const error = toError(err.message);
          return { ok: false, status: 500, uri, file, error };
        },
      };
    },

    /**
     * Delete
     */
    async delete(root: DirString, input: string | string[]) {
      const unpackUri = Path.Uri.unpacker(root);

      const inputs = Array.isArray(input) ? input : [input];
      const items = inputs.map((input) => unpackUri(input));

      const uris = items.map(({ uri }) => uri);
      const locations = items.map(({ location }) => location);
      const paths = items.map(({ path }) => path);

      const toError = (path: string, msg?: string): t.FsError => {
        return {
          code: 'fs:delete',
          message: `Failed to delete [${uris.join('; ')}]. ${msg}`.trim(),
          path,
        };
      };

      return {
        items,
        parts: { uris, locations, paths },

        get outOfScope(): t.FsDriverDelete | undefined {
          const invalids = items.filter((item) => !item.withinScope);
          const length = invalids.length;
          if (length === 0) return undefined;

          const path = invalids.map((item) => item.rawpath).join('; ');
          const error = toError(path, 'Path out of scope');
          const response: t.FsDriverDelete = { ok: false, status: 422, uris, locations, error };

          return response;
        },

        response200(removedUris: string[]): t.FsDriverDelete {
          const removed = items.filter(({ uri }) => removedUris.includes(uri));
          const uris = removed.map(({ uri }) => uri);
          const locations = removed.map(({ location }) => location);
          return { ok: true, status: 200, uris, locations };
        },

        response500(err: Error): t.FsDriverDelete {
          const error = toError(paths.join('; '), err.message);
          return { ok: false, status: 500, uris, locations, error };
        },
      };
    },

    /**
     * Copy
     */
    async copy(root: DirString, sourceUri: UriString, targetUri: UriString) {
      const unpackUri = Path.Uri.unpacker(root);
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

      return {
        done,
        source,
        target,
        toError,

        get outOfScope(): t.FsDriverCopy | undefined {
          if (!source.withinScope) {
            return done(422, toError(source.rawpath, 'Source path out of scope'));
          }
          if (!target.withinScope) {
            return done(422, toError(target.rawpath, 'Target path out of scope'));
          }
          return undefined;
        },

        response200(): t.FsDriverCopy {
          return done(200);
        },

        response404(): t.FsDriverCopy {
          const error = toError(source.rawpath, 'Source file not found');
          return done(404, error);
        },

        response500(err: Error): t.FsDriverCopy {
          const error = toError(target.path, err.message);
          return done(500, error);
        },
      };
    },
  },
};
