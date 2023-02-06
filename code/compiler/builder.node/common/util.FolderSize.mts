import { fs } from './fs.mjs';
import { prettybytes } from './libs.mjs';

/**
 * Calculate the size of a folder
 */
export async function folderSize(dir: string, options: { dot?: boolean } = {}) {
  type P = { path: string; bytes: number };
  const sum = (list: P[]) => list.reduce((acc, next) => acc + next.bytes, 0);

  const pathnames = await fs.glob(fs.join(dir, '**/*'), { nodir: true, dot: options.dot });
  const paths: P[] = await Promise.all(
    pathnames.map(async (path) => {
      const bytes = (await fs.stat(path)).size;
      return { path, bytes };
    }),
  );

  const api = {
    dir,
    paths,
    bytes: sum(paths),
    length: paths.length,
    filter(fn: (item: P) => boolean) {
      const paths = api.paths.filter(fn);
      const bytes = sum(paths);
      const length = paths.length;
      return { paths, bytes, length, toString: () => prettybytes(bytes) };
    },
    toString: () => prettybytes(api.bytes),
  };
  return api;
}
