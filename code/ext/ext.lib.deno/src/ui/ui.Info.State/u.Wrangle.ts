import { DEFAULTS, Http, PatchState, R, type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  state(initial: t.InfoData = {}): t.Immutable<t.InfoData> {
    return PatchState.init({ initial });
  },

  client(data: t.InfoData): t.HttpClient {
    const options: t.HttpOptions = R.merge(DEFAULTS.endpoint, data.endpoint ?? {});
    return Http.client(options);
  },

  projects: (d: t.InfoData) => d.projects || (d.projects = {}),
} as const;
