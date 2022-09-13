import { VercelHttp } from '../Vercel/index.mjs';
import { BusEvents } from './BusEvents.mjs';
import { DEFAULT, rx, slug, t } from './common.mjs';

type Id = string;

/**
 * Event controller.
 */
export function BusController(args: {
  instance: { bus: t.EventBus<any>; id?: Id };
  token: string;
  fs: t.Fs;
  filter?: (e: t.VercelEvent) => boolean;
}) {
  const { token, fs } = args;
  const instance = args.instance.id ?? DEFAULT.id;
  const bus = rx.busAsType<t.VercelEvent>(args.instance.bus);
  const events = BusEvents({ instance: { id: instance, bus }, filter: args.filter });
  const client = VercelHttp({ fs, token });
  const { dispose, dispose$ } = events;

  const teamByNameOrId = async (input: string) => {
    const list = await client.teams.list();
    const record = list.teams.find((team) => team.id === input || team.name === input);
    return record ? client.team(record.id) : undefined;
  };

  /**
   * Info (Module)
   */
  events.info.req$.subscribe(async (e) => {
    const { tx = slug() } = e;

    const endpoint: t.VercelInfo['endpoint'] = await (async () => {
      const res = await client.info();
      const { user, error } = res;
      const alive = Boolean(user && !error);
      return { alive, user, error };
    })();

    const info: t.VercelInfo = { endpoint };

    bus.fire({
      type: 'vendor.vercel/info:res',
      payload: { tx, instance, info },
    });
  });

  /**
   * Deploy
   */
  events.deploy.req$.subscribe(async (e) => {
    const { tx, source, config } = e;

    const done = (options: {
      error?: string;
      paths?: string[];
      deployment?: t.VercelDeployRes['deployment'];
    }) => {
      const { error, deployment, paths = [] } = options;
      return bus.fire({
        type: 'vendor.vercel/deploy:res',
        payload: { tx, instance, paths, deployment, error },
      });
    };

    const team = await teamByNameOrId(e.team);
    if (!team) {
      const error = `Failed to retrieve team: "${e.team}"`;
      return done({ error });
    }

    const project = team.project(e.project);
    const res = await project.deploy({ source, ...config });

    if (res.error) {
      const error = `Failed while deploying. [${res.error.code}] ${res.error.message}`;
      return done({ error });
    }

    const { paths, deployment } = res;
    return done({ paths, deployment });
  });

  /**
   * API
   */
  return {
    instance: { bus: rx.bus.instance(bus), id: instance },
    dispose,
    dispose$,
    events,
  };
}
