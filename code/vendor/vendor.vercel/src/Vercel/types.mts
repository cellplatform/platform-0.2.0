import type * as t from '../common/types.mjs';

type Name = string;

/**
 * Represents a deployment.
 */
export type VercelDeploy = t.Disposable & {
  client: t.VercelHttp;
  team: Name;
  project: Name;
  info(): Promise<t.VercelSourceBundleInfo>;
  manifest<T extends t.Manifest>(): Promise<T | undefined>;
  commit(
    config?: t.VercelHttpDeployConfig,
    options?: VercelDeploymentCommitOptions,
  ): Promise<t.VercelHttpDeployResponse>;
  ensureProject(projectName: string): Promise<VercelDeploymentEnsureProjectRes>;
};

export type VercelDeploymentCommitOptions = {
  ensureProject?: boolean;
};

export type VercelDeploymentEnsureProjectRes = {
  ok: boolean;
  created: boolean;
  project: t.VercelHttpTeamProject;
  error: t.VercelHttpError | undefined;
};
