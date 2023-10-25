import { Icons, type t } from '../common';

export type SampleActionKind = 'left' | 'right';

export const Sample = {
  item() {
    const initial: t.LabelItem<SampleActionKind> = {
      label: 'hello 👋',
      left: { kind: 'left' },
      right: { kind: 'right' },
    };
    return { initial } as const;
  },

  get renderers(): t.LabelItemRenderers<SampleActionKind> {
    return {
      label(e) {
        return <>{`(${e.index.toLocaleString()}) ${e.item.label || 'empty'}`}</>;
      },
      placeholder(e) {
        return <>{`placeholder:${e.item.placeholder || 'none'}`}</>;
      },
      action(e, helpers) {
        if (e.kind === 'left') return <Icons.Repo {...helpers.icon(e, 17, [0, 1])} />;
        if (e.kind === 'right') return <Icons.ObjectTree {...helpers.icon(e, 17)} />;
        return;
      },
    };
  },
};
