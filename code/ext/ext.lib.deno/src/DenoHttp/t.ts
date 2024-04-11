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
};

/**
 * Client: Projects.
 */
export type DenoHttpClientProjects = {
  list(params?: t.DenoListProjectsParams): Promise<ProjectsList>;
};
type ProjectsList = { ok: boolean; status: number; projects: t.DenoProject[] };

/**
 * Client: Deployments.
 */
export type DenoHttpClientDeployments = {
  list(params?: t.DenoListDeploymentsParams): Promise<DeploymentsList>;
};
type DeploymentsList = { ok: boolean; status: number; deployments: t.DenoDeployment[] };
