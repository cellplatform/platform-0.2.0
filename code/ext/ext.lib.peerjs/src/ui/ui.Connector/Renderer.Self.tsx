import { COLORS, Data, Icons, type t } from './common';
import { PeerLabel } from './ui.PeerLabel';

export function renderSelf(args: { ctx: t.GetConnectorCtx }): t.ConnectorItemRenderers {
  return {
    label(e) {
      const ctx = args.ctx();
      const remotes = Data.list(ctx.list).remotes.data;
      const totalRemotes = remotes.filter((d) => d.remoteid).length;
      const peerWidth = totalRemotes === 0 ? undefined : 30;

      const data = Data.self(e.item);
      if (data.copied) return <>{'copied'}</>;

      const uri = `me:${data.localid}`;
      const { selected, focused } = e;
      return <PeerLabel uri={uri} prefixWidth={peerWidth} selected={selected} focused={focused} />;
    },

    action(e, helpers) {
      if (e.kind === 'self:left') {
        const color = e.selected ? e.color : COLORS.BLUE;
        return <Icons.Person {...helpers.icon(e, 17)} color={color} />;
      }

      if (e.kind === 'self:right') {
        const data = Data.self(e.item);
        if (!(e.selected && e.focused)) return null;
        if (data.copied) {
          return <Icons.Done {...helpers.icon(e, 18)} tooltip={'Copied'} offset={[0, -1]} />;
        } else {
          return <Icons.Copy {...helpers.icon(e, 16)} tooltip={'Copy to clipboard'} />;
        }
      }

      return;
    },
  };
}
