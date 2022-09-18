import { t, Path, Delete } from './common/index.mjs';

type Id = string;

export function VercelHttpDeploymentFiles(args: {
  ctx: t.Ctx;
  teamId: Id;
  deploymentId: Id;
  url: string;
  list: t.VercelDeploymentFile[];
}): t.VercelHttpDeploymentFiles {
  const { ctx, list, teamId, deploymentId } = args;
  const { http, fs } = ctx;

  if (!args.url) {
    throw new Error(`An public endpoint URL is required.`);
  }

  const baseUrl = Path.trimHttpPrefix(args.url);

  const api: t.VercelHttpDeploymentFiles = {
    list,

    /**
     * Save the deployment files locally.
     */
    async pull(targetDir) {
      /**
       * TODO 🐷
       * - recursively save [children] folders.
       */
      type F = t.VercelDeploymentFile;
      type Error = t.VercelHttpFilesPullError;

      const results: { ok: boolean; file: F; error?: Error }[] = [];
      const result = (
        ok: boolean,
        dir: string,
        file: F,
        options: { error?: string; url?: string } = {},
      ) => {
        const { url = '' } = options;
        const error: Error | undefined = options.error
          ? { message: options.error, dir, file: { id: file.uid, name: file.name }, url }
          : undefined;
        results.push({ ok, file, error });
      };

      const saveFile = async (dir: string, file: F) => {
        let path = Path.join(dir, file.name);

        if (!path.startsWith('src/')) return;
        path = path.replace(/^src\//, '');

        const url = `${baseUrl}/${path}`;
        const res = await http.get(url);

        console.log(res.status, path);

        if (res.ok) {
          const out = Path.join(targetDir, path);
          await fs.write(out, res.body);
        }

        if (!res.ok) {
          console.log('FAIL', path);
        }

        return result(true, dir, file);
      };

      const saveDirectory = async (dir: string, file: F) => {
        await Promise.all(file.children.map((file) => save(dir, file)));
      };

      const save = async (dir: string, file: F) => {
        if (file.type === 'file') return saveFile(dir, file);
        if (file.type === 'directory') return saveDirectory(Path.join(dir, file.name), file);
        result(false, dir, file, { error: `File type '${file.type}' not supported.` });
      };

      // Process files.
      await Promise.all(list.map((file) => save('', file)));
      const errors = results.map((item) => item.error as Error).filter(Boolean);
      const ok = results.every((item) => item.ok);

      // Finish up.
      return Delete.undefined({ ok, errors });
    },
  };

  return api;
}
