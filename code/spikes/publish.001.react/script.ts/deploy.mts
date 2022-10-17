import { Vercel } from 'cloud.vercel';
import { Crdt } from 'sys.data.crdt';

import { Filesystem, NodeFs, Path } from 'sys.fs.node';
import { rx } from 'sys.util';

import pc from 'picocolors';
import { t } from '../src/common/index.mjs';
import { Pkg } from '../src/index.pkg.mjs';

import { ContentPackage } from '../src/deploy/index.mjs';
import { pushToVercel } from './deploy.vercel.mjs';

import { Text } from 'sys.text/node';

const token = process.env.VERCEL_TEST_TOKEN || ''; // Secure API token (secret).
const bus = rx.bus();

const toFs = async (dir: string) => {
  dir = NodeFs.resolve(dir);
  const store = await Filesystem.client(dir, { bus });
  return store.fs;
};

const content = await ContentPackage({
  Text,
  throwError: true,
  src: {
    app: await toFs('./dist/web'),
    content: await toFs('../../../../../live-state/tdb.meeting/undp'),
  },
});

const targetfs = await toFs('./dist.deploy');

console.log('content', content);
const bundle = await content.write(targetfs);
const version = content.version;

console.log('-------------------------------------------');
console.log('bundle (write response):', bundle);

process.exit(0); // TEMP 🐷

const res2 = await pushToVercel({
  fs: bundle.fs,
  token,
  version,
  source: bundle.dir.app,
});

console.log('-------------------------------------------');
console.log('res2', res2);
