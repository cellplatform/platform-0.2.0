import { DEFAULTS, type t } from './common';

export const Wrangle = {
  behaviors(props: t.RepoListProps) {
    const { behavior: b = {} } = props;
    const res: t.LabelItemBehaviorKind[] = ['Item', 'List'];

    const d = DEFAULTS.behavior;
    if (b.focusOnLoad ?? d.focusOnLoad) res.push('Focus.OnLoad');
    if (b.focusOnArrowKey ?? d.focusOnArrowKey) res.push('Focus.OnArrowKey');

    return res;
  },
} as const;
