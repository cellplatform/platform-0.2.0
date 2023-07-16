import { Icons, type t } from '../../test.ui';

export const Sample = {
  /**
   * Actions
   */
  actions(options: { spinning?: boolean } = {}) {
    const { spinning } = options;
    type K = 'left:sample' | 'right:foo' | 'right:bar';
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
        icon: (e) => <Icons.ObjectTree size={17} color={e.color} offset={[0, 1]} />,
        onClick: (e) => console.info('⚡️ action → onClick:', e),
      };
    };
    const left = action('left:sample', { width: 30 });
    const right: t.LabelAction<K>[] = [
      action('right:foo', { enabled: false }),
      action('right:bar'),
    ];

    return { left, right };
  },
};
