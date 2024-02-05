import { Pkg } from '../index.pkg.mjs';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.ui.Info`]: () => import('../ui/ui.Info/-SPEC'),
  [`${ns}.ui.RepoList`]: () => import('../ui/ui.RepoList/-SPEC'),
  [`${ns}.ui.RepoList.Virtual`]: () => import('../ui/ui.RepoList.Virtual/-SPEC'),
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.test.db`]: () => import('./TestDb.SPEC'),
};

export default Specs;
