import { VercelInfo } from '../Vercel.Info.mjs';
import { asArray, Delete, t, Util, Time } from './common/index.mjs';
import { VercelHttpUploadFiles } from './VercelHttp.Files.Upload.mjs';

/**
 * Create a new deployment.
 *
 * Refs:
 *    HTTP endpoint:
 *    https://vercel.com/docs/api#endpoints/deployments/create-a-new-deployment
 *
 *    vercel.json (config):
 *    https://vercel.com/docs/cli#project/redirects
 *
 */
export async function VercellHttpDeploy(
  args: t.VercelHttpDeployArgs & {
    ctx: t.Ctx;
    team: { id: string; name: string };
    project: { id: string; name: string };
    silent?: boolean;
  },
): Promise<t.VercelHttpDeployResponse> {
  const timer = Time.timer();

  const { ctx, source, team, project, beforeUpload, silent = false } = args;
  const { http, fs, headers } = ctx;
  const teamId = team.id;

  if (typeof source === 'string' && !(await fs.is.dir(source))) {
    throw new Error(`The source path is not a directory. ${source}`);
  }

  /**
   * Upload files.
   */
  const uploaded = await (async () => {
    const client = VercelHttpUploadFiles({ ctx, teamId });
    const res = await client.upload(source, { beforeUpload });
    const { ok, error, total } = res;
    const files = res.files.map((item) => item.file);

    const errors = res.files
      .filter((item) => Boolean(item.error))
      .map(({ file, error }) => {
        const code = error?.code ? `[${error?.code}] ` : '';
        return `${file.file}: ${code}${error?.message}`;
      });

    return Delete.undefined({
      ok,
      files,
      error,
      errors,
      total,
    });
  })();

  if (!uploaded.ok) {
    const { total } = uploaded;

    if (!silent) {
      const total = uploaded.errors.length;
      console.log('Failed Uploading:');
      uploaded.errors.forEach((item, i) => console.info(`${i + 1} of ${total}`, item));
      console.log();
    }

    throw new Error(`Failed uploading ${total.failed} of ${total.files} files.`);
  }

  const files = uploaded.files;
  const paths = files.map(({ file }) => file);
  const bytes = files.reduce((acc, next) => acc + next.size, 0);

  /**
   * Append the deployment's {meta} data object with
   * the manifest {module} details.
   */
  const info = await VercelInfo.bundle({ fs, source, name: args.name });
  const { name, meta } = info;

  /**
   * HTTP BODY
   * Request Parameters:
   *    https://vercel.com/docs/api#endpoints/deployments/create-a-new-deployment/request-parameters
   */
  const alias = asArray(args.alias).filter(Boolean) as string[];

  const target = args.target;
  const body = {
    name,
    project: project.id,
    meta,
    env: args.env,
    'build.env': args.buildEnv,
    functions: args.functions,
    routes: args.routes,
    regions: args.regions,
    public: args.public,
    target,
    alias,
    files,
  };

  const url = ctx.url(12, 'deployments', { teamId: team.id });
  const res = await http.post(url, body, { headers });
  const json = (res.json ?? {}) as any;

  /**
   * Response
   */
  const { ok, status } = res;
  const elapsed = timer.elapsed.msec;
  const error = ok ? undefined : (json.error as t.VercelHttpError);
  const aliasUrls = target !== 'production' ? [] : alias.map((url) => `https://${url}`);
  const urls = {
    inspect: Util.ensureHttps(json.inspectorUrl),
    public: [Util.ensureHttps(json.url), ...aliasUrls],
  };

  const deployment: t.VercelHttpDeployResponse['deployment'] = {
    id: json.id ?? '',
    name,
    team: { name: team.name, id: team.id },
    project: { name: project.name, id: project.id },
    target,
    regions: json.regions ?? [],
    alias,
    meta,
    urls,
    bytes,
    elapsed,
  };

  return Delete.undefined({ ok, status, deployment, paths, error });
}
