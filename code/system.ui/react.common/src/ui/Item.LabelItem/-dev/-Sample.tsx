import { Icons, type t } from '../../../test.ui';
import { LabelItem } from '..';

export type A = '🌳' | 'left:sample' | 'right:1' | 'right:2' | 'right:3' | 'right:button';

export const Sample = {
  /**
   * Action (Model)
   */
  actions(options: { spinning?: boolean } = {}) {
    const { spinning } = options;
    const action = (
      kind: A,
      options: { width?: number; enabled?: boolean; spinning?: boolean; button?: boolean } = {},
    ): t.LabelAction<A> => {
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
  get renderers(): t.LabelItemRenderers<A> {
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

        if (kind === 'right:button') {
          return (e) => (
            <LabelItem.Button
              selected={e.selected}
              focused={e.focused}
              enabled={e.enabled}
              spinning={false}
              label={'My Button'}
            />
          );
        }

        return;
      },
    };
  },
};
