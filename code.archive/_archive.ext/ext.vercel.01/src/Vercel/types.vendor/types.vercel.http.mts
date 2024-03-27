import type * as t from '../../common/types.mjs';

type Id = string;
type Timestamp = number; // An integer representing a date in milliseconds since the UNIX epoch.

/**
 * Vercel endpoint data-objects.
 *
 * Dervied from documentation at:
 *    https://vercel.com/docs/api#endpoints
 */
export type VercelTargetName = 'development' | 'preview' | 'production';
export type VercelReadyState =
  | 'QUEUED'
  | 'INITIALIZING'
  | 'ANALYZING'
  | 'BUILDING'
  | 'DEPLOYING'
  | 'READY'
  | 'ERROR';

export type VercelHttpError = {
  code: string;
  message: string;
};

export type VercelGitRepo = {
  type: 'github' | 'gitlab' | 'bitbucket';
  repo: string;
};

export type VercelFunctionConfig = { memory: number };

export type VercelTeam = {
  id: Id;
  name: string;
  slug: string;
  createdAt: number;
  updatedAt: number;
};

export type VercelProject = {
  id: Id;
  name: string;
  accountId: Id;
  createdAt: number;
  updatedAt: number;
  env: VercelEnvVariable[];
  targets: { production?: VercelTarget };
};

export type VercelEnvVariable = {
  id: Id;
  type: 'plain' | 'encrypted' | 'secret' | 'system';
  key: string;
  value: string;
  target: VercelTargetName;
  gitBranch?: string;
  createdAt: number;
  updatedAt: number;
};

export type VercelTarget = {
  alias: string[];
  aliasAssigned: number;
  builds: VercelBuild[];
  createdAt: number;
  createdIn: number; // region.
  creator: { uid: Id; email: string; username: string };
  deploymentHostname: string;
  forced: boolean;
  meta: t.JsonMap;
  plan: string; // 'pro' | 'free';
  private: boolean;
  readyState: VercelReadyState;
  target: VercelTargetName | string;
  type: string;
  url: string;
  teamId: Id;
  userId: Id;
  withCache: boolean;
};

export type VercelBuild = { use: string; src: string; config: t.JsonMap };

export type VercelListDeployment = {
  uid: Id;
  name: string;
  url: string;
  created: Timestamp;
  creator: { uid: Id; email: string; username: string };
  state: VercelReadyState;
  meta: t.JsonMap;
  target: VercelTargetName | string;
  aliasError: null | t.VercelHttpError;
  aliasAssigned: Timestamp;
};

export type VercelDeployment = {
  id: Id;
  url: string | null; // A string with the unique URL of the deployment. If it hasn't finished uploading (is incomplete), the value will be null.
  name: string;
  meta: t.JsonMap; // An object containing the deployment's metadata
  plan: string; // The pricing plan the deployment was made under. eg 'pro' | 'free';
  regions?: string[]; // The regions the deployment exists in, eg. ["sfo1"].
  routes?: Record<string, string>[]; // A list of routes objects used to rewrite paths to point towards other internal or external paths. For example; [{ "src": "/docs", "dest": "https://docs.example.com" }].
  functions?: Record<string, VercelFunctionConfig>; // A list of objects used to configure your Serverless Functions.
  public?: boolean; // A boolean representing if the deployment is public or not. By default this is false.
  ownerId: string; // The unique ID of the user or team the deployment belongs to.
  readyState: VercelReadyState;
  createdAt: Timestamp;
  createdIn: string; // The region where the deployment was first created, e.g. "sfo1".
  env: VercelEnvVariable[]; // The keys of the environment variables that were assigned during runtime.
  build: { env: VercelEnvVariable[] }; // The keys of the environment variables that were assigned during the build phase.
  target: VercelTargetName | string; // If defined, either staging if a staging alias in the format <project>.<team>.vercel.app was assigned upon creation, or production if the aliases from alias were assigned.
  alias: string[]; // A list of all the aliases (default aliases, staging aliases and production aliases) that were assigned upon deployment creation.
  aliasError: null | t.VercelHttpError; // An object that will contain a code and a message when the aliasing fails, otherwise the value will be null.
  aliasAssigned: Timestamp;
};

export type VercelDeploymentFile = {
  name: string;
  type: 'file' | 'directory';
  uid: Id;
  children: VercelDeploymentFile[];
};

export type VercelFileUpload = {
  file: string;
  sha: string; // SHA1 digest
  size: number;
};
