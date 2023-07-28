import { rx, t, slug } from './common.mjs';

import { VercelBus } from '../Vercel.Bus/index.mjs';
import { VercelFs } from './Vercel.Fs.mjs';
import { VercelInfo } from './Vercel.Info.mjs';
import { VercelLog } from './Vercel.Log.mjs';

type Id = string;
type ApiToken = string;
type DeployArgs = t.VercelEventsDeployArgs & { silent?: boolean };

/**
 * Create an API client to interact with the Vercel system (using an EventBus).
 */
export function client(args: { bus?: t.EventBus<any>; token: ApiToken; fs: t.Fs; instance?: Id }) {
  const { bus = rx.bus(), token, fs } = args;
  const instance = args.instance ?? `vercel.client.${slug()}`;
  const controller = VercelBus.Controller({ bus, token, fs, instance });
  const { events, dispose } = controller;

  return {
    dispose,
    events,
    deploy: (args: DeployArgs) => deploy(fs, events, args),
  };
}

/**
 * Deploy to the cloud.
 */
export async function deploy(fs: t.Fs, events: t.VercelEvents, args: DeployArgs) {
  const { silent = false, alias, project, name } = args;
  const source =
    typeof args.source === 'string' ? await VercelFs.readdir(fs, args.source) : args.source;

  if (!silent) {
    const info = await VercelInfo.bundle({ fs, source, name });
    VercelLog.beforeDeploy({ info, alias, project });
  }

  const res = await events.deploy.fire(args);

  if (!silent) {
    VercelLog.afterDeploy(res);
  }

  return res;
}
