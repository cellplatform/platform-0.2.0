import { type t } from './common';
import { Data } from './Data';

export function GetItem(index: t.StoreIndex, array: t.RepoArray): t.RepoArray['getItem'] {
  return (target) => {
    const [item, i] = array.getItem(target);
    const doc = index.doc.current.docs[i];

    if (doc && item && item?.current.data?.mode !== 'Doc') {
      item.change((d) => {
        const data = Data.item(d);
        data.mode = 'Doc';
        data.uri = doc.uri;
        d.editable = true;
      });
    }
    return [item, i];
  };
}
