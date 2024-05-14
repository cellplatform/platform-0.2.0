import { Doc } from '../../crdt';
import { DEFAULTS, Is, MonoHash, type t } from './common';

type D = t.InfoDataDoc;

export function head(data: D | undefined, fields: t.InfoField[], theme?: t.CommonTheme) {
  const res: t.PropListItem[] = [];
  if (!data || !Is.docRef(data.ref)) return res;

  const doc = data.ref;
  const heads = Doc.heads(doc);

  const title = data.head?.label ?? DEFAULTS.doc.head.label;
  if (!doc || heads.length === 0) {
    res.push({ label: title, value: '-' });
    return res;
  }

  const hashLength = data.head?.hashLength ?? DEFAULTS.doc.head.hashLength;
  const hashElement = (hash: string) => {
    return <MonoHash hash={hash} theme={theme} length={hashLength} />;
  };

  res.push({ label: title, value: hashElement(heads[0]) });
  heads.slice(1).forEach((hash) => res.push({ value: hashElement(hash) }));

  return res;
}
