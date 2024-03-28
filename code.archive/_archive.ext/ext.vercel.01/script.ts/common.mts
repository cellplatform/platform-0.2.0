import { NodeFs } from 'sys.fs.node';
import type { Fs } from 'sys.fs/src/types';

export const Util = {
  /**
   * Copy to the given filesystem local filesystem.
   */
  async copy(fs: Fs, sourceDir: string, targetDir: string) {
    sourceDir = NodeFs.resolve(sourceDir);

    if (!(await NodeFs.pathExists(sourceDir)))
      throw new Error(`Source directory not found: ${sourceDir}`);

    const paths = await NodeFs.glob(fs.join(sourceDir, '**/*'), { nodir: true });

    await Promise.all(
      paths.map(async (source) => {
        const target = fs.join(targetDir, source.substring(sourceDir.length));
        const file = new Uint8Array(await NodeFs.readFile(source));
        await fs.write(target, file);
      }),
    );
  },
};
