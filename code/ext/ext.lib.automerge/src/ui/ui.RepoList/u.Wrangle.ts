import { DEFAULTS, Is, type t } from './common';

export const Wrangle = {
  behaviors(props: t.RepoListProps) {
    const { behaviors = DEFAULTS.behaviors.defaults } = props;
    const res: t.LabelItemBehaviorKind[] = ['Item', 'List', ...behaviors];
    return res;
  },

  listState(input?: t.RepoListState | t.RepoListModel): t.RepoListState | undefined {
    if (!input) return undefined;
    if (Is.repoListState(input)) return input;
    if (Is.repoListModel(input)) return input.list.state;
    return undefined;
  },
} as const;
