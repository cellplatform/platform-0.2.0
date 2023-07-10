import { type t } from '../common';
import { CrdtNamespace } from '../../Crdt.Namespace';

/**
 * Field: Namespace → { CRDTs }
 */
export function FieldNamespace(data: t.CrdtInfoData, info?: {}) {
  const elEmpty = <div>{'⚠️ Supply Namespace Data'}</div>;
  const elNamespace = <CrdtNamespace data={data.namespace} style={{ flex: 1 }} />;
  const value = data.namespace ? elNamespace : elEmpty;

  const item: t.PropListItem = { value };
  return item;
}
