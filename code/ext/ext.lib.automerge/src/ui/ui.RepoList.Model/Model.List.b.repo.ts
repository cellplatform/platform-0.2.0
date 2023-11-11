import { WebStore, rx, type t } from './common';

export async function repoListenerBehavior(args: { store: t.WebStore; ctx: t.RepoListCtxGet }) {
  const { store, ctx } = args;
  const life = rx.lifecycle(ctx().dispose$);
  const index = await WebStore.index(store);
  const indexEvents = index.doc.events(life.dispose$);

}
