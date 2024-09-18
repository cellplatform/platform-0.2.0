/**
 * Types that map to the RESTful API documented:
 *  - https://docs.deno.com/subhosting/manual
 */
type O = Record<string, unknown>;
type DateTimeString = string;

export type DenoListParams<TSort extends string> = {
  page?: number;
  limit?: number;
  q?: string;
  sort?: TSort;
  order?: 'asc' | 'desc';
};

export type DenoListProjectsParams = DenoListParams<'name' | 'updated_at'>;
export type DenoListDeploymentsParams = DenoListParams<'id' | 'created_at'>;

/**
 * Project
 */
export type DenoProjectCreateArgs = {
  name?: string;
  description?: string;
};

export type DenoProject = {
  id: string;
  name: string;
  description: string;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
};

/**
 * Deployment
 */
export type DenoDeployment = {
  id: string;
  projectId: string;
  description: string;
  status: 'failed' | 'pending' | 'success';
  domains: string[];
  databases: { [key: string]: string };
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
};

export type DenoDeployArgs = {
  entryPointUrl: string;
  assets: DenoDeployAssets;
  envVars: O;
};

export type DenoDeployAssets = { [name: string]: DenoDeployAsset };
export type DenoDeployAsset = {
  kind: 'file';
  content: string;
  encoding: 'utf-8';
};
