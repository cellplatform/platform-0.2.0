import { COLORS, Data, Icons, LabelItem, PeerUri, type t } from './common';

import { MediaToolbar } from '../ui.Connector.MediaToolbar';
import { PeerLabel } from './ui.PeerLabel';

export function renderRemote(args: { ctx: t.GetConnectorCtx }): t.ConnectorItemRenderers {
  return {
    label(e) {
      const data = Data.remote(e.item);
      if (data.actionCompleted) return <>{data.actionCompleted.message}</>;
      if (!data.remoteid) return;

      const uri = PeerUri.uri(data.remoteid);
      return <PeerLabel uri={uri} selected={e.selected} focused={e.focused} />;
    },

    placeholder(e) {
      const data = Data.remote(e.item);
      const err = data.error?.type;
      let text = 'paste remote peer';

      if (err === 'InvalidPeer') text = 'invalid peer ( please try again )';
      if (err === 'PeerIsSelf') text = 'cannot connect to yourself';
      if (err === 'PeerAlreadyConnected') text = 'already connected to peer';
      if (err === 'ConnectFail') text = data.error?.message || 'connection failed';

      return <>{text}</>;
    },

    action(e, helpers) {
      const data = Data.remote(e.item);
      const stage = data.stage;

      if (e.kind === 'remote:left') {
        if (data.closePending) {
          return (
            <Icons.Add {...helpers.icon(e, 17)} style={{ transform: `rotate(45deg) scale(1.3)` }} />
          );
        }

        if (stage === 'Connected') {
          return (
            <Icons.Person
              {...helpers.icon(e, 17)}
              color={e.selected && e.focused ? e.color : COLORS.BLUE}
              flipX={true}
            />
          );
        }

        return <Icons.Add {...helpers.icon(e, 17)} />;
      }

      if (e.kind === 'remote:right') {
        if (data.error) {
          return <Icons.Warning {...helpers.icon(e, 18)} tooltip={'Error'} margin={[0, 2, 0, 0]} />;
        }

        if (data.actionCompleted) {
          return (
            <Icons.Done
              {...helpers.icon(e, 18)}
              tooltip={data.actionCompleted.tooltip}
              offset={[0, -1]}
            />
          );
        }

        if (data.closePending) {
          return (
            <LabelItem.Button
              selected={e.selected}
              focused={e.focused}
              enabled={e.enabled}
              label={'Close'}
            />
          );
        }

        if (stage === 'Connected') {
          return (
            <MediaToolbar
              dataId={data.connid}
              peer={args.ctx().peer}
              selected={e.selected}
              focused={e.focused}
            />
          );
        }

        if (stage === 'Connecting' || (e.selected && data.remoteid)) {
          if (!args.ctx().list.current.editing) {
            return (
              <LabelItem.Button
                selected={e.selected}
                focused={e.focused}
                enabled={e.enabled}
                spinning={stage === 'Connecting'}
                label={'Connect'}
              />
            );
          }
        }

        return null;
      }

      return;
    },
  };
}
