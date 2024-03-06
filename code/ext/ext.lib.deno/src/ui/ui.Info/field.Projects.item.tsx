import { Button, COLORS, Icons, R, css, type t } from './common';
import { Sort } from './u.Sort';

export function projectItem(
  data: t.InfoData,
  project: t.DenoProject,
  index: number,
): t.PropListItem {
  const projects = data.projects ?? {};
  const id = project.id;
  const selected = id === projects.selected;
  const canSelect = !!projects.onSelect;
  const deployments = (data.deployments?.list ?? []).filter((d) => d.projectId === id);
  const hasDeployment = deployments.length > 0;

  const handleDeploymentClick = () => {
    if (!hasDeployment) return;
    const deployment = Sort.createdAt.desc(deployments)[0];
    projects.onOpenDeployment?.({ index, project, deployment });
  };

  const cursor = canSelect && !selected ? 'pointer' : 'default';
  const styles = {
    label: css({
      cursor,
      display: 'grid',
      gridTemplateColumns: 'auto auto auto',
      alignItems: 'center',
      columnGap: '5px',
    }),
    selected: css({
      Size: 6,
      backgroundColor: COLORS.BLUE,
      borderRadius: '100%',
      marginLeft: 10,
      marginRight: 2,
      visibility: selected ? 'visible' : 'hidden',
    }),
    value: css({
      cursor,
      display: 'grid',
      gridTemplateColumns: 'auto auto',
    }),
  };

  const name = project.name || 'Unnamed';
  const label = (
    <div {...styles.label}>
      <div {...styles.selected} />
      <Icons.Server size={14} color={COLORS.DARK} />
      <div>{name}</div>
    </div>
  );

  const tooltip = `Open in new tab`;
  const value = (
    <div {...styles.value}>
      <div>{}</div>
      <Button enabled={!!hasDeployment} onClick={handleDeploymentClick} tooltip={tooltip}>
        <Icons.Open size={14} margin={[0, 3, 0, 0]} />
      </Button>
    </div>
  );

  return {
    label,
    value,
    selected,
    onClick: () => projects.onSelect?.({ index, project }),
  };
}
