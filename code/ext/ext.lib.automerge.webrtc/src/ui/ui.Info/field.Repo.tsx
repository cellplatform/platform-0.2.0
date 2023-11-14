import { UI } from 'ext.lib.automerge';
import { type t } from './common';

export function fieldRepo(data: t.InfoData) {
  const repo = data.repo;
  if (!repo) return undefined;

  const value = <UI.Info style={{ flex: 1 }} fields={['Repo']} data={{ repo }} />;
  return { value };
}
