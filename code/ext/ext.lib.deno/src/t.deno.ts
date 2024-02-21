type O = Record<string, unknown>;

export type DenoProjectCreateArgs = {
  name?: string;
  description?: string;
};

export type DenoProject = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type DenoProjectListParams = {
  page?: number;
  limit?: number;
  q?: string;
  sort?: 'update_at' | 'name';
  order?: 'asc' | 'desc';
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
