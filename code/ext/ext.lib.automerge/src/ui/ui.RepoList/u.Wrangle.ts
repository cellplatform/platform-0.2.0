import { DEFAULTS, Is, type t } from './common';

export const Wrangle = {
  behaviors(props: t.RepoListProps): t.LabelItemBehaviorKind[] {
    const { behaviors = DEFAULTS.behaviors.default } = props;
    return ['Item', 'List', ...behaviors];
  },

  listState(input?: t.RepoListState | t.RepoListModel): t.RepoListState | undefined {
    if (!input) return undefined;
    if (Is.repoListState(input)) return input;
    if (Is.repoListModel(input)) return input.list.state;
    return undefined;
  },
} as const;
