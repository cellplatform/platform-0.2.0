import { State, Icons, type t } from './common';
import { Data } from './Model.Data';

export const renderers: t.ConnectorItemRenderers = {
  label(e) {
    return <div>{`remote:${e.item.label}`}</div>;
  },

  action(kind, helpers) {
    if (kind === 'remote:left') {
      return (e) => <Icons.Add {...helpers.icon(e, 17)} />;
    }
    return;
  },
};
