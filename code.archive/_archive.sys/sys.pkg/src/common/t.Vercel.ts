export type VercelHttpDeployResponse = {
  id: string;
  name: string;
  team: { name: string; id: string };
  project: { name: string; id: string };
  regions: string[];
  target: 'staging' | 'production' | undefined;
  alias: string[];
  meta: VercelHttpDeployMeta;
  urls: { inspect: string; public: string[] };
  bytes: number;
  elapsed: number;
};

/**
 * Deployment Meta-data.
 */
type MetaCommon = {
  bytes: string;
  fileshash: string; // Hash of all file-hashes within the bundle (sorted by name).
};

export type VercelHttpDeployMeta = VercelHttpDeployMetaModule | VercelHttpDeployMetaPlainFiles;
export type VercelHttpDeployMetaModule = MetaCommon & {
  kind: 'bundle:code/module';
  namespace: string;
};
export type VercelHttpDeployMetaPlainFiles = MetaCommon & {
  kind: 'bundle:plain/files';
};

/**
 * Vercel configuration file ("vercel.json").
 * REF
 *    https://vercel.com/docs/project-configuration
 */
export type VercelConfigFile = {
  regions?: string[];
  public?: boolean;
  cleanUrls?: boolean;
  trailingSlash?: boolean;
  redirects?: VercelConfigRedirect[];
  rewrites?: VercelConfigRewrite[];
  headers?: VercelConfigHeader[];
};
export type VercelConfigRedirect = { source: string; destination: string };
export type VercelConfigRewrite = { source: string; destination: string };

/**
 * Vercel configuration: Headers
 * REF
 *    https://vercel.com/docs/project-configuration#project-configuration/headers
 */
export type VercelConfigKeyValue = { key: string; value: string };
export type VercelConfigHeader = {
  source: string;
  headers: VercelConfigKeyValue[];
  has?: VercelConfigHeaderHas;
};
export type VercelConfigHeaderHas = {
  type: 'header' | 'cookie' | 'host' | 'query';
  key?: string;
  value?: string;
};
