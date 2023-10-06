import { Icons, type t } from '../common';

export const Sample = {
  item(): t.LabelItem {
    return {
      label: 'hello 👋',
      // placeholder: 'foobar',
      right: {
        kind: 'foobar',
        enabled(e) {
          // console.log('enabled', e);
          return !e.editing && Boolean(e.label.trim());
        },
        icon(e) {
          // console.log('icon', e);
          return <Icons.ObjectTree size={17} color={e.color} opacity={e.enabled ? 1 : 0.3} />;
        },
        onClick(e) {
          console.info('⚡️ action → onClick:', e);
        },
      },

      is: {
        editable(e) {
          console.log('is.editable:', e);
          return true;
        },
      },
    };
  },
};
