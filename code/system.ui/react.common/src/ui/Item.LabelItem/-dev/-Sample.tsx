import { Icons, type t } from '../../../test.ui';

type K = 'left:sample' | 'right:foo' | 'right:bar' | '🌳';

export const Sample = {
  /**
   * Action (Model)
   */
  actions(options: { spinning?: boolean } = {}) {
    const { spinning } = options;
    const action = (
      kind: K,
      options: { width?: number; enabled?: boolean; spinning?: boolean } = {},
    ): t.LabelAction<K> => {
      const { width, enabled } = options;
      return {
        kind,
        width,
        enabled,
        spinning: options.spinning ?? spinning,
        onClick: (e) => console.info('⚡️ action → onClick:', e),
      };
    };
    const left = [
      //
      action('left:sample', { width: 25 }),
      action('🌳', { width: 25 }),
    ];
    const right = [
      //
      action('right:foo', { enabled: false }),
      action('right:bar'),
    ];

    return { left, right };
  },

  /**
   * Visual Renderers
   */
  get renderers(): t.LabelItemRenderers<K> {
    return {
      action(kind, helpers) {
        switch (kind) {
          case 'left:sample':
            return (e) => <Icons.Keyboard.outline {...helpers.icon(e, 17)} />;
          case 'right:foo':
            return (e) => <Icons.ObjectTree {...helpers.icon(e, 17)} />;
          case 'right:bar':
            return (e) => <Icons.ObjectTree {...helpers.icon(e, 17)} />;
          default:
            return;
        }
      },
    };
  },
};
