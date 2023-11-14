import { Icons, Value, css, type t } from './common';

export function FieldRepo(data: t.InfoData) {
  if (!data.repo) return;

  const store = data.repo;
  const index = store.index;
  const name = store.name || store.store?.info.storage?.name || 'Unnamed';
  let text = `${name}`;
  if (index) {
    const documents = Value.plural(index.total, 'document', 'documents');
    text = `${text} → ${index.total} ${documents}`;
  }

  const styles = {
    base: css({ Flex: 'x-center-center' }),
  };

  const value = (
    <div {...styles.base}>
      <div>{text}</div>
      <Icons.Repo size={14} style={{ marginLeft: 4 }} offset={[0, 1]} />
    </div>
  );

  const res: t.PropListItem = {
    label: store.label || 'Store',
    value,
  };

  return res;
}
