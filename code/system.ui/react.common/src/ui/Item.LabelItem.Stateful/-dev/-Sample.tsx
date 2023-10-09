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

  get renderers(): t.LabelItemRenderers<SampleAction> {
    const opacity = (e: t.LabelItemRendererArgs) => (e.enabled ? 0.9 : e.selected ? 0.5 : 0.3);
    return {
      label(e) {
        return <>{`prefix-${e.item.label || 'empty'}`}</>;
      },
      placeholder(e) {
        return <>{`placeholder:${e.item.placeholder || 'none'}`}</>;
      },

      action(kind) {
        const props = (e: t.LabelItemRendererArgs): t.IconProps => ({
          color: e.color,
          opacity: opacity(e),
        });
        switch (kind) {
          case 'left':
            return (e) => <Icons.Repo {...props(e)} size={17} offset={[0, 1]} />;
          case 'foobar':
            return (e) => <Icons.ObjectTree {...props(e)} size={17} />;
        }
      },
    };
  },
};
