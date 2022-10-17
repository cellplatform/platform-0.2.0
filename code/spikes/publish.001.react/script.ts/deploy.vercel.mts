import { Vercel } from 'cloud.vercel';
import { rx } from 'sys.util';

import { t } from '../src/common/index.mjs';
import pc from 'picocolors';

export async function pushToVercel(args: {
  fs: t.Fs;
  token: string;
  version: string;
  bus?: t.EventBus<any>;
}) {
  const { fs, token, version } = args;
  const bus = args.bus ?? rx.bus();

  const vercel = Vercel.client({ bus, token, fs });
  await vercel.deploy({
    team: 'tdb',
    name: `tdb.undp.v${version}`,
    project: 'tdb-undp',
    source: '', // NB: Root directory
    alias: 'undp.db.team',
    ensureProject: true,
    regions: ['sfo1'],
    target: 'production', // NB: required to be "production" for the DNS alias to be applied.
    silent: false, // Standard BEFORE and AFTER deploy logging to console.
  });

  console.info(pc.bold(pc.green(`version: ${pc.white(version)}`)));
}
