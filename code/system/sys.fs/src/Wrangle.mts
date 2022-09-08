import { t } from './common/index.mjs';
import { Path } from './Path/index.mjs';

type DirString = string;
type UriString = string;

/**
 * Helpers for wrangling method input values in a consistent manner.
 */
export const Wrangle = {
  io: {
    delete(root: DirString, input: string | string[]) {
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

    copy(root: DirString, sourceUri: UriString, targetUri: UriString) {
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
