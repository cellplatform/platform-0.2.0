import { Icons, type t } from '../common';

export const Sample = {
  item(): t.LabelItem {
    return {
      label: 'hello 👋',

      labelRender(e) {
        return <div>{`foo:${e.item.label || 'empty'}`}</div>;
      },

      // placeholder: 'foobar',

      left: {
        kind: 'left',
        render(e) {
          return (
            <Icons.Repo size={17} color={e.color} opacity={e.enabled ? 1 : 0.3} offset={[0, 1]} />
          );
        },
      },

      right: {
        kind: 'foobar',
        enabled(e) {
          return !e.editing;
        },
        render(e) {
          return <Icons.ObjectTree size={17} color={e.color} opacity={e.enabled ? 1 : 0.3} />;
        },
        onClick(e) {
          console.info('⚡️ action → onClick:', e);
        },
      },

      is: {
        // editable: true,
        editable(e) {
          console.log('is.editable: (e):', e);
          return true;
        },
      },
    };
  },
};
