import { DEFAULTS, type t } from '../common';
import { CrdtNamespace } from '../../Crdt.Namespace';

/**
 * Field: Namespace → { CRDTs }
 */
export function FieldNamespace(
  fields: t.CrdtInfoField[],
  data: t.CrdtInfoData,
  info?: {},
): t.PropListItem[] {
  if (!fields.includes('Namespace')) return [];

  const ns = data.namespace ?? {};
  const title = (ns.title ?? DEFAULTS.namespace.title).trim();
  const hasTitle = title && fields.includes('Namespace.Title');
  const indent = hasTitle ? 15 : 0;

  const elEmpty = <div>{'⚠️ Supply Namespace Data'}</div>;
  const elNamespace = <CrdtNamespace indent={indent} data={ns} style={{ flex: 1 }} />;
  const component = ns ? elNamespace : elEmpty;

  // Build result.
  const res: t.PropListItem[] = [];
  if (hasTitle) res.push({ label: title });
  res.push({ value: component });

  // Finish up.
  return res;
}
