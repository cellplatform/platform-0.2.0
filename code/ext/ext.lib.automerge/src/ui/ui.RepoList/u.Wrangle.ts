import { Is, DEFAULTS, type t } from './common';

export const Wrangle = {
  behaviors(props: t.RepoListProps) {
    const { behavior: b = {} } = props;
    const res: t.LabelItemBehaviorKind[] = ['Item', 'List'];

    const d = DEFAULTS.behavior;
    if (b.focusOnLoad ?? d.focusOnLoad) res.push('Focus.OnLoad');
    if (b.focusOnArrowKey ?? d.focusOnArrowKey) res.push('Focus.OnArrowKey');

    return res;
  },

  listState(input?: t.RepoListState | t.RepoListModel): t.RepoListState | undefined {
    if (!input) return undefined;
    if (Is.repoListState(input)) return input;
    if (Is.repoListModel(input)) return input.list.state;
    return undefined;
  },
} as const;
