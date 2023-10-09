import { DEFAULTS, Icons, type t } from '../common';

export type SampleAction = 'left' | 'foobar';

export const Sample = {
  item() {
    const initial: t.LabelItem<SampleAction> = {
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

  get renderers(): t.LabelItemRenderers<SampleAction> {
    return {
      label(e) {
        return <>{`prefix-${e.item.label || 'empty'}`}</>;
      },
      placeholder(e) {
        return <>{`placeholder:${e.item.placeholder || 'none'}`}</>;
      },
      action(kind, helpers) {
        switch (kind) {
          case 'left':
            return (e) => <Icons.Repo {...helpers.icon(e, 17, [0, 1])} />;
          case 'foobar':
            return (e) => <Icons.ObjectTree {...helpers.icon(e, 17)} />;
        }
      },
    };
  },
};
