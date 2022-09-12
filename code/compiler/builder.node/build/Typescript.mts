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
   * Read the current version of typecript.
   */
  async version() {
    const pkg = await Util.loadPackageJsonFile(Paths.rootDir);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    return (deps['typescript'] ?? '0.0.0').replace(/^\^/, '');
  },

  /**
   * Complete build
   */
  async build(rootDir: t.PathString, options: { exitOnError?: boolean; silent?: boolean } = {}) {
    rootDir = fs.resolve(rootDir);
    const { silent = false } = options;
    const tsVersion = await Typescript.version();

    if (!silent) {
      const msg = pc.green(`${pc.cyan(`tsc  v${tsVersion}`)} building for production...`);
      console.log(msg);
    }

    if (!(await fs.pathExists(rootDir))) {
      console.log(`\nERROR(Typescript.build) root directory does not exist.\n${rootDir}\n`);
      if (options.exitOnError) process.exit(1);
    }

    await Typescript.copyTsConfigFiles(rootDir, { clear: true });
    await Typescript.generatePkgMetadata(rootDir);
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

    // Move the child "src/" folder into the distirbution output folder
    const source = fs.join(rootDir, TsPaths.tmp, 'types.d/src');
    const target = fs.join(rootDir, 'types.d');
    if (res.ok) {
      await fs.remove(target);
      await fs.move(source, target);
      await fs.remove(fs.join(rootDir, TsPaths.tmp, 'types.d'));
    }

    // Remove any test types.
    const pattern = '**/*.{TEST,SPEC}.d.{ts,tsx,mts,mtsx}';
    const tests = await fs.glob.find(fs.join(target, pattern));
    await Promise.all(tests.map((path) => fs.remove(path)));
    await fs.remove(fs.join(target, 'TEST/'));

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

  /**
   * Generate the [index.pkg.mts] file that contains static
   * meta-data about the module.
   *
   * DESIGN
   *    This is generated prior to the TSC build step, allowing the module to
   *    know basic things about itself (such as version, dependencies, etc) without
   *    resorting to complicated JSON imports up to the root [package.json] file
   *    which tend to fail in unexpected ways as the environment shifts
   *    and other processes operate with the module directory.
   */
  async generatePkgMetadata(rootDir: t.PathString) {
    rootDir = fs.resolve(rootDir);
    const rootPkg = await Util.loadPackageJsonFile(Paths.rootDir);
    const modulePkg = await Util.loadPackageJsonFile(rootDir);
    let text = (await fs.readFile(fs.join(Paths.tmpl.dir, Paths.tmpl.pkg))).toString();

    const rootDeps = { ...rootPkg.dependencies, ...rootPkg.devDependencies }; // Include both for fallback version lookup.
    const moduleDeps = { ...modulePkg.dependencies };
    const version = Util.trimVersionAdornments(modulePkg.version);

    let dependencies = '  dependencies: {\n';
    Object.keys(moduleDeps).forEach((key) => {
      const rootVersion = Util.trimVersionAdornments(rootDeps[key]);
      let version = Util.trimVersionAdornments(moduleDeps[key]);
      if (version === 'latest' && rootVersion) version = rootVersion;
      dependencies += `    '${key}': '${version}',\n`;
    });
    dependencies += '  },';

    text = text.replace(/name: '',/, `name: '${modulePkg.name}',`);
    text = text.replace(/version: '',/, `version: '${version}',`);
    text = text.replace(/  dependencies: \{\},/, dependencies);

    await fs.writeFile(fs.join(rootDir, Paths.tmpl.pkg), text);
  },
};
