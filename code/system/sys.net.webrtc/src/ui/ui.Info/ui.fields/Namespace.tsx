import { CrdtViews, type t } from '../common';

export function FieldNamespace(args: {
  fields: t.WebRtcInfoField[];
  data: t.WebRtcInfoData;
  info?: t.WebRtcInfo;
}): t.PropListItem[] {
  const namespace = args.data.namespace;
  if (!namespace || !args.fields.includes('State.Shared.Namespace')) return [];

  const value = <CrdtViews.Info fields={['Namespace']} data={{ namespace }} style={{ flex: 1 }} />;
  return [{ value }];
}
