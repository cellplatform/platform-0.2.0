import { LogTable, fs, pc, prettybytes, type t } from './common/index.mjs';

const Pkg = (await fs.readJson(fs.resolve('./package.json'))) as t.PkgJson;

const DEFAULT = {
  pattern: 'src/**/*.{mts,ts,tsx}',
  exclude: ['/node_modules/', '/dist/', '/tmp/', '/.tmp/'],
};

export type Total = { lines: number; bytes: number };
export type PathCount = { path: t.PathString } & Total;
export type DirCount = {
  dir: t.DirString;
  pattern: string;
  exclude: string[];
  paths: PathCount[];
};

const Find = {
  async moduleDirs(within: t.DirString) {
    const excludeDirs = Filter.exclude(['/node_modules/', '/dist/', '/dist.cell/', '/tmp']);
    const pattern = fs.join(within, '**/package.json');
    const paths = (await fs.glob(pattern)).filter(excludeDirs);
    return paths.map((path) => fs.dirname(path));
  },
};

const Sum = {
  dir(input: DirCount | DirCount[]) {
    const dirs = Array.isArray(input) ? input : [input];
    const size = dirs.reduce(
      (acc, next) => {
        const { lines, bytes } = Sum.paths(next.paths);
        acc.lines += lines;
        acc.bytes += bytes;
        return acc;
      },
      { lines: 0, bytes: 0 },
    );
    const files = dirs.reduce((acc, next) => acc + next.paths.length, 0);
    return { files, ...size };
  },
  paths(paths: PathCount[]) {
    return paths.reduce(
      (acc, next) => {
        acc.lines += next.lines;
        acc.bytes += next.bytes;
        return acc;
      },
      { lines: 0, bytes: 0 },
    );
  },
};

type Options = { pattern?: string; exclude?: t.PathString[] };

/**
 * Helpers for counting things within a module (eg. lines-of-code)
 */
export const Count = {
  Find,
  Sum,

  async modules(within: t.DirString, options: Options = {}) {
    const dirs = await Count.Find.moduleDirs(within);
    return await Promise.all(dirs.map((dir) => Count.dir(dir, options)));
  },

  /**
   * Perform a count operation on the given directory.
   */
  async dir(dir: t.DirString, options: Options = {}) {
    const count: DirCount = {
      paths: [],
      dir,
      pattern: options.pattern ?? DEFAULT.pattern,
      exclude: options.exclude ?? DEFAULT.exclude,
    };

    const exclude = Filter.exclude(count.exclude);
    const pattern = fs.join(count.dir, count.pattern);
    const paths = (await fs.glob(pattern, { nodir: true })).filter(exclude);
    count.paths = await Promise.all(
      paths.map(async (path) => {
        const data = await fs.readFile(path);
        return {
          path: path.substring(dir.length + 1),
          lines: data.toString().split('\n').length,
          bytes: data.byteLength,
        };
      }),
    );

    return count;
  },

  /**
   * Logging helpers
   */
  log(input: DirCount | DirCount[], options: { base?: t.DirString } & Options = {}) {
    const { base = '', exclude = DEFAULT.exclude, pattern = DEFAULT.pattern } = options;
    const dirs = Array.isArray(input) ? input : [input];
    const table = LogTable();

    table.push([' Module (Source Code)', `  Size`, '  Files', '  Lines'].map(pc.white));
    table.push([]);

    const add = (dir: string, files: number, lines: number, bytes: number) => {
      if (base && dir.startsWith(base)) dir = dir.substring(base.length);
      const path = `   ${fs.dirname(dir.substring(1))}/${pc.white(fs.basename(dir))}`;
      const totalSize = `   /src ${prettybytes(bytes)}  `;
      const totalFiles = `   ${files}`;
      const totalLines = `    ${pc.gray(lines.toLocaleString())}`;
      table.push([path, totalSize, totalFiles, totalLines]);
    };

    dirs.forEach((item) => {
      const { lines, bytes } = Sum.dir(item);
      add(item.dir, item.paths.length, lines, bytes);
    });

    const total = Sum.dir(dirs);
    const totalBytes = `   ${pc.white(prettybytes(total.bytes))}`;
    const totalFiles = `  ${pc.white(total.files.toLocaleString())}`;
    const totalLines = `   ${pc.bold(pc.green(total.lines.toLocaleString()))}`;
    table.push([]);
    table.push(['', totalBytes, totalFiles, totalLines]);
    table.push(['', pc.gray('   size'), pc.gray('  files'), pc.gray('   lines')]);

    console.info();
    console.info(pc.gray(`match:   ${pc.green(pattern)}`));
    console.info(pc.gray(`exclude: ${exclude.map((w) => pc.yellow(w)).join(pc.gray(' ⊙ '))}`));
    console.info();

    console.info(pc.gray(table.toString()));
    console.info();

    console.info(pc.gray(`repository: ${pc.cyan(Pkg.name)}`));
    console.info(pc.gray(`   version: ${pc.white(pc.bold(Pkg.version))}`));
    console.info();
  },
};

/**
 * Helpers
 */
const Filter = {
  exclude(paths: string[]) {
    return (path: string) => !paths.some((item) => path.includes(item));
  },
};
