import { Icons, type t } from '../../../test.ui';

type K = '🌳' | 'left:sample' | 'right:1' | 'right:2' | 'right:3';

export const Sample = {
  /**
   * Action (Model)
   */
  actions(options: { spinning?: boolean } = {}) {
    const { spinning } = options;
    const action = (
      kind: K,
      options: { width?: number; enabled?: boolean; spinning?: boolean; button?: boolean } = {},
    ): t.LabelAction<K> => {
      const { width, enabled, button } = options;
      return {
        kind,
        width,
        enabled,
        button,
        spinning: options.spinning ?? spinning,
      };
    };
    const left = [
      //
      action('left:sample', { width: 25 }),
      action('🌳', { width: 25 }),
    ];
    const right = [
      //
      action('right:1', { enabled: false }),
      action('right:2', {}),
      action('right:3', { button: false }),
    ];

    return { left, right };
  },

  /**
   * Visual Renderers
   */
  get renderers(): t.LabelItemRenderers<K> {
    return {
      action(kind, helpers) {
        if (kind === 'left:sample') {
          return (e) => <Icons.Keyboard.outline {...helpers.icon(e, 17)} />;
        }

        if (kind === 'right:1') {
          return (e) => <Icons.ObjectTree {...helpers.icon(e, 17)} />;
        }

        if (kind === 'right:2') {
          return (e) => <Icons.ObjectTree {...helpers.icon(e, 17)} />;
        }

        if (kind === 'right:3') {
          return (e) => <Icons.Face {...helpers.icon(e, 18)} />;
        }

        return;
      },
    };
  },
};
