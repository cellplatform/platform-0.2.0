import { DEFAULTS, Icons, type t } from '../common';

export const Sample = {
  item() {
    const initial: t.LabelItem = {
      label: 'hello 👋',

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
