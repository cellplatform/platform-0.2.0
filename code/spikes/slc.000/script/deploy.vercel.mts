import pc from 'picocolors';
import { rx } from 'sys.util';
import { Vercel } from 'ext.vercel';

import { type t } from '../src/common';
import { Pkg } from '../src/index.pkg.mjs';

const token = process.env.VERCEL_TEST_TOKEN || ''; // Secure API token (secret).

export async function pushToVercel(args: {
  fs: t.Fs;
  version: string;
  source: string;
  bus?: t.EventBus<any>;
}): Promise<t.LogDeploymentEntry> {
  //
  const { fs, version, source } = args;
  const bus = args.bus ?? rx.bus();
  const vercel = Vercel.client({ bus, token, fs });

  const res = await vercel.deploy({
    name: `${Pkg.name}.v${Pkg.version}`,
    source,
    team: 'tdb',

    // project: 'slc-dev',
    // alias: 'dev.socialleancanvas.com',

    project: 'slc-prod',
    alias: 'socialleancanvas.com',

    ensureProject: true,
    regions: ['sfo1'],
    target: 'production', // NB: required to be "production" for the DNS alias to be applied.
    silent: false, // Standard BEFORE and AFTER deploy logging to console.
    timeout: 99999,
    vercelJson: {
      cleanUrls: true,
      trailingSlash: true,
      redirects: [{ source: '/d/', destination: '/?dev' }],
      rewrites: [
        { source: '/:root/', destination: '/' },
        { source: '/:root/lib/:path', destination: '/lib/:path' },
      ],
    },
  });

  console.info(pc.bold(pc.green(`version: ${pc.white(version)}`)));

  return {
    kind: 'vercel:deployment',
    status: res.status,
    success: res.deployment,
    error: res.error,
  };
}
