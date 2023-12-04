export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.automerge.tests': () => import('./-TestRunner'),
  'ext.lib.automerge.test.db': () => import('./TestDb.SPEC'),
  'ext.lib.automerge.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'ext.lib.automerge.ui.Sample': () => import('../ui/ui.Sample/-SPEC'),
  'ext.lib.automerge.ui.Repo': () => import('../ui/ui.RepoList/-SPEC'),
};

export default Specs;
