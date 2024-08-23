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
  deploy(project: t.IdString, body: t.DenoDeployArgs): Promise<DeployResponse>;
};

/**
 * Client: Projects.
 */
export type DenoHttpClientProjects = {
  list(params?: t.DenoListProjectsParams): Promise<ProjectsListResponse>;
};
type ProjectsListResponse = {
  ok: boolean;
  status: number;
  projects: t.DenoProject[];
};

/**
 * Client: Deployments.
 */
export type DenoHttpClientDeployments = {
  list(params?: t.DenoListDeploymentsParams): Promise<DeploymentsListResponse>;
};
type DeploymentsListResponse = {
  ok: boolean;
  status: number;
  deployments: t.DenoDeployment[];
};

/**
 * Client: Deploy
 */
export type DeployResponse = {
  ok: boolean;
  status: number;
  deploymentId: t.IdString;
  whenReady: WhenReadyMethod;
};

export type WhenReadyMethod = (options?: WhenReadyOptions) => Promise<WhenReadyResponse>;
export type WhenReadyOptions = { retry?: number; silent?: boolean };
export type WhenReadyStatus = t.DenoDeployment['status'] | 'UNKNOWN';
export type WhenReadyResponse = {
  ok: boolean;
  status: WhenReadyStatus;
  id: { deployment: t.IdString; project: t.IdString };
  deployment?: t.DenoDeployment;
};
