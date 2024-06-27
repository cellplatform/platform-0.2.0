import { Doc } from '../../crdt';
import { DEFAULTS, Is, MonoHash, type t } from './common';

type D = t.InfoDataDoc;

export function head(ctx: t.InfoFieldCtx, data: D | undefined) {
  const res: t.PropListItem[] = [];
  if (!data || !Is.doc(data.ref)) return res;

  const doc = data.ref;
  const heads = Doc.heads(doc);

  const title = data.head?.label ?? DEFAULTS.doc.head.label;
  if (!doc || heads.length === 0) {
    res.push({ label: title, value: '-' });
    return res;
  }

  const hashLength = data.head?.hashLength ?? DEFAULTS.doc.head.hashLength;
  const hashElement = (hash: string) => {
    return <MonoHash hash={hash} theme={ctx.theme} length={hashLength} />;
  };

  res.push({ label: title, value: hashElement(heads[0]) });
  heads.slice(1).forEach((hash) => res.push({ value: hashElement(hash) }));

  return res;
}
