import { exec, ExecException } from 'child_process';
import { fs, t, Paths, colors } from '../common.mjs';
import { Util } from '../Util.mjs';

/**
 * Template path names.
 */
const TsPaths = {
  tmp: '.builder',
  tsc: fs.join(Paths.rootDir, 'node_modules/typescript/bin/tsc'),
};

/**
 * Helpers for preparing and transpiling typescript modules (build).
 */
export const Typescript = {
  /**
   * Complete build
   */
  async build(rootDir: t.PathString, options: { exitOnError?: boolean } = {}) {
    rootDir = fs.resolve(rootDir);

    const pkg = await Util.loadJsonFile<t.PackageJson>(fs.join(Paths.rootDir, 'package.json'));
    const tsVersion = (pkg.devDependencies?.['typescript'] ?? '0.0.0').replace(/^\^/, '');

    console.log(colors.green(`${colors.cyan(`tsc  v${tsVersion}`)} building for production...`));

    if (!(await fs.pathExists(rootDir))) {
      console.log(`\nERROR(Typescript.build) root directory does not exist.\n${rootDir}\n`);
      if (options.exitOnError) process.exit(1);
      return;
    }

    await Typescript.copyTsConfigFiles(rootDir, { clear: true });
    await Typescript.buildCode(rootDir, options);
    await Typescript.buildTypes(rootDir, options);
    await fs.remove(fs.join(rootDir, TsPaths.tmp));
  },

  /**
   * Build ESM code.
   */
  async buildCode(rootDir: t.PathString, options: { exitOnError?: boolean } = {}) {
    const tsconfig = fs.join(TsPaths.tmp, Paths.tmpl.tsconfig.code);
    const res = await Typescript.tsc(rootDir, tsconfig);
    if (!res.ok && options.exitOnError) process.exit(res.code);
    return res;
  },

  /**
   * Build type definitions (.d.ts)
   */
  async buildTypes(rootDir: t.PathString, options: { exitOnError?: boolean } = {}) {
    const tsconfig = fs.join(TsPaths.tmp, Paths.tmpl.tsconfig.types);
    const res = await Typescript.tsc(rootDir, tsconfig);
    if (!res.ok && options.exitOnError) process.exit(res.code);

    // Move the child "src/" folder up into the root "types/" folder.
    if (res.ok) {
      const source = fs.join(rootDir, TsPaths.tmp, 'types/src');
      const target = fs.join(rootDir, 'types');
      await fs.remove(target);
      await fs.move(source, target);
      await fs.remove(fs.join(rootDir, TsPaths.tmp, 'types'));
    }

    return res;
  },

  /**
   * Run the [tsc] typescript compiler
   */
  tsc(dir: t.PathString, tsconfig: t.PathString, options: { silent?: boolean } = {}) {
    type R = { ok: boolean; code: number; stdout: string; stderr: string; error?: ExecException };
    return new Promise<R>(async (resolve) => {
      const cmd = `${TsPaths.tsc} --project "${fs.join(dir, tsconfig)}"`;
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
    const sourceDir = Paths.tmpl.dir;
    const targetDir = fs.join(rootDir, TsPaths.tmp);
    if (options.clear) await fs.remove(targetDir);
    await fs.ensureDir(targetDir);

    const copy = async (filename: string, adjust?: (config: t.TsConfig) => void) => {
      const source = fs.join(sourceDir, filename);
      const target = fs.join(targetDir, filename);
      const json = (await fs.readJson(source)) as t.TsConfig;
      adjust?.(json);
      await fs.writeFile(target, `${JSON.stringify(json, null, '  ')}\n`);
    };

    await copy(Paths.tmpl.tsconfig.code, (tsconfig) => {
      tsconfig.extends = fs.join(Paths.rootDir, './tsconfig.json');
      tsconfig.compilerOptions.rootDir = rootDir;
    });

    await copy(Paths.tmpl.tsconfig.types, (tsconfig) => {
      tsconfig.compilerOptions.rootDir = rootDir;
    });
  },
};
