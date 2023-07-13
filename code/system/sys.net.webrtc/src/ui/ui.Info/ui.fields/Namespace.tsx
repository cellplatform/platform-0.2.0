import { CrdtViews, type t } from '../common';

export function FieldNamespace(args: {
  fields: t.WebRtcInfoField[];
  data: t.WebRtcInfoData;
  info?: t.WebRtcInfo;
}): t.PropListItem[] {
  const namespace = args.data.namespace;
  if (!namespace || !args.fields.includes('Namespace')) return [];

  const value = (
    <CrdtViews.Info
      fields={['Namespace', 'Namespace.Title']}
      data={{ namespace }}
      style={{ flex: 1 }}
    />
  );

  return [{ value }];
}
