import { type t } from './u.ts';

/**
 * Home
 */
export function init(path: string, app: t.HonoApp) {
  app.get(path, (c) => {
    const about = `tdb ← (🦄 team:db)`;
    return c.text(about);
  });
}
