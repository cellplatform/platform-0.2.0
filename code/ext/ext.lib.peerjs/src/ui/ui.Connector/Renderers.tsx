import { Data } from './Data';
import { renderRemote } from './Renderer.Remote';
import { renderSelf } from './Renderer.Self';
import { type t } from './common';

const selfActions: t.ConnectorAction[] = ['self:left', 'self:right'];
const remoteActions: t.ConnectorAction[] = ['remote:left', 'remote:right'];

export const Renderers = {
  /**
   * Initilise the router for item <Component> renderers.
   */
  init(args: { ctx: t.GetConnectorCtx }): t.ConnectorItemRenderers {
    const self = renderSelf(args);
    const remote = renderRemote(args);

    const getRenderer = (e: t.LabelItemRenderArgs) => {
      const kind = Data.kind(e.item);
      if (kind === 'peer:self') return self;
      if (kind === 'peer:remote') return remote;
      throw new Error(`Renderer "${kind}" not found`);
    };

    return {
      label: (e) => getRenderer(e)?.label?.(e),
      placeholder: (e) => getRenderer(e)?.placeholder?.(e),
      action(e, helpers) {
        const render = getRenderer(e).action;
        if (selfActions.includes(e.kind)) return render?.(e, helpers);
        if (remoteActions.includes(e.kind)) return render?.(e, helpers);
        return;
      },
    };
  },
};