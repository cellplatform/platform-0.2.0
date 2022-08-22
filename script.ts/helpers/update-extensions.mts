import { fs, Util, pc } from '../common/index.mjs';

async function update(dir: string) {
  dir = fs.resolve(dir);
  if (!(await fs.pathExists(dir))) throw new Error(`Directory not found: ${dir}`);

  const paths1 = await Util.glob(fs.join(dir, '**/*.ts'));
  const paths2 = await Util.glob(fs.join(dir, '**/*.tsx'));
  const paths = [...paths1, ...paths2];

  for (const path of paths) {
    const ext = fs.extname(path);
    const mExt = `.m${ext.replace(/^./, '')}`;

    const source = path;
    const target = `${source.substring(0, source.length - ext.length)}${mExt}`;

    if (source !== target) {
      await fs.rename(source, target);
      console.log(pc.green('renamed'));
      console.log(pc.gray('  source'), source);
      console.log(pc.gray('  target'), target);
      console.log();
    }
  }
}

/**
 * Run
 */
await update('code/system/sys.fs/src/FsDriver.IndexedDb');
