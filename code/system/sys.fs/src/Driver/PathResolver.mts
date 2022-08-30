import { t, Path } from './common.mjs';

/**
 * Generates a resolver function.
 */
export function PathResolverFactory(args: { dir: string }): t.FsPathResolver {
  if (!(args.dir ?? '').trim()) throw new Error(`Path resolver must have root directory`);
  const dir = Path.ensureSlashStart(args.dir ?? '');

  const fn: t.FsPathResolver = (address: string): t.IFsLocation => {
    const uri = (address ?? '').trim();
    const path = resolve(dir, uri);
    return { path };
  };

  return fn;
}

/**
 * [Helpers]
 */

function resolve(dir: string, uri: string) {
  const ensureScope = (result: string) => {
    if (!result.startsWith(dir)) {
      throw new Error(`Resulting path is not within scope of the root directory`);
    }
    return result;
  };

  if (Path.Uri.is(uri)) {
    return ensureScope(Path.join(dir, Path.Uri.path(uri) ?? ''));
  }

  throw new Error(`Invalid URI. Must be "path:..". Value: "${uri}"`);
}
