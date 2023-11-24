import { type t } from './common';
import { Data } from './Data';
import { Wrangle } from './u.Wrangle';

export function GetItem(
  index: t.StoreIndex,
  array: t.RepoArray,
  filter?: t.RepoIndexFilter,
): t.RepoArray['getItem'] {
  return (target) => {
    const [item, i] = array.getItem(target);
    const docs = Wrangle.filterDocs(index.doc.current, filter);
    const doc = docs[i];

    if (doc && item && item?.current.data?.mode !== 'Doc') {
      item.change((d) => {
        const data = Data.item(d);
        data.mode = 'Doc';
        data.uri = doc.uri;
        d.editable = true;
        if (doc.name) d.label = doc.name;
      });
    }

    return [item, i];
  };
}
