import { Button, COLORS, Icons, R, css, type t, DEFAULTS } from './common';
import { projectItem } from './field.Projects.item';

export function listProjects(data: t.InfoData, fields: t.InfoField[]): t.PropListItem[] {
  const res: t.PropListItem[] = [];
  const projects = data.projects;
  if (!projects?.list) return res;

  const sort = R.sortBy(R.prop('createdAt'));
  const deployments = sort(data.deployments?.list ?? []);
  deployments.reverse();

  const items = projects.list.map((project, index): t.PropListItem => {
    return projectItem(data, project, index);
  });

  // Finish up.
  res.push({ label: data.projects?.label ?? DEFAULTS.projects.label }); // Title
  res.push(...items);
  return res;
}
