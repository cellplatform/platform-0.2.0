import { DEFAULTS, type t, Spinner } from './common';
import { projectItem } from './field.Projects.item';
import { Error } from './ui.Error';

export function listProjects(data: t.InfoData, theme?: t.CommonTheme): t.PropListItem[] {
  const res: t.PropListItem[] = [];
  const projects = data.projects ?? {};

  const elSpinner = projects.loading && <Spinner.Bar width={30} theme={theme} />;
  const elError = projects.error && <Error data={projects.error} theme={theme} />;
  res.push({
    label: data.projects?.label ?? DEFAULTS.projects.label,
    value: elError || elSpinner || undefined,
  });

  const items = (projects.list ?? []).map((project, i) => projectItem(i, data, project, theme));
  res.push(...items);

  // Finish up.
  return res;
}
