import { Icons, type t } from '../common';

export type SampleActionKind = 'left' | 'right';
export type SampleRendererFlags = {
  label?: { return: null | undefined | false };
  placeholder?: { return: null | undefined | false };
  action?: { return: null | undefined | false };
};

export const Sample = {
  item() {
    const initial: t.LabelItem<SampleActionKind> = {
      label: 'hello 👋',
      left: { kind: 'left' },
      right: { kind: 'right' },
    };
    return { initial } as const;
  },

  renderers(args: SampleRendererFlags): t.LabelItemRenderers<SampleActionKind> {
    return {
      label(e) {
        if (typeof args.label === 'object') return args.label.return;
        return <>{`(${e.index.toLocaleString()}) ${e.item.label || 'empty'}`}</>;
      },
      placeholder(e) {
        if (typeof args.placeholder === 'object') return args.placeholder.return;
        return <>{`placeholder:${e.item.placeholder || 'none'}`}</>;
      },
      action(e, helpers) {
        if (typeof args.action === 'object') return args.action.return;
        if (e.kind === 'left') return <Icons.Repo {...helpers.icon(e, 17, [0, 1])} />;
        if (e.kind === 'right') return <Icons.ObjectTree {...helpers.icon(e, 17)} />;
        return;
      },
    };
  },
};
