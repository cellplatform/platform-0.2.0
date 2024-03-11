import { DEFAULTS, type t, Spinner } from './common';
import { projectItem } from './field.Projects.item';
import { Error } from './ui.Error';

export function listProjects(data: t.InfoData): t.PropListItem[] {
  const res: t.PropListItem[] = [];
  const projects = data.projects ?? {};

  const elSpinner = projects.loading && <Spinner.Bar width={30} />;
  const elError = projects.error && <Error data={projects.error} />;
  res.push({
    label: data.projects?.label ?? DEFAULTS.projects.label,
    value: elError || elSpinner || undefined,
  });

  const items = (projects.list ?? []).map((project, i) => projectItem(data, project, i));
  res.push(...items);

  // Finish up.
  return res;
}
