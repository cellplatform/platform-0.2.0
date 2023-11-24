import { Data } from './Data';
import { StoreIndex, rx, type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  item$(item: t.RepoItemCtx) {
    const mode = () => Data.item(item).mode;
    return {
      action$(action: t.RepoListAction, kind?: t.RepoListActionCtx['kind']) {
        return item.events.cmd.action.kind(action).pipe(
          rx.filter((e) => mode() === 'Doc'), // NB: defensive guard.
          rx.map((e) => e.ctx as t.RepoListActionCtx),
          rx.filter((e) => (kind ? e.kind === kind : true)),
        );
      },
    } as const;
  },

  filterDocs(index: t.RepoIndex, filter?: t.RepoIndexFilter): t.RepoIndexDoc[] {
    return StoreIndex.filter(index.docs, filter);
  },
} as const;
