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
    const pkg = await Util.PackageJson.load(Paths.rootDir);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    return (deps['typescript'] ?? '0.0.0').replace(/^\^/, '');
  },

  /**
   * Complete build
   */
  async build(root: t.DirString, options: { exitOnError?: boolean; silent?: boolean } = {}) {
    root = fs.resolve(root);
    const { silent = false } = options;
    const tsVersion = await Typescript.version();

    if (!silent) {
      const msg = pc.green(`${pc.cyan(`tsc  v${tsVersion}`)} building for production...`);
      console.log(msg);
    }

    if (!(await fs.pathExists(root))) {
      console.log(`\nERROR(Typescript.build) root directory does not exist.\n${root}\n`);
      if (options.exitOnError) process.exit(1);
    }

    await Typescript.copyTsConfigFiles(root, { clear: true });
    await Typescript.generatePkgMetadata(root);
    const res = await Typescript.buildTypes(root, options);

    await fs.remove(fs.join(root, TsPaths.tmp));
    return res;
  },

  /**
   * Build ESM code.
   */
  async buildCode(root: t.DirString, options: { exitOnError?: boolean; silent?: boolean } = {}) {
    const { silent = false } = options;
    const tsconfig = fs.join(TsPaths.tmp, Paths.tmpl.tsconfig.code);
    const res = await Typescript.tsc(root, tsconfig, { silent });
    if (!res.ok && options.exitOnError) process.exit(res.errorCode);
    return res;
  },

  /**
   * Build type definitions (.d.ts)
   */
  async buildTypes(root: t.DirString, options: { exitOnError?: boolean; silent?: boolean } = {}) {
    const { silent = false } = options;
    const tsconfig = fs.join(TsPaths.tmp, Paths.tmpl.tsconfig.types);
    const res = await Typescript.tsc(root, tsconfig, { silent });
    if (!res.ok && options.exitOnError) process.exit(res.errorCode);

    // Move the child "src/" folder into the distirbution output folder
    const source = fs.join(root, TsPaths.tmp, Paths.types.dirname, 'src');
    const target = fs.join(root, Paths.types.dirname);
    if (res.ok) {
      await fs.remove(target);
      await fs.move(source, target);
      await fs.remove(fs.join(root, TsPaths.tmp, Paths.types.dirname));
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
  async tsc(dir: t.DirString, tsconfig: t.PathString, options: { silent?: boolean } = {}) {
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
  async copyTsConfigFiles(root: t.DirString, options: { clear?: boolean } = {}) {
    root = fs.resolve(root);
    const sourceDir = Paths.tmpl.dir;
    const targetDir = fs.join(root, TsPaths.tmp);
    if (options.clear) await fs.remove(targetDir);
    await fs.ensureDir(targetDir);

    const copy = async (filename: string, adjust?: (config: t.TsConfig) => void) => {
      const source = fs.join(sourceDir, filename);
      const target = fs.join(targetDir, filename);
      const json = (await fs.readJson(source)) as t.TsConfig;
      adjust?.(json);
      await fs.writeFile(target, Util.Json.stringify(json));
    };

    await copy(Paths.tmpl.tsconfig.code, (tsconfig) => {
      tsconfig.extends = fs.join(Paths.rootDir, './tsconfig.json');
      tsconfig.compilerOptions.rootDir = root;
    });

    await copy(Paths.tmpl.tsconfig.types, (tsconfig) => {
      tsconfig.compilerOptions.rootDir = root;
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
  async generatePkgMetadata(root: t.DirString) {
    root = fs.resolve(root);
    const rootPkg = await Util.PackageJson.load(Paths.rootDir);
    const modulePkg = await Util.PackageJson.load(root);
    let text = (await fs.readFile(fs.join(Paths.tmpl.dir, Paths.tmpl.pkg))).toString();

    const rootDeps = { ...rootPkg.dependencies, ...rootPkg.devDependencies }; // Include both for fallback version lookup.
    const moduleDeps = { ...modulePkg.dependencies };
    const version = Util.Version.trimAdornment(modulePkg.version).version;

    let dependencies = '  dependencies: {\n';
    Object.keys(moduleDeps).forEach((key) => {
      const rootVersion = Util.Version.trimAdornment(rootDeps[key]).version;
      let version = Util.Version.trimAdornment(moduleDeps[key]).version;
      if (version === 'latest' && rootVersion) version = rootVersion;
      dependencies += `    '${key}': '${version}',\n`;
    });
    dependencies += '  },';

    text = text.replace(/name: '',/, `name: '${modulePkg.name}',`);
    text = text.replace(/version: '',/, `version: '${version}',`);
    text = text.replace(/  dependencies: \{\},/, dependencies);

    await fs.writeFile(fs.join(root, Paths.tmpl.pkg), text);
  },
};
