import { firstValueFrom, of, timeout } from 'rxjs';
import { catchError, filter, takeUntil } from 'rxjs/operators';

import { rx, slug, t, DEFAULT } from './common.mjs';

type Id = string;

/**
 * Event API.
 */
export function BusEvents(args: {
  instance: { bus: t.EventBus<any>; id?: Id };
  filter?: (e: t.VercelEvent) => boolean;
}): t.VercelEvents {
  const instance = args.instance.id ?? DEFAULT.id;

  const { dispose, dispose$ } = rx.disposable();
  const bus = rx.busAsType<t.VercelEvent>(args.instance.bus);
  const is = BusEvents.is;

  const $ = bus.$.pipe(
    takeUntil(dispose$),
    filter((e) => is.instance(e, instance)),
    filter((e) => args.filter?.(e) ?? true),
  );

  /**
   * Base information about the vendor module.
   */
  const info: t.VercelEvents['info'] = {
    req$: rx.payload<t.VercelInfoReqEvent>($, 'vendor.vercel/info:req'),
    res$: rx.payload<t.VercelInfoResEvent>($, 'vendor.vercel/info:res'),
    async get(options = {}) {
      const { timeout: msecs = 90000 } = options;
      const tx = slug();

      const first = firstValueFrom(
        info.res$.pipe(
          filter((e) => e.tx === tx),
          timeout(msecs),
          catchError(() => of(`ModuleInfo request timed out after ${msecs} msecs`)),
        ),
      );

      bus.fire({
        type: 'vendor.vercel/info:req',
        payload: { tx, instance },
      });

      const res = await first;
      return typeof res === 'string' ? { tx, instance, error: res } : res;
    },
  };

  /**
   * Deploy
   */
  const deploy: t.VercelEvents['deploy'] = {
    req$: rx.payload<t.VercelDeployReqEvent>($, 'vendor.vercel/deploy:req'),
    res$: rx.payload<t.VercelDeployResEvent>($, 'vendor.vercel/deploy:res'),
    async fire(args) {
      const { source, team, project, timeout: msecs = 10000 } = args;
      const { name, env, buildEnv, functions, routes, target, alias } = args;
      const config = { name, env, buildEnv, functions, routes, target, alias, public: args.public };

      const tx = slug();

      const first = firstValueFrom(
        deploy.res$.pipe(
          filter((e) => e.tx === tx),
          timeout(msecs),
          catchError(() => of(`Deploy request timed out after ${msecs} msecs`)),
        ),
      );

      bus.fire({
        type: 'vendor.vercel/deploy:req',
        payload: { tx, instance, source, team, project, config },
      });

      const res = await first;
      return typeof res === 'string' ? { tx, instance, paths: [], error: res } : res;
    },
  };

  /**
   * API
   */
  return {
    instance: { bus: rx.bus.instance(bus), id: instance },
    $,
    is,
    dispose,
    dispose$,
    info,
    deploy,
  };
}

/**
 * Event matching.
 */
const matcher = (startsWith: string) => (input: any) => rx.isEvent(input, { startsWith });
BusEvents.is = {
  base: matcher('vendor.vercel/'),
  instance: (e: t.Event, instance: Id) => BusEvents.is.base(e) && e.payload?.instance === instance,
};
