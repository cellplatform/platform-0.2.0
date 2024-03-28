import { Doc } from '../../crdt';
import { HistoryGrid } from '../ui.History.Grid';
import { NavPaging } from '../ui.Nav.Paging';
import { DEFAULTS, Is, type t } from './common';
import { History } from './ui.History';

type D = t.InfoDataHistory;

export function history(data: D | undefined, fields: t.InfoField[], theme?: t.CommonTheme) {
  const res: t.PropListItem[] = [];
  if (!data) return res;
  if (!Is.docRef(data.doc)) return res;

  const doc = data.doc;

  const showGenesis = fields.includes('History.Genesis');
  const main: t.PropListItem = {
    label: data.label || DEFAULTS.history.label,
    value: <History doc={doc} showGenesis={showGenesis} theme={theme} />,
  };
  res.push(main);

  /**
   * History
   */
  if (fields.includes('History.List')) {
    const page = wrangle.page(data.doc, data.list);

    /**
     * History List (Grid)
     */
    const hashLength = data.item?.hashLength ?? DEFAULTS.history.item.hashLength;
    const showNav = fields.includes('History.List.NavPaging');
    res.push({
      value: <HistoryGrid page={page} hashLength={hashLength} theme={theme} style={{ flex: 1 }} />,
      divider: !showNav,
    });

    /**
     * Navigation (Paging)
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
  page(doc: t.DocRef, list: t.InfoDataHistory['list'] = {}) {
    const defaults = DEFAULTS.history.list;
    const { sort = defaults.sort, page = defaults.page, limit = defaults.limit } = list;
    return Doc.history(doc).page(page, limit, sort);
  },
} as const;
