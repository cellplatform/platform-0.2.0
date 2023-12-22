import { DEFAULTS, Is, type t } from './common';

type B = t.LabelItemBehaviorKind;

export const Wrangle = {
  listBehaviors(props: t.RepoListProps): B[] {
    const prop = props.model?.behaviors ?? DEFAULTS.behaviors.default;
    const behaviors = prop.filter((m) => m === 'Focus.OnArrowKey' || m === 'Focus.OnLoad') as B[];
    return ['Item', 'List', ...behaviors];
  },

  listState(input?: t.RepoListState | t.RepoListModel): t.RepoListState | undefined {
    if (!input) return undefined;
    if (Is.repoListState(input)) return input;
    if (Is.repoListModel(input)) return input.list.state;
    return undefined;
  },
} as const;
