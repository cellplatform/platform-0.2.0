import { Server, type t } from './common/mod.ts';
import { Auth } from './u.Auth.ts';
import { Routes } from './u.Routes.ts';

type A = t.DenoCloudServerArgs;

/**
 * Initialize a new HTTP server.
 */
export function server(args: A) {
  const { env } = args;
  const app = Server.create();
  const auth = wrangle.auth(args);
  const ctx: t.RouteContext = { app, auth, env };

  // Configure HTTP server.
  app.use('*', wrangle.authMiddleware(args, ctx));
  Routes.root(ctx);
  Routes.subhosting('/subhosting', ctx);

  // Finish up.
  return app;
}

/**
 * Helpers
 */
const wrangle = {
  auth(args: A) {
    const privy = args.env.privy;
    return Server.Auth.ctx(privy.appId, privy.appSecret);
  },

  authMiddleware(args: A, ctx: t.RouteContext) {
    const enabled = args.authEnabled ?? true;
    return Auth.middleware(ctx, { enabled });
  },
} as const;
