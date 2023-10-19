import { COLORS, Icons, type t } from './common';
import { Data } from './Data';
import { PeerLabel } from './ui.PeerLabel';

export function renderers(args: { ctx: t.GetConnectorCtx }): t.ConnectorItemRenderers {
  return {
    label(e) {
      const ctx = args.ctx();
      const remotes = Data.list(ctx.list).remotes.data;
      const totalRemotes = remotes.filter((d) => d.peerid).length;
      const peerWidth = totalRemotes === 0 ? undefined : 30;

      const data = Data.self(e.item);
      const uri = `me:${data.peerid}`;
      return data.copied ? (
        <>{'copied'}</>
      ) : (
        <PeerLabel uri={uri} prefixWidth={peerWidth} selected={e.selected} focused={e.focused} />
      );
    },

    action(kind, helpers) {
      if (kind === 'self:left') {
        return (e) => {
          const color = e.selected ? e.color : COLORS.BLUE;
          return <Icons.Person {...helpers.icon(e, 17)} color={color} />;
        };
      }

      if (kind === 'self:right') {
        return (e) => {
          const data = Data.self(e.item);
          if (!(e.selected && e.focused)) return null;

          if (data.copied) {
            return <Icons.Done {...helpers.icon(e, 18)} tooltip={'Copied'} offset={[0, -1]} />;
          } else {
            return <Icons.Copy {...helpers.icon(e, 16)} tooltip={'Copy to clipboard'} />;
          }
        };
      }

      return;
    },
  };
}
