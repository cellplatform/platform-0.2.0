import { COLORS, Data, Icons, LabelItem, type t } from './common';
import { PeerLabel } from './ui.PeerLabel';

export function renderSelf(args: { ctx: t.GetConnectorCtx }): t.ConnectorItemRenderers {
  return {
    label(e) {
      const ctx = args.ctx();
      const remotes = Data.list(ctx.list).remotes.data;
      const totalRemotes = remotes.filter((d) => d.remoteid).length;
      const peerWidth = totalRemotes === 0 ? undefined : 28;

      const data = Data.self(e.item);
      if (data.actionCompleted) return <>{data.actionCompleted.message}</>;

      const uri = `self:${data.peerid}`;
      const { selected, focused } = e;
      return (
        <PeerLabel
          uri={uri}
          prefixColor={!(selected && focused) ? COLORS.BLUE : undefined}
          prefixWidth={peerWidth}
          selected={selected}
          focused={focused}
        />
      );
    },

    action(e, helpers) {
      const ctx = args.ctx();
      const data = Data.self(e.item);

      if (e.kind === 'self:left') {
        const isOpen = ctx.peer.current.open;
        const opacity = isOpen ? 1 : 0.3;
        const color = e.selected && e.focused ? e.color : COLORS.BLUE;
        return (
          <Icons.Person
            {...helpers.icon(e, 17)}
            color={color}
            opacity={opacity}
            style={{
              transform: `scale(${isOpen ? 1 : 0.8})`,
              transition: 'opacity 0.2s, transform 0.2s',
            }}
          />
        );
      }

      if (e.kind === 'self:right') {
        if (!(e.selected && e.focused)) return null;

        if (data.purgePending) {
          return (
            <LabelItem.Button
              selected={e.selected}
              focused={e.focused}
              enabled={e.enabled}
              label={'Purge'}
            />
          );
        }

        if (data.actionCompleted) {
          return (
            <Icons.Done
              {...helpers.icon(e, 18)}
              offset={[0, -1]}
              tooltip={data.actionCompleted.tooltip}
            />
          );
        }

        return <Icons.Copy {...helpers.icon(e, 16)} tooltip={'Copy to clipboard'} />;
      }

      return;
    },
  };
}
