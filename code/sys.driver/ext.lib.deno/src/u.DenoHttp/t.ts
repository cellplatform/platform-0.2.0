import type { t } from './common';

export type DenoHttpOrigins = { local: string; remote: string };
export type DenoHttpOptions = {
  origins?: Partial<DenoHttpOrigins>;
  accessToken?: string;
  forcePublic?: boolean;
};

/**
 * Client (HTTP)
 * https://docs.deno.com/subhosting
 */
export type DenoHttpClient = {
  readonly url: { endpoint: string; host: string };
  readonly projects: DenoHttpClientProjects;
  deployments(project: t.IdString): DenoHttpClientDeployments;
  deploy(project: t.IdString, body: t.DenoDeployArgs): Promise<DeployRes>;
};

/**
 * Client: Projects.
 */
export type DenoHttpClientProjects = {
  list(params?: t.DenoListProjectsParams): Promise<ProjectsListRes>;
};
type ProjectsListRes = { ok: boolean; status: number; projects: t.DenoProject[] };

/**
 * Client: Deployments.
 */
export type DenoHttpClientDeployments = {
  list(params?: t.DenoListDeploymentsParams): Promise<DeploymentsListRes>;
};
type DeploymentsListRes = { ok: boolean; status: number; deployments: t.DenoDeployment[] };

/**
 * Client: Deploy
 */
export type DeployRes = {
  ok: boolean;
  status: number;
  id: t.IdString;
  whenReady(options?: { retry?: number }): Promise<t.DenoDeployment | undefined>;
};
