import { Doc } from '../../crdt';
import { HistoryGrid } from '../ui.History.Grid';
import { NavPaging } from '../ui.Nav.Paging';
import { DEFAULTS, Is, type t } from './common';
import { History } from './ui.History';

type D = t.InfoDataDoc;

export function history(ctx: t.InfoFieldCtx, data: D | undefined) {
  const { fields, theme } = ctx;
  const res: t.PropListItem[] = [];
  const history = data?.history;
  if (!data || !history) return res;
  if (!Is.doc(data.ref)) return res;

  const doc = data.ref;
  const showGenesis = fields.includes('Doc.History.Genesis');
  const main: t.PropListItem = {
    label: data.label || DEFAULTS.history.label,
    value: <History doc={doc} showGenesis={showGenesis} theme={theme} />,
  };
  res.push(main);

  /**
   * History
   */
  if (fields.includes('Doc.History.List')) {
    const page = wrangle.page(data.ref, history.list);

    /**
     * History List (Grid)
     */
    const hashLength = history.item?.hashLength ?? DEFAULTS.history.item.hashLength;
    const showNav = fields.includes('Doc.History.List.NavPaging');
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
  page(doc: t.Doc, list: t.InfoDataDocHistory['list'] = {}) {
    const defaults = DEFAULTS.history.list;
    const { sort = defaults.sort, page = defaults.page, limit = defaults.limit } = list;
    return Doc.history(doc).page(page, limit, sort);
  },
} as const;
