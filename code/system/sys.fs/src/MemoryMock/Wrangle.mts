import { t, Path } from './common.mjs';

type DirString = string;

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

      const params = {
        items,
        parts: { uris, locations, paths },

        get outOfScope() {
          const invalids = items.filter((item) => !item.withinScope);
          const length = invalids.length;
          if (length === 0) return undefined;

          const path = invalids.map((item) => item.rawpath).join('; ');
          const error: t.FsError = { code: 'fs:delete', message: 'Path out of scope', path };
          const response: t.FsDriverDelete = { ok: false, status: 422, uris, locations, error };

          return response;
        },

        response200(removedUris: string[]) {
          const removed = items.filter(({ uri }) => removedUris.includes(uri));
          const uris = removed.map(({ uri }) => uri);
          const locations = removed.map(({ location }) => location);
          return { ok: true, status: 200, uris, locations };
        },

        response500(err: Error): t.FsDriverDelete {
          const error: t.FsError = {
            code: 'fs:delete',
            message: `Failed to delete [${uris.join('; ')}]. ${err.message}`,
            path: paths.join('; '),
          };
          return { ok: false, status: 500, uris, locations, error };
        },
      };

      return params;
    },
  },
};
