import { Filesystem, NodeFs } from 'sys.fs.node';
import { Text } from 'sys.text/node';
import { rx, Time } from 'sys.util';

import { ContentBundle, ContentLog } from '../src/Pkg/index.mjs';

import { pushToVercel } from './deploy.vercel.mjs';

const token = process.env.VERCEL_TEST_TOKEN || ''; // Secure API token (secret).
const bus = rx.bus();

const toFs = async (dir: string) => {
  dir = NodeFs.resolve(dir);
  const store = await Filesystem.client(dir, { bus });
  return store.fs;
};

const bundler = await ContentBundle({
  Text,
  throwError: true,
  src: {
    app: await toFs('./dist/web'),
    content: await toFs('../../../../../live-state/tdb.meeting/undp'),
  },
});

const targetdir = await toFs('./dist.deploy/');
const logdir = await toFs('./dist.deploy/.log/');
const srcdir = await toFs('./src/');
const publicfs = await toFs('./public/');

console.log('content:bundler:', bundler);

const logger = ContentLog.log(logdir);
const version = bundler.version;
const bundle = await bundler.write.bundle(targetdir, { logdir, srcdir });

/**
 * Store the data in /public (for local dev usage)
 */
await bundler.write.data(publicfs, { logdir });

console.log('-------------------------------------------');
console.log('bundle (write response):', bundle);
console.log();
console.log('sizes:', bundle.size);

// 🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷
// process.exit(0); // TEMP 🐷
// 🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷

/**
 * Deploy
 */
const deployed = await pushToVercel({
  fs: bundle.fs,
  token,
  version,
  source: bundle.dir.app,
});

console.log('-------------------------------------------');
console.log('deployed', deployed.status);

/**
 * Log results.
 */

await logger.writeDeployment({
  timestamp: Time.now.timestamp,
  bundle: bundle.toObject(),
  deployment: deployed.toObject(),
});
