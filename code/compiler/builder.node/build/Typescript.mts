import { pc, execa, fs, t, Util } from '../common/index.mjs';
import { Paths } from '../Paths.mjs';

/**
 * Template path names.
 */
const TsPaths = {
  tmp: '.builder',
};

/**
 * Helpers for preparing and transpiling typescript modules (build).
 */
export const Typescript = {
  /**
   * Complete build
   */
  async build(rootDir: t.PathString, options: { exitOnError?: boolean; silent?: boolean } = {}) {
    const { silent = false } = options;
    rootDir = fs.resolve(rootDir);

    const pkg = await Util.loadJsonFile<t.PackageJson>(fs.join(Paths.rootDir, 'package.json'));
    const tsVersion = (pkg.devDependencies?.['typescript'] ?? '0.0.0').replace(/^\^/, '');

    if (!silent) {
      const msg = pc.green(`${pc.cyan(`tsc  v${tsVersion}`)} building for production...`);
      console.log(msg);
    }

    if (!(await fs.pathExists(rootDir))) {
      console.log(`\nERROR(Typescript.build) root directory does not exist.\n${rootDir}\n`);
      if (options.exitOnError) process.exit(1);
    }

    await Typescript.copyTsConfigFiles(rootDir, { clear: true });
    const res = await Typescript.buildTypes(rootDir, options);
    await fs.remove(fs.join(rootDir, TsPaths.tmp));

    return res;
  },

  /**
   * Build ESM code.
   */
  async buildCode(
    rootDir: t.PathString,
    options: { exitOnError?: boolean; silent?: boolean } = {},
  ) {
    const { silent = false } = options;
    const tsconfig = fs.join(TsPaths.tmp, Paths.tmpl.tsconfig.code);
    const res = await Typescript.tsc(rootDir, tsconfig, { silent });
    if (!res.ok && options.exitOnError) process.exit(res.errorCode);
    return res;
  },

  /**
   * Build type definitions (.d.ts)
   */
  async buildTypes(
    rootDir: t.PathString,
    options: { exitOnError?: boolean; silent?: boolean } = {},
  ) {
    const { silent = false } = options;
    const tsconfig = fs.join(TsPaths.tmp, Paths.tmpl.tsconfig.types);
    const res = await Typescript.tsc(rootDir, tsconfig, { silent });
    if (!res.ok && options.exitOnError) process.exit(res.errorCode);

    // Move the child "src/" folder up into the root "types/" folder.
    if (res.ok) {
      const source = fs.join(rootDir, TsPaths.tmp, 'types.d/src');
      const target = fs.join(rootDir, 'types.d');
      await fs.remove(target);
      await fs.move(source, target);
      await fs.remove(fs.join(rootDir, TsPaths.tmp, 'types.d'));
    }

    // Remove any test types.
    const pattern = '**/*.{TEST,SPEC}.d.{ts,tsx,mts,mtsx}';
    const tests = await fs.glob.find(fs.join(rootDir, 'types', pattern));
    await Promise.all(tests.map((path) => fs.remove(path)));

    return res;
  },

  /**
   * Run the [tsc] typescript compiler
   */
  async tsc(dir: t.PathString, tsconfig: t.PathString, options: { silent?: boolean } = {}) {
    try {
      const args = ['--project', fs.join(dir, tsconfig)];
      const { exitCode: errorCode } = await execa('tsc', args, {
        cwd: fs.resolve(dir),
        stdio: options.silent ? 'ignore' : 'inherit',
      });
      const ok = errorCode === 0;
      return { ok, errorCode };
    } catch (error: any) {
      const errorCode = error.exitCode as number;
      const ok = errorCode === 0;
      return { ok, errorCode };
    }
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
