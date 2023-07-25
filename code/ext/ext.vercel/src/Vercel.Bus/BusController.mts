import { VercelHttp } from '../Vercel/index.mjs';
import { BusEvents } from './BusEvents.mjs';
import { DEFAULT, rx, slug, t } from './common.mjs';

type Id = string;

/**
 * Event controller.
 */
export function BusController(args: {
  bus: t.EventBus<any>;
  token: string;
  fs: t.Fs;
  instance?: Id;
  filter?: t.VercelEventFilter;
}) {
  const { token, fs } = args;
  const instance = args.instance ?? DEFAULT.id;
  const bus = rx.busAsType<t.VercelEvent>(args.bus);
  const events = BusEvents({ bus, instance, filter: args.filter });
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
      status: number;
      error?: string;
      paths?: string[];
      deployment?: t.VercelDeployRes['deployment'];
    }) => {
      const { status, error, deployment, paths = [] } = options;
      return bus.fire({
        type: 'vendor.vercel/deploy:res',
        payload: { tx, instance, status, paths, deployment, error },
      });
    };

    const team = await teamByNameOrId(e.team);
    if (!team) {
      const error = `Failed to retrieve team: "${e.team}"`;
      return done({ status: 500, error });
    }

    const project = team.project(e.project);
    const projectExists = await project.exists();

    if (!projectExists) {
      if (e.ensureProject) {
        const res = await project.create();
        if (res.error) return done({ status: 500, error: res.error.message });
      } else {
        const error = `The project "${e.project}" does not exist. Hint: pass [ensureProject] flag to automatically create.`;
        return done({ status: 404, error });
      }
    }

    const res = await project.deploy({ source, ...config });
    const { status, paths, deployment } = res;

    if (res.error) {
      const error = `Failed while deploying. [${res.error.code}] ${res.error.message}`;
      return done({ status, error });
    }

    return done({ status, paths, deployment });
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
