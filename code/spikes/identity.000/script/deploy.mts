#!/usr/bin/env ts-node
import { bundle, bus } from './bundle.mjs';
import { pushToVercel } from './deploy.vercel.mjs';

/**
 * Deploy
 */
const deployment = await pushToVercel({
  bus,
  version: bundle.version,
  fs: bundle.fs,
  source: bundle.dirs.app,
});

console.log('-------------------------------------------');
console.log('deployed', deployment.status);

/**
 * Log results.
 */
await bundle.logger.write({ bundle, deployment });
