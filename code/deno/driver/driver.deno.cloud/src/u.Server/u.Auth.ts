import { type t } from './common/mod.ts';

export const Auth: t.AuthLib = {
  /**
   * Security middleware.
   */
  middleware(ctx: t.RouteContext, options: { enabled?: boolean } = {}) {
    const { enabled = true } = options;

    const allowedPaths = ['/'];
    const isAllowedPath = (url: t.StringUrl) => allowedPaths.find((path) => url.startsWith(path));

    return async (c, next) => {
      if (!enabled) return await next(); // NB: auth disabled (eg. running within CI).
      if (isAllowedPath(c.req.url)) return await next();

      console.log('⚡️💦🐷🌳🦄 🍌🧨🌼✨🧫 🐚👋🧠⚠️ 💥👁️💡• ↑↓←→');
      console.log('c.url', c.req.url);

      /**
       * TODO 🐷
       * - to Privy auth checks.
       */
      // const auth = await ctx.auth.verify(c.req.raw);
      // if (!auth.verified) return c.json({ error: 'Unauthorized' }, 401);

      await next();
    };
  },
};
