import { exec, ExecException } from 'child_process';
import { fs, t } from '../common.mjs';

/**
 * Template path names.
 */
const Path = {
  tmpBuilderDir: '.builder',
  filename: {
    code: 'tsconfig.code.json',
    types: 'tsconfig.types.json',
  },
};

/**
 * Helpers for preparing and transpiling typescript modules (build).
 */
export const Typescript = {
  Path,

  /**
   * Complete build
   */
  async build(rootDir: t.PathString, options: { exitOnError?: boolean } = {}) {
    await Typescript.copyTsConfigFiles(rootDir, { clear: true });
    await Typescript.buildCode(rootDir, options);
    await Typescript.buildTypes(rootDir, options);
    await fs.remove(fs.join(rootDir, Path.tmpBuilderDir));
  },

  /**
   * Build ESM code.
   */
  async buildCode(rootDir: t.PathString, options: { exitOnError?: boolean } = {}) {
    const tsconfig = fs.join(Path.tmpBuilderDir, Path.filename.code);
    const res = await Typescript.tsc(rootDir, tsconfig);
    if (!res.ok && options.exitOnError) process.exit(res.code);
    return res;
  },

  /**
   * Build type definitions (.d.ts)
   */
  async buildTypes(rootDir: t.PathString, options: { exitOnError?: boolean } = {}) {
    const tsconfig = fs.join(Path.tmpBuilderDir, Path.filename.types);
    const res = await Typescript.tsc(rootDir, tsconfig);
    if (!res.ok && options.exitOnError) process.exit(res.code);

    // Move the child "src/" folder up into the root "types/" folder.
    if (res.ok) {
      const source = fs.join(rootDir, Path.tmpBuilderDir, 'types/src');
      const target = fs.join(rootDir, 'types');
      await fs.remove(target);
      await fs.move(source, target);
      await fs.remove(fs.join(rootDir, Path.tmpBuilderDir, 'types'));
    }

    return res;
  },

  /**
   * Run the [tsc] typescript compiler
   */
  tsc(dir: t.PathString, tsconfig: t.PathString, options: { silent?: boolean } = {}) {
    type R = { ok: boolean; code: number; stdout: string; stderr: string; error?: ExecException };
    return new Promise<R>(async (resolve) => {
      const tscompiler = fs.resolve('node_modules/typescript/bin/tsc');
      const cmd = `${tscompiler} --project "${fs.join(dir, tsconfig)}"`;
      exec(cmd, (err, stdout, stderr) => {
        const ok = !Boolean(stderr || err);
        const code = typeof err?.code === 'number' ? err.code : ok ? 0 : 1;
        const error = err || undefined;
        if (!options.silent) {
          if (stdout) console.log(`\n${stdout}`);
          if (stderr) console.error(`\n${stderr}`);
          if (error) console.error(`[command failed]:\n${cmd}\n`);
        }
        resolve({ ok, code, stdout, stderr, error });
      });
    });
  },

  /**
   * Copy the [tsconfig] json files to the target directory.
   */
  async copyTsConfigFiles(rootDir: t.PathString, options: { clear?: boolean } = {}) {
    rootDir = fs.resolve(rootDir);
    const sourceDir = fs.resolve('./template');
    const targetDir = fs.join(rootDir, Path.tmpBuilderDir);
    if (options.clear) await fs.remove(targetDir);
    await fs.ensureDir(targetDir);

    const copy = async (filename: string, adjust?: (config: t.TsConfig) => void) => {
      const source = fs.join(sourceDir, filename);
      const target = fs.join(targetDir, filename);
      const json = (await fs.readJson(source)) as t.TsConfig;
      adjust?.(json);
      await fs.writeFile(target, `${JSON.stringify(json, null, '  ')}\n`);
    };

    await copy(Path.filename.code, (tsconfig) => {
      tsconfig.extends = fs.resolve('./tsconfig.json');
      tsconfig.compilerOptions.rootDir = rootDir;
    });

    await copy(Path.filename.types, (tsconfig) => {
      tsconfig.compilerOptions.rootDir = rootDir;
    });
  },
};
