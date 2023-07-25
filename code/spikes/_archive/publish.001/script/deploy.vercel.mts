import { Vercel } from 'vendor.vercel';
import { rx } from 'sys.util';

import { Pkg } from '../src/index.pkg.mjs';
import { type t } from '../src/common';
import pc from 'picocolors';

const token = process.env.VERCEL_TEST_TOKEN || ''; // Secure API token (secret).

export async function pushToVercel(args: {
  fs: t.Fs;
  version: string;
  source: string;
  bus?: t.EventBus<any>;
}): Promise<t.LogDeploymentEntry> {
  const { fs, version, source } = args;
  const bus = args.bus ?? rx.bus();
  const vercel = Vercel.client({ bus, token, fs });

  const res = await vercel.deploy({
    team: 'tdb',
    name: `${Pkg.name}.v${Pkg.version}`,

    // project: 'tdb-undp',
    // alias: 'undp.db.team',

    project: 'tdb-tmp',
    alias: 'tmp.db.team',

    source,
    ensureProject: true,
    regions: ['sfo1'],
    target: 'production', // NB: required to be "production" for the DNS alias to be applied.
    silent: false, // Standard BEFORE and AFTER deploy logging to console.
    timeout: 30000,
  });

  console.info(pc.bold(pc.green(`version: ${pc.white(version)}`)));

  return {
    kind: 'vercel:deployment',
    status: res.status,
    success: res.deployment,
    error: res.error,
  };
}
