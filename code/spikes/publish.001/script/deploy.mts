import { Content } from 'sys.pkg';

import { bundle, bundler, logdir } from './bundle.mjs';
import { pushToVercel } from './deploy.vercel.mjs';

// 🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷

// `process.exit(0); // TEMP 🐷

// 🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷🐷

/**
 * Deploy
 */
const deployment = await pushToVercel({
  version: bundle.version,
  fs: bundle.fs,
  source: bundle.dirs.app,
});

console.log('-------------------------------------------');
console.log('deployed', deployment.status);

/**
 * Log results.
 */
const logger = Content.logger(logdir);
await logger.write({ bundle, deployment });
