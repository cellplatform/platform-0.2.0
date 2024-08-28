import { Pkg } from '../index.pkg';
import type { t } from './common';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.test.db`]: () => import('./TestDb.SPEC'),
  [`${ns}.sync.Textbox`]: () => import('../crdt.sync/TextboxSync/-SPEC'),
  [`${ns}.ui.Info`]: () => import('../ui/ui.Info/-SPEC'),
  [`${ns}.ui.Info.Stateful`]: () => import('../ui/ui.Info/-SPEC.Stateful'),
  [`${ns}.ui.RepoList`]: () => import('../ui/ui.RepoList/-SPEC'),
  [`${ns}.ui.RepoList.Virtual`]: () => import('../ui/ui.RepoList.Virtual/-SPEC'),
  [`${ns}.ui.Doc.History.Grid`]: () => import('../ui/ui.History.Grid/-SPEC'),
  [`${ns}.ui.Doc.History.Commit`]: () => import('../ui/ui.History.Commit/-SPEC'),
  [`${ns}.ui.DocUri`]: () => import('../ui/ui.DocUri/-SPEC'),
  [`${ns}.ui.Nav.Paging`]: () => import('../ui/ui.Nav.Paging/-SPEC'),
  [`${ns}.ui.Cmd.Bar`]: () => import('../ui/ui.Cmd.Bar/-SPEC'),
  [`${ns}.ui.useDocs`]: () => import('../ui/ui.use/-SPEC.useDocs'),
} as t.SpecImports;

export default Specs;
