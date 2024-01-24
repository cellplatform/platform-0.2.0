import type { t } from '../common';

type UnixEpoch = number;

/**
 * Entry in the log.
 */
export type LogEntry = {
  packagedBy: string;
  timestamp: UnixEpoch;
  bundle: t.BundleLogEntry;
  deployment?: LogDeploymentEntry;
};

/**
 * Deployment
 */
export type LogDeploymentEntry = LogDeploymentEntryVercel;
export type LogDeploymentEntryVercel = {
  kind: 'vercel:deployment';
  status: number;
  success?: t.VercelHttpDeployResponse;
  error?: string;
};

/**
 * A sanatised version of the log sent to the client.
 */
export type LogHistoryPublic = {
  latest: { version: string };
  history: LogHistoryPublicItem[];
};

export type LogHistoryPublicItem = {
  timestamp: number;
  version: string;
  urls: string[];
  error?: string;
};
