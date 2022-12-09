import * as t from '../common/types.mjs';

type UnixEpoch = number;

/**
 * Entry in the log.
 */
export type LogEntry = {
  packagedBy: string;
  timestamp: UnixEpoch;
  bundle: t.BundleLogEntry;
  deployment?: DeploymentLogEntry;
};

/**
 * Deployment
 */
export type DeploymentLogEntry = DeploymentLogEntryVercel;
export type DeploymentLogEntryVercel = {
  kind: 'vercel:deployment';
  status: number;
  success?: t.VercelHttpDeployResponse['deployment'];
  error?: string;
};

/**
 * A sanatised version of the log sent to the client.
 */
export type LogPublicHistory = {
  latest: { version: string };
  history: LogPublicHistoryItem[];
};

export type LogPublicHistoryItem = {
  timestamp: number;
  version: string;
  urls: string[];
  error?: string;
};
