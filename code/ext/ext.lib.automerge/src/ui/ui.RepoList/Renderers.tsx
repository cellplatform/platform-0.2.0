import { COLORS, DEFAULTS, Data, DocUri, Hash, Icons, css, type t } from './common';

export const Renderers = {
  /**
   * Initilise the router for the <Component>'s that render within an item.
   */
  init(props: t.RepoListProps): t.RepoItemRenderers {
    const { behaviors = DEFAULTS.behaviors.default } = props;

    return {
      label(e) {
        const data = Data.item(e.item);
        if (data.mode === 'Add') return;
        if (!e.item.label) return;
        return <>{e.item.label}</>;
      },

      placeholder(e) {
        const data = Data.item(e.item);
        if (data.mode === 'Add') {
          return <>{'new document'}</>;
        }
        if (data.mode === 'Doc') {
          const style = css({
            fontFamily: 'monospace',
            fontSize: 11,
          });
          const uri = Wrangle.placeholderUri(data.uri);
          return <div {...style}>{uri}</div>;
        }
        return <>{'placeholder'}</>;
      },

      action(e, helpers) {
        const data = Data.item(e.item);

        if (e.kind === 'Item:Left') {
          const data = Data.item(e.item);

          if (data.mode === 'Add') {
            const color = e.focused ? e.color : COLORS.BLUE;
            return <Icons.Add {...helpers.icon(e, 17)} color={color} />;
          }

          if (data.mode === 'Doc') {
            return <Icons.Database {...helpers.icon(e, 18)} />;
          }
        }

        if (e.kind === 'Item:Right' && data.mode === 'Doc') {
          if (e.selected && behaviors.includes('Share')) {
            e.set.ctx<t.RepoListActionCtx>({ kind: 'Share' });
            return <Icons.Share {...helpers.icon(e, 18)} />;
          }
        }

        return null; // Default no icon.
      },
    };
  },
} as const;

/**
 * Helpers
 */
export const Wrangle = {
  placeholderUri(text?: string) {
    if (!text) return 'doc: uri';
    const id = DocUri.id(text);
    const hash = Hash.shorten(id, [4, 4]);
    return `crdt:${hash}`;
  },
} as const;
