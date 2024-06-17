import { type t } from './common';
import { Wrangle } from './u.Wrangle';

type C = t.DenoHttpClient;
type S = t.Immutable<t.InfoData, t.PatchOperation>;

/**
 * Helpers for calling the HTTP client and updating an immutable state object.
 */
export const State = {
  /**
   * Pull projects.
   */
  async pullProjects(state: S, client: C) {
    state.change((d) => (Wrangle.projects(d).loading = true));
    const res = await client.projects.list({ sort: 'name' });
    state.change((d) => {
      const projects = Wrangle.projects(d);
      projects.loading = false;
      projects.list = res.ok ? res.projects : [];
      if (!res.ok) projects.error = { message: 'Failed to load projects' };
    });
  },

  /**
   * Override selection handler.
   */
  handlers(state: S, data?: t.InfoData) {
    state.change((d) => {
      Wrangle.projects(d).onSelect = (e) => {
        state.change((d) => (Wrangle.projects(d).selected = e.project.id));
        data?.projects?.onSelect?.(e); // Bubble to base handler.
      };
    });
  },
} as const;
