import { execa, fs, pc, R, Util, type t } from '../common';
import { Paths } from '../Paths';

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
      const msg = pc.green(`${pc.cyan(`tsc  v${tsVersion}`)} checking types...`);
      console.info(msg);
    }

    if (!(await fs.pathExists(root))) {
      console.error(`\nERROR(Typescript.build) root directory does not exist.\n${root}\n`);
      if (options.exitOnError) process.exit(1);
    }

    await Typescript.copyTsConfigFiles(root, { clear: true });
    await Typescript.generatePkgMetadata(root);
    const res = await Typescript.buildTypes(root, options);

    await fs.remove(fs.join(root, Paths.tmpBuilderDir));
    return res;
  },

  /**
   * Build ESM code.
   */
  async buildCode(root: t.DirString, options: { exitOnError?: boolean; silent?: boolean } = {}) {
    const { silent = false } = options;
    const tsconfig = fs.join(Paths.tmpBuilderDir, fs.basename(Paths.tsConfig.code));
    const res = await Typescript.tsc(root, tsconfig, { silent });
    if (!res.ok && options.exitOnError) process.exit(res.errorCode);
    return res;
  },

  /**
   * Build type definitions (.d.ts)
   */
  async buildTypes(root: t.DirString, options: { exitOnError?: boolean; silent?: boolean } = {}) {
    const { silent = false } = options;
    const tsconfig = fs.join(Paths.tmpBuilderDir, fs.basename(Paths.tsConfig.types));
    const res = await Typescript.tsc(root, tsconfig, { silent });
    if (!res.ok && options.exitOnError) process.exit(res.errorCode);

    // Move the child "src/" folder into the distirbution output folder
    const source = fs.join(root, Paths.tmpBuilderDir, Paths.types.dirname, 'src');
    const target = fs.join(root, Paths.types.dirname);
    if (res.ok) {
      await fs.remove(target);
      await fs.move(source, target);
      await fs.remove(fs.join(root, Paths.tmpBuilderDir, Paths.types.dirname));
    }

    // Remove any test types.
    const pattern = '**/*.{TEST,SPEC}.d.{ts,tsx,mts,mtsx}';
    const tests = await fs.glob(fs.join(target, pattern));
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
    const targetDir = fs.join(root, Paths.tmpBuilderDir);
    const rootConfig = (await fs.readJson(Paths.tsConfig.base)) as t.TsConfig;

    if (options.clear) await fs.remove(targetDir);
    await fs.ensureDir(targetDir);

    const mergeWithRoot = async (path: string) => {
      return R.mergeDeepRight(rootConfig, await fs.readJson(path)) as t.TsConfig;
    };

    const write = async (path: string, config: t.TsConfig) => {
      await fs.writeFile(path, Util.Json.stringify(config));
    };

    const copy = async (kind: t.ModifyTsConfigKind, source: t.PathString) => {
      const target = fs.join(targetDir, fs.basename(source));
      let config = await mergeWithRoot(source);
      config = await Typescript.modifyTsConfigFromModule({ root, kind, config });
      config.compilerOptions.rootDir = root;
      await write(target, config);
    };

    await copy('code', Paths.tsConfig.code);
    await copy('types', Paths.tsConfig.types);

    /**
     * Store a [tsconfig.json] copy of the "compiler options"
     * within the module's root to ensure the editor environment
     * understands how to treat it.
     */
    const localConfig = await Typescript.modifyTsConfigFromModule({
      root,
      kind: 'code',
      config: rootConfig,
    });
    write(fs.join(root, 'tsconfig.json'), localConfig);
  },

  /**
   * Runs the module specific modifications over the tsconfig if declared
   * within the [vite.config.mts] file.
   */
  async modifyTsConfigFromModule(args: {
    root: t.DirString;
    config: t.TsConfig;
    kind: t.ModifyTsConfigKind;
  }) {
    const { kind } = args;
    const root = fs.resolve(args.root);
    const modulePath = fs.join(root, 'vite.config.ts');
    if (!(await fs.pathExists(modulePath))) return args.config;

    const m = (await import(modulePath)) as { tsconfig: t.TsConfigExport };
    return m?.tsconfig ? m.tsconfig({ kind, config: R.clone(args.config) }) : args.config;
  },

  /**
   * Generate the [index.pkg.ts] file that contains static
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
