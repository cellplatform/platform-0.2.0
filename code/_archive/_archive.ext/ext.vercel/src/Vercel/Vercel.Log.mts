import { t, pc, asArray } from './common';

export const VercelLog = {
  /**
   * Display output before a deployment is pushed to the cloud.
   */
  async beforeDeploy(args: {
    info: t.VercelSourceBundleInfo;
    alias?: string | string[];
    project?: string;
  }) {
    const { info, project } = args;
    const alias = asArray(args.alias);

    console.info('');
    console.info(pc.gray('deploying:'));
    console.info(pc.gray(` • name:    ${pc.white(info.name)}`));
    console.info(pc.gray(` • size:    ${info.files.toString()}`));
    if (project) console.info(pc.gray(` • project: ${project}`));
    alias.forEach((alias) => console.info(pc.gray(` • alias:   ${pc.green(alias)}`)));
    console.info('');

    return { info };
  },

  /**
   * Display output after a deployment is pushed to the cloud.
   */
  async afterDeploy(res: t.VercelHttpDeployResponse | t.VercelDeployRes) {
    const { status } = res;
    const ok = !Boolean(res.error);
    const name = res.deployment?.name ?? '';
    const urls = res.deployment?.urls;

    const logUrl = (url: string) => {
      const isVercel = url.includes('vercel');
      const text = isVercel ? pc.gray(url) : pc.white(url);
      console.info(pc.gray(` • ${text}`));
      if (!isVercel) console.info(pc.gray(` • ${text}?dev`));
    };

    console.info(ok ? pc.green(status) : pc.yellow(status));
    console.info(pc.gray(name));

    if (urls) {
      logUrl(urls.inspect);
      urls.public.forEach((url) => logUrl(url));
    }

    if (res.error) console.info(pc.yellow('error'), res.error);
    console.info('');
  },
};
