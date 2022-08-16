import { exec } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

type PathString = string;
type TsConfig = { extends?: string; include?: string[]; compilerOptions: TsConfigCompilerOptions };
type TsConfigCompilerOptions = { rootDir?: string };

const Path = {
  builderDir: '.builder',
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
   * Run the [tsc] typescript compiler
   */
  tsc(dir: PathString, tsconfig: PathString) {
    type R = { ok: boolean; stdout: string; stderr: string };
    return new Promise<R>(async (resolve, reject) => {
      const tscompiler = path.resolve('node_modules/typescript/bin/tsc');
      const cmd = `${tscompiler} --project "${path.join(dir, tsconfig)}"`;
      exec(cmd, (error, stdout, stderr) => {
        const ok = !Boolean(stderr);
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        return error ? reject(error) : resolve({ ok, stdout, stderr });
      });
    });
  },

  /**
   * Complete build
   */
  async build(dir: PathString) {
    await Typescript.copyConfigs(dir, { clear: true });
    await Typescript.buildCode(dir);
    await Typescript.buildTypes(dir);
    await fs.remove(path.join(dir, Path.builderDir));
  },

  /**
   * Build ESM code.
   */
  async buildCode(dir: PathString) {
    const tsconfig = path.join(Path.builderDir, Path.filename.code);
    await Typescript.tsc(dir, tsconfig);
  },

  /**
   * Build type definitions (.d.ts)
   */
  async buildTypes(dir: PathString) {
    const tsconfig = path.join(Path.builderDir, Path.filename.types);
    await Typescript.tsc(dir, tsconfig);

    const source = path.join(dir, Path.builderDir, 'types/src');
    const target = path.join(dir, 'types');
    await fs.remove(target);
    await fs.move(source, target);
    await fs.remove(path.join(dir, Path.builderDir, 'types'));
  },

  /**
   * Copy the [tsconfig] json files to the target directory.
   */
  async copyConfigs(dir: PathString, options: { clear?: boolean } = {}) {
    dir = path.resolve(dir);
    const sourceDir = path.resolve('./template');
    const targetDir = path.join(dir, Path.builderDir);
    if (options.clear) await fs.remove(targetDir);
    await fs.ensureDir(targetDir);

    const copy = async (filename: string, adjust?: (config: TsConfig) => void) => {
      const source = path.join(sourceDir, filename);
      const target = path.join(targetDir, filename);
      const json = (await fs.readJson(source)) as TsConfig;
      adjust?.(json);
      await fs.writeFile(target, `${JSON.stringify(json, null, '  ')}\n`);
    };

    await copy(Path.filename.code, (tsconfig) => {
      tsconfig.extends = path.resolve('./tsconfig.json');
      tsconfig.compilerOptions.rootDir = dir;
    });

    await copy(Path.filename.types, (tsconfig) => {
      tsconfig.compilerOptions.rootDir = dir;
    });
  },
};
