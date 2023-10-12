import { COLORS, Icons, type t } from './common';
import { Data } from './Data';

export function renderers(args: { ctx: t.GetRepoListCtx }): t.RepoItemRenderers {
  return {
    label(e) {
      return <>{e.item.label ?? 'Unnamed'}</>;
    },

    placeholder(e) {
      const data = Data.item(e.item);
      let label = '';
      if (data.mode === 'Add') label = 'new document';
      return <>{label}</>;
    },

    action(kind, helpers) {
      if (kind === 'Store:Left') {
        return (e) => {
          const data = Data.item(e.item);

          if (data.mode === 'Add') {
            const color = e.focused ? e.color : COLORS.BLUE;
            return <Icons.Add {...helpers.icon(e, 17)} color={color} />;
          }

          if (data.mode === 'Doc') {
            return <Icons.Databse {...helpers.icon(e, 18)} />;
          }

          return null;
        };
      }
      return;
    },
  };
}
