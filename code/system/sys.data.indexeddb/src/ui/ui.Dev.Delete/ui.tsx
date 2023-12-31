import { useEffect, useState } from 'react';
import { IndexedDb } from '../../IndexedDb';
import { DevReload } from '../ui.Dev.Reload';
import { COLORS, Color, DEFAULTS, R, css, rx, type t } from './common';
import { List } from './ui.List';

export const View: React.FC<t.DevDeleteProps> = (props) => {
  const { filter = DEFAULTS.filter } = props;
  const [reloadRequired, setReloadRequired] = useState(false);
  const [items, setItems] = useState<t.DevDbItem[]>([]);
  const [deleted, setDeleted] = useState<t.DevDbItem['name'][]>([]);

  /**
   * Handlers
   */
  const handleDelete = async (e: t.DevDbDeleteClickHandlerArgs) => {
    if (!e.item.isDeletable) return;
    const name = e.item.name;
    setReloadRequired(true);
    setDeleted(R.uniq([...deleted, name]));
    await IndexedDb.delete(name);
  };

  /**
   * Lifecycle
   */
  useEffect(() => {
    const life = rx.lifecycle();
    indexedDB.databases().then((dbs) => {
      if (!life.disposed) setItems(wrangle.items(dbs, filter));
    });
    return life.dispose;
  }, [reloadRequired, items.length, deleted.length]);

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      minHeight: 200,
      minWidth: 500,
      display: 'grid',
      gridTemplateColumns: '1fr auto',
    }),
    reload: css({
      minWidth: 200,
      borderLeft: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <List items={items} deleted={deleted} onDeleteClick={handleDelete} />
      <DevReload style={styles.reload} isReloadRequired={reloadRequired} isCloseable={false} />
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  items(dbs: IDBDatabaseInfo[], filter: t.DevDeleteFilter): t.DevDbItem[] {
    return dbs
      .filter((e) => !!e.name)
      .map((e) => {
        const name = e.name ?? 'Unknown';
        const version = e.version ?? -1;
        const isDeletable = filter({ name, version });
        return { name, version, isDeletable };
      });
  },
} as const;
