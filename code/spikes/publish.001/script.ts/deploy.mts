import { Filesystem, NodeFs } from 'sys.fs.node';
import { Content } from 'sys.pkg';
import { Text } from 'sys.text/node';
import { rx } from 'sys.util';

import { pushToVercel } from './deploy.vercel.mjs';

const bus = rx.bus();

const dir = async (dir: string) => {
  const store = await Filesystem.client(NodeFs.resolve(dir), { bus });
  return store.fs;
};

const logdir = await dir('./dist.deploy/.log/');
const publicdir = await dir('./public/data');
const targetdir = await dir('./dist.deploy/');

const bundler = await Content.bundler({
  Text,
  throwError: true,
  sources: {
    app: await dir('./dist/web'),
    src: await dir('./src/'),
    data: await dir('../../../../../org.team-db/tdb.working/project.undp/'),
    log: logdir,
  },
});

const version = bundler.README.props.version;
const bundle = await bundler.write.bundle(targetdir, version);

/**
 * Store the data in /public (for local dev usage)
 */
await bundler.write.data(publicdir, version);

console.log('-------------------------------------------');
console.log('bundle (write response):', bundle.toObject());
console.log();

// 🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷

// process.exit(0); // TEMP 🐷

// 🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷

/**
 * Deploy
 */
const deployment = await pushToVercel({
  version,
  fs: bundle.fs,
  source: bundle.dir.app,
});

console.log('-------------------------------------------');
console.log('deployed', deployment.status);

/**
 * Log results.
 */
const logger = Content.logger(logdir);
await logger.write({ bundle: bundle.toObject(), deployment });
