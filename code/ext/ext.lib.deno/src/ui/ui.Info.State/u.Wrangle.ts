import { DEFAULTS, DenoHttp, PatchState, R, type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  state(initial: t.InfoData = {}): t.Immutable<t.InfoData, t.PatchOperation> {
    return PatchState.create(initial);
  },

  client(data: t.InfoData): t.DenoHttpClient {
    const options: t.DenoHttpOptions = R.merge(DEFAULTS.endpoint, data.endpoint ?? {});
    return DenoHttp.client(options);
  },

  projects: (d: t.InfoData) => d.projects || (d.projects = {}),
} as const;
