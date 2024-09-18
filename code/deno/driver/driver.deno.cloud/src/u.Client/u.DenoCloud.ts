import { type t } from './common/mod.ts';
import { client } from './u.DenoCloud.Client.ts';

/**
 * Client for working with a DenoCloud server HTTP endpoint.
 */
export const DenoCloud: t.DenoCloudClientLib = {
  client,
};
