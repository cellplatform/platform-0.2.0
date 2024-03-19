import { HistoryGrid } from '../ui.History.Grid';
import { DEFAULTS, Doc, Value, type t } from './common';
import { HistoryCommitRow } from './ui.History.Commit';
import { HistoryValue } from './ui.History.Value';
import { NavPaging } from '../ui.Nav.Paging';

type D = t.InfoDataHistory;

export function history(data: D | undefined, fields: t.InfoField[], theme?: t.CommonTheme) {
  if (!data) return;
  const res: t.PropListItem[] = [];
  const doc = data.doc;

  const showGenesis = fields.includes('History.Genesis');
  const main: t.PropListItem = {
    label: data.label || DEFAULTS.history.label,
    value: <HistoryValue doc={doc} showGenesis={showGenesis} theme={theme} />,
  };
  res.push(main);

  /**
   * History.
   */
  if (fields.includes('History.List')) {
    const style: React.CSSProperties = { flex: 1, marginLeft: 0 };
    const list = wrangle.page(data);

    list.forEach(({ index, commit }) => {
      const hash = commit.change.hash;
      res.push({
        divider: false,
        value: (
          <HistoryCommitRow
            style={style}
            index={index}
            total={list.length}
            commit={commit}
            theme={theme}
            showDetail={hash === data.list?.showDetailFor}
            onItemClick={data.onItemClick}
          />
        ),
      });
    });

    /**
     * History List (Grid).
     */
    const showNav = fields.includes('History.List.NavPaging');
    res.push({
      value: <HistoryGrid theme={theme} style={{ flex: 1 }} />,
      divider: !showNav,
    });

    /**
     * Navigation (Paging).
     */
    if (showNav) {
      res.push({ value: <NavPaging theme={theme} style={{ flex: 1 }} /> });
    }
  }

  return res;
}

/**
 * Helpers
 */
const wrangle = {
  page(data: D) {
    const doc = data.doc;
    if (!doc) return [];

    const defaults = DEFAULTS.history.list;
    const { sort = defaults.sort, page = defaults.page, limit = defaults.limit } = data.list ?? {};

    const commits = Doc.history(doc).commits;
    const list = commits.map((commit, index) => ({ index, commit }));
    if (sort === 'desc') list.reverse();

    return Value.page(list, page, limit);
  },
} as const;
