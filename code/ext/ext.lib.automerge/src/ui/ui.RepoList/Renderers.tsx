import { COLORS, Data, Icons, type t } from './common';

export const Renderers = {
  /**
   * Initilise the router for the <Component>'s that render within an item.
   */
  init(args: { ctx: t.RepoListCtxGet }): t.RepoItemRenderers {
    return {
      label(e) {
        const data = Data.item(e.item);
        if (data.mode === 'Add') return;
        if (!e.item.label) return;
        return <>{e.item.label}</>;
      },

      placeholder(e) {
        const data = Data.item(e.item);
        let text = '';
        if (data.mode === 'Add') text = 'new document';
        if (data.mode === 'Doc') text = Wrangle.placeholderUri(data.uri);
        return <>{text}</>;
      },

      action(e, helpers) {
        if (e.kind === 'Store:Left') {
          const data = Data.item(e.item);

          if (data.mode === 'Add') {
            const color = e.focused ? e.color : COLORS.BLUE;
            return <Icons.Add {...helpers.icon(e, 17)} color={color} />;
          }

          if (data.mode === 'Doc') {
            return <Icons.Database {...helpers.icon(e, 18)} />;
          }
        }
        return;
      },
    };
  },
};

/**
 * Helpers
 */
export const Wrangle = {
  placeholderUri(text?: string) {
    if (!text) return 'doc:uri';
    return `doc:${text.split(':')[1]}`;
  },
} as const;
