import { type t } from './u.ts';
import { routes as ai } from './app.routes.openai.ts';

/**
 * Home
 */
export function root(app: t.HonoApp) {
  app.get('/', (c) => {
    const about = `tdb ← (🦄 team:db)`;
    return c.text(about);
  });
}

/**
 * Route index.
 */
export const Routes = {
  root,
  ai,
} as const;
