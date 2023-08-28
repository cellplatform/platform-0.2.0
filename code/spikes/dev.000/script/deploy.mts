#!/usr/bin/env ts-node
import { bundle, bus } from './bundle.mjs';
import { pushToVercel } from './deploy.vercel.mjs';

/**
 * Deploy
 */

export async function deploy(project: string, alias: string) {
  const version = bundle.version;
  const fs = bundle.fs;
  const source = bundle.dirs.app;
  const deployment = await pushToVercel({ bus, version, fs, source, project, alias });

  /**
   * Log results.
   */
  await bundle.logger.write({ bundle, deployment });
}

await deploy('tdb-dev', 'dev.db.team');
// await deploy('cell-rowan', 'rowanyeoman.com');
// await deploy('cell-phil', 'phil.cockfield.net');
// await deploy('cell-abi', 'abi.cockfield.net');
// await deploy('cell-james', 'jamesamuel.com');
