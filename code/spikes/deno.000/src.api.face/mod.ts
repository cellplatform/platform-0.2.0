import { Path, type t } from './u.common.ts';

/**
 * FaceAPI
 */
export default function routes(path: string, app: t.HonoApp) {
  app.get(path, (c) => c.text(`faceapi:🦄`));

  app.get(`${path}/models/:name`, async (c) => {
    const name = c.req.param('name');
    const path = Path.resolve('./src.api.face/models', name);
    const exists = await Path.exists(path);
    return exists ? c.body(await Deno.readFile(path)) : c.status(404);
  });
}
