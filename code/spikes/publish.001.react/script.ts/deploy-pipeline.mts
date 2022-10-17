import { Vercel } from 'cloud.vercel';
import { Crdt } from 'sys.data.crdt';

import { Filesystem, NodeFs, Path } from 'sys.fs.node';
import { rx } from 'sys.util';

import pc from 'picocolors';
import { t } from '../src/common/index.mjs';
import { Pkg } from '../src/index.pkg.mjs';

import { ContentPackage } from '../src/deploy/index.mjs';

import { Text } from 'sys.text/node';

const token = process.env.VERCEL_TEST_TOKEN || ''; // Secure API token (secret).
const bus = rx.bus();

const toFsClient = async (dir: string) => {
  dir = NodeFs.resolve(dir);
  const store = await Filesystem.client(dir, { bus });
  return store.fs;
};

const pipeline = await ContentPackage({
  Text,
  throwError: true,
  src: {
    app: await toFsClient('./dist/'),
    content: await toFsClient('../../../../../live-state/tdb.meeting/undp'),
  },
});

const targetfs = await toFsClient('./dist.deploy');

console.log('pipeline', pipeline);
const res = await pipeline.write(targetfs);

console.log('write', res);
console.log('res.manifest', res.target.manifest);

/**
 * 🐷🐷🐷🐷🐷🐷🐷🐷 OLD BELOW 🐷🐷🐷🐷🐷🐷🐷🐷
 */
process.exit(0);

/**
 * Initialize filesystem access.
 */

const Paths = {
  sourceDir: NodeFs.resolve('../../../../../live-state/tdb.meeting/undp'),
  tmpDir: NodeFs.resolve('./dist/deploy'),
  localDist: NodeFs.resolve('./dist'),
  localPackage: NodeFs.resolve('./package.json'),
};

const FsSource = await Filesystem.client(Paths.sourceDir, { bus });
const FsTmp = await Filesystem.client(Paths.tmpDir, { bus });

const fs = {
  source: FsSource.fs,
  tmp: FsTmp.fs,
};

const logFsInfo = async (title: string, fs: t.Fs) => {
  const m = await fs.manifest();
  const paths = m.files.map((m) => m.path);
  console.info(``);
  console.info(`💦`);
  console.info(`  filesystem:`, title);
  console.info('  paths:', paths);
};

// await logFsInfo('tmp', fs.source);

/**
 * Read in the source markdown.
 */
const source = await fs.source.manifest();
let version = pipeline.README.version;
const dir = 'deploy';

await logFsInfo('source', fs.source);
await logFsInfo('tmp (local)', fs.tmp);
// process.exit(0);

const SourceRepo = {
  paths: {
    README: source.files.find((file) => file.path.endsWith('README.md'))?.path ?? '',
  },

  README: {
    async load() {
      const binary = await fs.source.read(SourceRepo.paths.README);
      const md = new TextDecoder().decode(binary);
      const { props, version } = await SourceRepo.README.process(md);

      return { binary, md, props, version };
    },

    async process(markdown: string) {
      const res = await Text.Processor.md().html(markdown);

      const propjectProps = res.info.codeblocks.filter((m) => m.type === 'project:props')[0];
      const props = Text.Yaml.parse(propjectProps.text);
      const version = props.doc.version;

      console.log('-------------------------------------------');
      console.log('meta/project:props', props);

      const deployDir = Path.join(dir, version, 'app/web');
      console.log('deployDir', deployDir);

      // README.
      await fs.tmp.write(Path.join(deployDir, 'README.md'), markdown); //   Raw Markdown
      await fs.tmp.write(Path.join(deployDir, 'README.md.html'), res.text); // Markdown as HTML

      return { props, version, dir };
    },
  },
};

/**
 * Read out latest version.
 */
await (async () => {
  // return;
  const README = await SourceRepo.README.load();
  version = README.version;

  console.log('version', version);
})();

// process.exit(0); // TEMP 🐷

/**
 * Prepare files.
 */
await (async () => {
  const fileReadme = source.files.find((file) => file.path.endsWith('README.md'));

  if (fileReadme) {
    const data = await fs.source.read(fileReadme.path);
    const markdown = new TextDecoder().decode(data);
    await SourceRepo.README.process(markdown);
  }

  /**
   * Copy source content (local)
   */
  for (const file of source.files) {
    // As markdown file.
    const data = await fs.source.read(file.path);
    await fs.tmp.write(Path.join(dir, version, 'data.md', file.path), data);

    // As HTML.
    const text = new TextDecoder().decode(data);
    const md = await Text.Processor.md().html(text);

    const filename = `${file.path}.html`;
    await fs.tmp.write(Path.join(dir, version, 'data.html', filename), md.text);
  }
})();

/**
 * Do some CRDT thing ( 🧠 ).
 */
await (async () => {
  const crdt = Crdt.Bus.Controller({ bus }).events;
  const crdtPath = Path.join(dir, 'data/file');

  type D = { msg: string; count: number };
  const doc = await crdt.doc<D>({
    id: '1',
    initial: { msg: '', count: 0 },
    load: { fs: fs.tmp, path: crdtPath },
  });

  await doc.change((doc) => {
    doc.msg = 'hello';
    doc.count++;
  });

  await doc.save(fs.tmp, crdtPath, { json: true });

  console.log('');
  console.log('-------------------------------------------');
  console.log('🐷🐷 CRDT 🐷🐷 (TODO) working example:', doc.current);
  console.log('-------------------------------------------');
})();

/**
 * Copy local Dist
 */
await (async () => {
  const from = Paths.localDist;
  const to = Path.join(Paths.tmpDir, dir, version, 'app');

  console.log('');
  console.log('');
  console.log(pc.green('copy'), pc.gray(`/dist  ${pc.green('=>')}  /app`));
  console.log('');
  console.log(' - from:', pc.gray(from));
  console.log(' - to:  ', pc.gray(to));
  console.log();

  await NodeFs.copy(from, to);

  //
})();

// process.exit(0); // TEMP 🐷

/**
 * Deploy
 */
(async () => {
  const source = Path.join('deploy', version, 'app/web');

  console.log('');
  console.info(`${pc.green('deploy from:')} ${pc.gray(source)}`);

  const vercel = Vercel.client({ bus, token, fs: fs.tmp });
  await vercel.deploy({
    team: 'tdb',
    name: `tdb.undp.v${version}`,
    project: 'tdb-undp',
    source,
    alias: 'undp.db.team',
    ensureProject: true,
    regions: ['sfo1'],
    target: 'production', // NB: required to be "production" for the DNS alias to be applied.
    silent: false, // Standard BEFORE and AFTER deploy logging to console.
  });

  console.info(pc.bold(pc.green(`version: ${pc.white(version)}`)));
})();
