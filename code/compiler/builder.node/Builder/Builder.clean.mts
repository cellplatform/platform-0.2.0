import { fs, type t } from '../common/index.mjs';
import { Paths } from '../Paths.mjs';

/**
 * Clean a module of transient build artifacts and temporary data.
 */
export async function clean(dir: t.DirString) {
  dir = fs.resolve(dir);
  await fs.remove(fs.join(dir, Paths.outDir.root));
  await fs.remove(fs.join(dir, Paths.types.dirname));
  await fs.remove(fs.join(dir, Paths.tmpBuilderDir));
  await fs.remove(fs.join(dir, 'tmp'));
}
