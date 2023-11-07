import { COLORS, Data, Icons, type t } from './common';

export const Renderers = {
  /**
   * Initilise the router for the <Component>'s that render within an item
   */
  init(args: { ctx: t.GetRepoListCtx }): t.RepoItemRenderers {
    return {
      label(e) {
        const data = Data.item(e.item);
        if (data.mode === 'Add') return;
        return <>{e.item.label ?? 'Unnamed'}</>;
      },

      placeholder(e) {
        const data = Data.item(e.item);
        let label = '';
        if (data.mode === 'Add') label = 'new document';
        return <>{label}</>;
      },

      action(e, helpers) {
        if (e.kind === 'Store:Left') {
          const data = Data.item(e.item);
          if (data.mode === 'Add') {
            const color = e.focused ? e.color : COLORS.BLUE;
            return <Icons.Add {...helpers.icon(e, 17)} color={color} />;
          }
          if (data.mode === 'Doc') {
            return <Icons.Databse {...helpers.icon(e, 18)} />;
          }
        }
        return;
      },
    };
  },
};
