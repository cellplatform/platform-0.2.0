import { DEFAULTS, Icons, type t } from '../common';

export type SampleActionKind = 'left' | 'foobar';

export const Sample = {
  item() {
    const initial: t.LabelItem<SampleActionKind> = {
      label: 'hello 👋',
      left: { kind: 'left' },
      right: { kind: 'foobar' },
    };

    return { initial } as const;
  },

  get renderers(): t.LabelItemRenderers<SampleActionKind> {
    return {
      label(e) {
        return <>{`foo-${e.item.label || 'empty'}`}</>;
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
