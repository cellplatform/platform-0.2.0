import { COLORS, Icons, css, type t } from './common';

export function listProjects(data: t.InfoData, fields: t.InfoField[]): t.PropListItem[] {
  const res: t.PropListItem[] = [];
  const projects = data.projects;
  if (!projects?.list) return res;

  const items = projects.list.map((project, index): t.PropListItem => {
    const id = project.id;
    const selected = id === projects.selected;
    const hasClickHandler = !!projects.onSelect;

    const styles = {
      label: css({
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        alignItems: 'center',
        cursor: hasClickHandler ? 'pointer' : 'default',
      }),
      value: css({
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        cursor: hasClickHandler ? 'pointer' : 'default',
      }),
      selected: css({
        Size: 6,
        backgroundColor: COLORS.BLUE,
        borderRadius: '100%',
        marginLeft: 5,
        marginRight: 6,
        visibility: selected ? 'visible' : 'hidden',
      }),
    };

    const name = project.name || 'Unnamed';
    const label = (
      <div {...styles.label}>
        <div {...styles.selected}></div>
        <div>{name}</div>
      </div>
    );

    const value = (
      <div {...styles.value}>
        <div>{}</div>
        <Icons.Server size={14} />
      </div>
    );

    return {
      label,
      value,
      selected,
      onClick: () => projects.onSelect?.({ id, index, project }),
    };
  });

  // Title
  const total = projects.list.length;
  res.push({
    label: 'Projects',
    value: <div {...css({ paddingRight: 4 })}>{total === 0 ? '-' : total}</div>,
  });

  // Finish up.
  res.push(...items);
  return res;
}
