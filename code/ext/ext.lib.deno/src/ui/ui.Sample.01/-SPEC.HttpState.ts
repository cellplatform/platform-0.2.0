import { R, DenoHttp, type t } from './common';

export type TState = {
  forcePublicUrl?: boolean;
  deno: {
    selectedProject?: string;
    projects: t.DenoProject[];
    deployments: t.DenoDeployment[];
  };
};

export type TImmutableState = t.Immutable<TState, t.PatchOperation>;

export const HttpState = {
  client(state: TImmutableState) {
    const forcePublic = state.current.forcePublicUrl;
    return DenoHttp.client({ forcePublic });
  },

  async updateProjects(state: TImmutableState) {
    const client = HttpState.client(state);
    const res = await client.projects.list({ sort: 'name' });
    state.change((d) => (d.deno.projects = res.projects));
  },

  async updateDeployments(state: TImmutableState) {
    const client = HttpState.client(state);
    const projectId = state.current.deno.selectedProject;
    if (projectId) {
      const uniq = R.uniqBy(R.prop('id'));
      const res = await client.deployments(projectId).list({ order: 'desc' });

      console.log('deployments', res.deployments);

      state.change((d) => {
        let next = [...d.deno.deployments, ...res.deployments];
        next = next.filter((d) => d.status === 'success');
        next = uniq(next);
        d.deno.deployments = next;
      });
    }
  },
};
