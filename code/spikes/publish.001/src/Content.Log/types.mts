import * as t from '../types.mjs';

import type { VercelHttpDeployResponse } from 'cloud.vercel/src/types.mjs';

type UnixEpoch = number;

export type PublicLogSummary = {
  latest: { version: string };
  history: PublicLogHistoryItem[];
};

export type PublicLogHistoryItem = {
  timestamp: number;
  version: string;
  urls?: { inspect: string; public: string[] };
  error?: string;
};

export type LogEntry = {
  timestamp: UnixEpoch;
  bundle: t.BundleLogEntry;
  deployment: DeploymentLogEntry;
};

/**
 * TODO 🐷
 * - Move to /[Content.Deployment] module
 */

type D = VercelHttpDeployResponse['deployment'];
export type DeploymentLogEntry = {
  kind: 'vercel:deployment';
  success?: D;
  error?: string;
};
