import { Icons, type t } from '../../../test.ui';

export const Sample = {
  /**
   * Actions
   */
  actions(options: { spinning?: boolean } = {}) {
    const { spinning } = options;
    type K = 'left:sample' | 'right:foo' | 'right:bar' | '🌳';
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
        element(e) {
          return <Icons.ObjectTree size={17} color={e.color} opacity={e.enabled ? 1 : 0.3} />;
        },
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
};
