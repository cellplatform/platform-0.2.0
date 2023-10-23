import { Data, Icons, LabelItem, PeerUri, type t } from './common';
import { PeerLabel } from './ui.PeerLabel';

export function renderRemote(args: { ctx: t.GetConnectorCtx }): t.ConnectorItemRenderers {
  return {
    label(e) {
      const data = Data.remote(e.item);
      const uri = PeerUri.uri(data.remoteid);
      return <PeerLabel uri={uri} selected={e.selected} focused={e.focused} />;
    },

    placeholder(e) {
      const data = Data.remote(e.item);
      const err = data.error?.type;
      let text = e.item.placeholder;

      if (err === 'InvalidPeer') text = 'invalid peer ( please try again )';
      if (err === 'PeerIsSelf') text = 'cannot connect to yourself';
      return <>{text}</>;
    },

    action(e, helpers) {
      if (e.kind === 'remote:left') {
        return <Icons.Add {...helpers.icon(e, 17)} />;
      }

      if (e.kind === 'remote:right') {
        const data = Data.remote(e.item);
        if (data.error) {
          return <Icons.Warning {...helpers.icon(e, 18)} tooltip={'Error'} margin={[0, 2, 0, 0]} />;
        }

        /**
         * TODO 🐷
         */
        if (e.selected && data.remoteid) {
          const spinning = false;
          return (
            <LabelItem.Button
              selected={e.selected}
              focused={e.focused}
              spinning={spinning}
              label={'Connect'}
            />
          );
        }

        return null;
      }

      return;
    },
  };
}
