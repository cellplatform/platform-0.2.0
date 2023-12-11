import { type t } from './common';

import { Data } from './Data';
import { ItemModel } from './Model.Item';
import { Wrangle } from './u.Wrangle';

export function GetItem(getCtx: t.RepoListCtxGet, array: t.RepoArray): t.GetRepoLabelItem {
  const indexTotal = () => Wrangle.total(getCtx);
  let _addItem: t.RepoItemState | undefined;

  return (target) => {
    if (!_addItem) {
      const { dispose$ } = getCtx();
      _addItem = ItemModel.state(getCtx, 'Add', { dispose$ });
    }

    if (typeof target === 'number') {
      if (target === indexTotal()) {
        return [_addItem, target];
      } else {
        const { index, filter } = getCtx();
        const [item, i] = array.getItem(target);
        const docs = Wrangle.filterDocs(index.doc.current, filter);
        const doc = docs[i];
        updateItemFromDoc(item, doc);
        return [item, i];
      }
    }

    if (typeof target === 'string') {
      if (target === _addItem.instance) return [_addItem, indexTotal()];
      return array.getItem(target);
    }

    // Not found.
    return [undefined, -1];
  };
}

/**
 * Helpers
 */
function updateItemFromDoc(item?: t.RepoItemState, doc?: t.StoreIndexDocItem) {
  if (!doc || item?.current.data?.kind !== 'Doc') return;
  if (!item.current.data?.uri) item.change((d) => (Data.item(d).uri = doc.uri));
  if (item.current.label !== doc.name) item.change((d) => (d.label = doc.name));
}
