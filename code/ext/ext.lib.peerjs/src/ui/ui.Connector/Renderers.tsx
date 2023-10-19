import { type t } from './common';
import { Data } from './Data';
import { Model } from './Model';

const selfActions: t.ConnectorAction[] = ['self:left', 'self:right'];
const remoteActions: t.ConnectorAction[] = ['remote:left', 'remote:right'];

export const Renderers = {
  /**
   * Initilise the router for item <Component> renderers.
   */
  init(args: { ctx: t.GetConnectorCtx }): t.ConnectorItemRenderers {
    const self = Model.Self.renderers(args);
    const remote = Model.Remote.renderers(args);

    const getRenderer = (e: t.LabelItemRendererArgs) => {
      const kind = Data.kind(e.item);
      if (kind === 'peer:self') return self;
      if (kind === 'peer:remote') return remote;
      return;
    };

    return {
      label: (e) => getRenderer(e)?.label?.(e),
      placeholder: (e) => getRenderer(e)?.placeholder?.(e),
      action(kind, helpers) {
        if (selfActions.includes(kind)) return self.action?.(kind, helpers);
        if (remoteActions.includes(kind)) return remote.action?.(kind, helpers);
        return;
      },
    };
  },
};
