import { COLORS, Data, Icons, LabelItem, PeerUri, type t } from './common';
import { PeerLabel } from './ui.PeerLabel';

export function renderRemote(args: { ctx: t.GetConnectorCtx }): t.ConnectorItemRenderers {
  return {
    label(e) {
      const data = Data.remote(e.item);
      const uri = PeerUri.uri(data.remoteid);
      if (data.copied) return <>{'copied'}</>;
      return <PeerLabel uri={uri} selected={e.selected} focused={e.focused} />;
    },

    placeholder(e) {
      const data = Data.remote(e.item);
      const err = data.error?.type;
      let text = e.item.placeholder;

      if (err === 'InvalidPeer') text = 'invalid peer ( please try again )';
      if (err === 'PeerIsSelf') text = 'cannot connect to yourself';
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
              color={e.selected ? e.color : COLORS.BLUE}
              style={{ transform: 'scaleX(-1)' }}
            />
          );
        }

        return <Icons.Add {...helpers.icon(e, 17)} />;
      }

      if (e.kind === 'remote:right') {
        if (data.error) {
          return <Icons.Warning {...helpers.icon(e, 18)} tooltip={'Error'} margin={[0, 2, 0, 0]} />;
        }

        if (data.copied) {
          return <Icons.Done {...helpers.icon(e, 18)} tooltip={'Copied'} offset={[0, -1]} />;
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
          /**
           * TODO 🐷
           * Connected icons - Video | Screenshare
           */
          return;
        }

        if (stage === 'Connecting' || (e.selected && data.remoteid)) {
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

        return null;
      }

      return;
    },
  };
}
