import { Vercel } from 'cloud.vercel';
import { Crdt } from 'sys.data.crdt';
import { Markdown } from 'sys.text/node';
import { Filesystem, NodeFs, Path } from 'sys.fs.node';
import { rx } from 'sys.util';

import { t } from '../src/common/index.mjs';
import { Pkg } from '../src/index.pkg.mjs';

import { TextProcessor } from 'sys.text/node';

import Yaml from 'yaml';

const token = process.env.VERCEL_TEST_TOKEN || ''; // Secure API token (secret).
const bus = rx.bus();

/**
 * Initialize filesystem access.
 */

const Paths = {
  sourceDir: NodeFs.resolve('../../../../../live-state/tdb.meeting/undp'),
  tmpDir: NodeFs.resolve('./tmp'),
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

/**
 * Read in the source markdown.
 */
const source = await fs.source.manifest();
let version = '';
let dir = 'dist';

const processREADME = async (markdown: string) => {
  const res = await TextProcessor.markdown(markdown);

  const README = res.html;

  const propjectProps = res.info.codeblocks.filter((m) => m.type === 'project:props')[0];
  const props = Yaml.parse(propjectProps.text);
  version = props.version;
  dir = Path.join(dir, version);

  console.log('to => Yaml.parse => obj:', props);
  console.log('-------------------------------------------');
  console.log('meta/project:props', propjectProps);

  // const readme = await Markdown.toHtml(text);

  await fs.tmp.write(Path.join(dir, 'README.md'), markdown);
  await fs.tmp.write(Path.join(dir, 'index.html'), README);

  return { props };
};

const fileReadme = source.files.find((file) => file.path.endsWith('README.md'));

if (fileReadme) {
  const data = await fs.source.read(fileReadme.path);
  const markdown = new TextDecoder().decode(data);
  await processREADME(markdown);
}

/**
 * Copy source content (local)
 */
for (const file of source.files) {
  // As markdown file.
  const data = await fs.source.read(file.path);
  await fs.tmp.write(Path.join(dir, 'data.md', file.path), data);

  // As HTML.
  const text = new TextDecoder().decode(data);
  const html = await Markdown.toHtml(text);
  const filename = `${file.path}.html`;
  await fs.tmp.write(Path.join(dir, 'data.html', filename), html);
}

// await logFsInfo('source', fs.source);
// await logFsInfo('tmp (local)', fs.tmp);

/**
 * Do some CRDT thing ( 🧠 ).
 */
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

process.exit(0); // TEMP 🐷

/**
 * Deploy
 */
const vercel = Vercel.client({ bus, token, fs: fs.tmp });
await vercel.deploy({
  team: 'tdb',
  name: `tdb.undp.v${Pkg.version}`,
  project: 'tdb-undp',
  source: 'dist',
  alias: 'undp.db.team',
  ensureProject: true,
  regions: ['sfo1'],
  target: 'production', // NB: required to be "production" for the DNS alias to be applied.
  silent: false, // Standard BEFORE and AFTER deploy logging to console.
  timeout: 90000,
});
