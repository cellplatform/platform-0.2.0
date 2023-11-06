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
    ): t.LabelItemAction<A> => {
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
      label(e) {
        // return 'overridden label';
        // return null; //   NB: (suppress)
        // return false; //  NB: (supress)
        return undefined; // NB: Default.
      },

      placeholder(e) {
        // return 'overridden placeholder';
        // return null; //   NB: (suppress)
        // return false; //  NB: (supress)
        return undefined; // NB: Default.
      },

      action(e, helpers) {
        if (e.kind === 'left:sample') {
          return <Icons.Keyboard.outline {...helpers.icon(e, 17)} />;
        }

        if (e.kind === 'right:1') {
          return <Icons.ObjectTree {...helpers.icon(e, 17)} />;
        }

        if (e.kind === 'right:2') {
          return <Icons.ObjectTree {...helpers.icon(e, 17)} />;
        }

        if (e.kind === 'right:3') {
          return <Icons.Face {...helpers.icon(e, 18)} />;
        }

        if (e.kind === 'right:button') {
          return (
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
