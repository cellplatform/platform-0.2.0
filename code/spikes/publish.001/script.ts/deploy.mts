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

const targetdir = await toFs('./dist.deploy/');
const logdir = await toFs('./dist.deploy/.log/');
const publicfs = await toFs('./public/');

const bundler = await ContentBundle({
  Text,
  throwError: true,
  sources: {
    app: await toFs('./dist/web'),
    src: await toFs('./src/'),
    content: await toFs('../../../../../org.team-db/tdb.working/undp'),
    log: logdir,
  },
});

console.log('content:bundler:', bundler);

const version = bundler.version;
const bundle = await bundler.write.bundle(targetdir, {});

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

const logger = ContentLog.log(logdir);
await logger.writeDeployment({
  timestamp: Time.now.timestamp,
  bundle: bundle.toObject(),
  deployment: deployed.toObject(),
});
