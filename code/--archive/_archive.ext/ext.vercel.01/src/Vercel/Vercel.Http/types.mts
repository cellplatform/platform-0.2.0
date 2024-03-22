import type * as t from './common/types.mjs';

type Id = string;
type Name = string;
type Semver = string;
type Timestamp = number; // An Integer representing a date in milliseconds since the UNIX epoch.
type Res = VercelHttpResponse;
type Sha1 = string;
type Mime = string;
type Milliseconds = number;
type FilePath = string;
type DirPath = string;
type Q = Record<string, string | number | undefined>;

export type VercelMeta = { key: string; value: string };
export type VercelTargetFlag = 'staging' | 'production';

export type VercelHttpResponse = {
  ok: boolean;
  status: number;
  error?: t.VercelHttpError;
};

/**
 * Wrapper around the HTTP end-point.
 * https://vercel.com/docs/api
 */
export type VercelHttp = {
  ctx: VercelHttpCtx;
  info(): Promise<Res & { user?: t.VercelHttpUser }>;
  teams: VercelHttpTeams;
  team(id: string): VercelHttpTeam;
};

export type VercelHttpHeaders = { [key: string]: string };
export type VercelHttpCtx = {
  fs: t.Fs;
  http: t.Http;
  headers: VercelHttpHeaders;
  token: string;
  Authorization: string;
  url(version: number, path: string, query?: Q): string;
};

/**
 * https://vercel.com/docs/rest-api#endpoints/user/get-the-authenticated-user
 */
export type VercelHttpUser = {
  uid: string;
  email: string;
  name: string;
  username: string;
  avatar: string;
};

export type VercelHttpTeams = {
  /**
   * https://vercel.com/docs/api#endpoints/teams/list-all-your-teams
   */
  list(): Promise<Res & { teams: t.VercelTeam[] }>;

  /**
   * Retrieve a team by name.
   */
  byName(name: Name): Promise<VercelHttpTeam | undefined>;
};

/**
 * Operations on a team.
 */
export type VercelHttpTeam = {
  id: Id;

  /**
   * https://vercel.com/docs/api#endpoints/teams/get-single-team-information
   */
  info(): Promise<Res & { team: t.VercelTeam }>;

  /**
   * https://vercel.com/docs/api#endpoints/projects
   */
  projects(options?: {
    limit?: number; // Limit the number of projects returned.
    since?: Timestamp; // The updatedAt point where the list should [start].
    until?: Timestamp; // The updatedAt point where the list should [end].
    search?: string; // Search projects by the name field.
  }): Promise<Res & { projects: t.VercelProject[] }>;

  project(name: string): VercelHttpTeamProject;

  /**
   * https://vercel.com/docs/api#endpoints/deployments/list-deployments
   */
  deployments(options?: {
    limit?: number; // Maximum number of deployments to list from a request. (default: 5, max: 100)
    from?: Timestamp; // Get the deployment created after this Date timestamp. (default: current time)
    projectId?: Id; // Filter deployments from the given project identifier.
    filter?: VercelMeta | VercelMeta[]; // meta-[KEY]. Filter deployments by the given meta key value pairs. e.g., meta-githubDeployment=1.
  }): Promise<Res & { deployments: t.VercelListDeployment[] }>;

  deployment(url: string): VercelHttpTeamDeployment;
};

/**
 * Operations on a single project within a team.
 */
export type VercelHttpTeamProject = {
  team: VercelHttpTeam;
  name: string;
  exists(): Promise<boolean>;

  /**
   * https://vercel.com/docs/api#endpoints/projects/get-a-single-project
   */
  info(): Promise<Res & { project: t.VercelProject }>;

  /**
   * https://vercel.com/docs/api#endpoints/projects/create-a-project
   */
  create(options?: { git?: t.VercelGitRepo }): Promise<Res & { project: t.VercelProject }>;

  /**
   * https://vercel.com/docs/api#endpoints/deployments/create-a-new-deployment
   */
  deploy(args: VercelHttpDeployArgs): Promise<VercelHttpDeployResponse>;
};

/**
 * Operations on a single deployment within a team.
 */
export type VercelHttpTeamDeployment = {
  team: VercelHttpTeam;
  url: string; // "<id>.vercel.app"
  exists(): Promise<boolean>;

  /**
   * https://vercel.com/docs/api#endpoints/deployments/get-a-single-deployment
   */
  info(): Promise<Res & { deployment: t.VercelDeployment }>;

  /**
   * https://vercel.com/docs/api#endpoints/deployments/list-deployment-files
   */
  files(): Promise<Res & { files: VercelHttpDeploymentFiles }>;
};

/**
 * Upload deployment files.
 * https://vercel.com/docs/api#endpoints/deployments/upload-deployment-files
 */
export type VercelHttpUploadFiles = {
  post(path: FilePath, input: Uint8Array): Promise<VercelHttpUploadPostResponse>;
  upload(
    source: DirPath | VercelSourceBundle,
    options?: VercelHttpUploadFilesOptions,
  ): Promise<VercelHttpUploadResponse>;
};

export type VercelHttpUploadFilesOptions = {
  batch?: number;
  filter?: VercelHttpUploadFilesFilter;
  beforeUpload?: VercelHttpBeforeFileUpload;
};

export type VercelHttpUploadFilesFilter = (path: FilePath) => boolean;

export type VercelHttpBeforeFileUpload = (args: VercelHttpBeforeFileUploadArgs) => Promise<void>; // NB: [undefined] means no change (original data is sent).
export type VercelHttpBeforeFileUploadArgs = {
  path: FilePath;
  data: Uint8Array;
  contentType: Mime;
  modify(input: Uint8Array | string): void;
  toString(): string;
};

export type VercelHttpUploadPostResponse = t.VercelHttpResponse & {
  digest: Sha1;
  contentType: Mime;
  contentLength: number;
  elapsed: Milliseconds;
};

export type VercelHttpUploadResponse = t.VercelHttpResponse & {
  elapsed: Milliseconds;
  total: { files: number; failed: number };
  files: VercelHttpUploadResponseItem[];
};

export type VercelHttpUploadResponseItem = {
  ok: boolean;
  status: number;
  contentType: Mime;
  file: t.VercelFileUpload;
  error?: t.VercelHttpError;
  elapsed: Milliseconds;
};

/**
 * Operations for inspecting and saving a set of deployment files.
 */
export type VercelHttpDeploymentFiles = {
  list: t.VercelDeploymentFile[];
  pull(dir: DirPath): Promise<VercelHttpFilesPullResult>;
};

export type VercelHttpFilesPullResult = { ok: boolean; errors: VercelHttpFilesPullError[] };
export type VercelHttpFilesPullError = {
  message: string;
  dir: DirPath;
  file: { id: Id; name: string };
  url: string;
};

/**
 * Route
 *    A list of routes objects used to rewrite paths to point towards other
 *    internal or external paths.
 *
 *    For example:
 *          [{ "src": "/docs", "dest": "https://docs.example.com" }]
 *
 * Ref:
 *    https://vercel.com/docs/rest-api#endpoints/deployments/create-a-new-deployment/request-parameters
 */
export type VercelRoute = { src: string; dest: string };

/**
 * Deploy
 */
export type VercelFile = { path: string; data?: Uint8Array };
export type VercelManifest = t.Manifest | t.DirManifest | t.ModuleManifest;
export type VercelSourceBundle = { manifest: VercelManifest; files: t.VercelFile[] };

export type VercelSourceBundleInfo = {
  name: string;
  meta: t.VercelHttpDeployMeta;
  source: t.VercelSourceBundle;
  files: {
    hash: Sha1;
    total: number;
    size: { bytes: number; toString(): string };
    toString(): string;
  };
};

/**
 * https://vercel.com/docs/api#endpoints/deployments/create-a-new-deployment
 */
export type VercelHttpDeployArgs = VercelHttpDeployConfig & {
  source: DirPath | VercelSourceBundle;
  beforeUpload?: VercelHttpBeforeFileUpload;
};
export type VercelHttpDeployConfig = {
  name?: string; // A string with the name used in the deployment URL (max 52-chars). Derived from module [namespace@version] if ommited.
  env?: Record<string, string>; // An object containing the deployment's environment variable names and values. Secrets can be referenced by prefixing the value with @.
  buildEnv?: Record<string, string>; // An object containing the deployment's environment variable names and values to be passed to Builds.
  functions?: Record<string, t.VercelFunctionConfig>; // A list of objects used to configure your Serverless Functions.
  routes?: VercelRoute[]; // A list of routes objects used to rewrite paths to point towards other internal or external paths. For example; [{ "src": "/docs", "dest": "https://docs.example.com" }].
  regions?: string[]; // An array of the regions the deployment's Serverless Functions should be deployed to. For example, ["sfo", "bru"].
  public?: boolean; // A boolean representing if the deployment is public or not. By default this is false.
  target?: VercelTargetFlag;
  alias?: string | string[];
  vercelJson?: t.VercelConfigFile;
};

export type VercelHttpDeployResponse = VercelHttpResponse & {
  deployment: {
    id: Id;
    name: Name;
    team: { name: Name; id: Id };
    project: { name: Name; id: Id };
    regions: string[];
    target: VercelTargetFlag | undefined;
    alias: string[];
    meta: VercelHttpDeployMeta;
    urls: { inspect: string; public: string[] };
    bytes: number;
    elapsed: Milliseconds;
  };
  paths: string[];
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
