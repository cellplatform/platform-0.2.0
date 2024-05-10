import { DEFAULTS, type t } from '../common';
import { Network } from '../ui/Network';
import { SyncTraffic } from '../ui/Network.SyncTraffic';

export function FieldNetwork(data: t.CrdtInfoData, info?: {}): t.PropListItem[] {
  const res: t.PropListItem[] = [];
  const syncDoc = data.network?.doc;
  const indent = DEFAULTS.indent;

  res.push({
    label: syncDoc ? 'Network Sync' : 'Network',
    value: <Network syncDoc={syncDoc} />,
  });

  if (syncDoc) {
    res.push({
      label: 'Traffic',
      value: <SyncTraffic syncDoc={syncDoc} />,
      indent,
    });
  }

  return res;
}
