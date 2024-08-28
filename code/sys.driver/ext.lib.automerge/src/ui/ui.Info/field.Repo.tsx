import { DEFAULTS, Icons, Is, Value, css, type t } from './common';

export function repo(ctx: t.InfoFieldCtx, keyName?: t.InfoRepoName) {
  const repo = (ctx.repos ?? {})[keyName ?? ''];
  if (!repo) return;

  const index = repo.index;
  const name = wrangle.name(repo);
  let text = `${name}`;
  if (index) {
    const documents = Value.plural(index.total(), 'document', 'documents');
    text = `${text} ← ${index.total()} ${documents}`;
  }

  const styles = { base: css({ Flex: 'x-center-center' }) };
  const value = (
    <div {...styles.base}>
      <Icons.Database size={14} offset={[0, 1]} style={{ marginRight: 3 }} />
      <div>{text}</div>
      {index && <Icons.Repo size={14} offset={[0, 1]} style={{ marginLeft: 4 }} />}
    </div>
  );

  const res: t.PropListItem = {
    label: repo.label || DEFAULTS.repo.label,
    value,
  };

  return res;
}

/**
 * Helpers
 */
const wrangle = {
  name(repo: t.InfoRepo) {
    const UNKNOWN = 'Unknown';
    if (!repo) return UNKNOWN;
    if (repo.name) return repo.name;
    if (Is.webStore(repo.store)) {
      const name = repo.store?.info.storage?.name;
      if (name) return name;
    }
    return UNKNOWN;
  },
} as const;
