import { DEFAULTS, Icons, type t } from '../common';

export const Sample = {
  item() {
    const initial: t.LabelItem = {
      label: 'hello 👋',

      // placeholder: 'foobar',

      left: {
        kind: 'left',
      },

      right: {
        kind: 'foobar',
        enabled(e) {
          return !e.editing;
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

    return { initial } as const;
  },

  get renderers(): t.LabelItemRenderers {
    return {
      label(e) {
        return <div>{`🌳:${e.item.label || 'empty'}`}</div>;
      },
      placeholder(e) {
        return <div>{`placeholder:${e.item.placeholder || 'none'}`}</div>;
      },
    };
  },
};
