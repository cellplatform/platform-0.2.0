import { t } from '../common/index.mjs';
import { Path, PathUri } from '../Path/index.mjs';

type O = t.IFsResolveOptionsLocal;

/**
 * Generates a resolver function.
 *
 * NOTE:
 *    Implemented here in general [cell.fs] because the local resolver
 *    is used in multiple "local" implementations (node-js, IndexedDb).
 */
export function FsDriverLocalResolver(args: { dir: string }): t.FsPathResolver<O> {
  const { dir } = args;

  const fn: t.FsPathResolver<O> = (
    address: string,
    options?: t.IFsResolveOptionsLocal,
  ): t.IFsLocation => {
    const type = options?.type ?? 'DEFAULT';
    const uri = (address ?? '').trim();

    if (type !== 'DEFAULT') {
      const err = `Local file-system resolve only supports "DEFAULT" operation.`;
      throw new Error(err);
    }

    return {
      path: resolve(dir, uri),
      props: {}, // NB: only relevant for S3 (pre-signed POST).
    };
  };

  return fn;
}

/**
 * [Helpers]
 */

function resolve(dir: string, uri: string) {
  const ensureScope = (result: string) => {
    if (!result.startsWith(dir))
      throw new Error(`Resulting path is not within scope of root directory.`);
    return result;
  };

  if (PathUri.is(uri)) {
    return ensureScope(Path.join(dir, PathUri.path(uri) ?? ''));
  }

  throw new Error(`Invalid URI. Must be "path:..". Value: "${uri}"`);
}
